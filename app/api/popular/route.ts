import connectDB from "@/app/lib/mongoose";
import User from "@/app/models/user";
import mongoose from "mongoose";
import { NextResponse } from "next/server";
import _ from 'lodash';
import RecipePopularConfig from "@/app/models/popular-config";
// import { PipelineStage } from "mongoose";





interface UserMultiplier {
    id: string;
    category: string;
    multiplier: number[];
    history_length_average: number
}


let warnedFromBig = false;
const SCALE = 1_000_000n;
const LAMBDA = toBig(0.6);
const VIEWS_SMOOTH = 50n;



function toBig(x: number): bigint {
    return BigInt(Math.round(x * Number(SCALE)));
}



function fromBig(x: bigint): number {
    const MAX_SAFE = BigInt(Number.MAX_SAFE_INTEGER);
    const MAX_X = MAX_SAFE * SCALE;

    const oldX = x;

    if (x > MAX_X) x = MAX_X;
    if (x < -MAX_X) x = -MAX_X;

    if (!warnedFromBig && oldX !== x) {
        console.warn(`fromBig: the number was truncated due to size: ${oldX}`);
        warnedFromBig = true;
    }

    return Number(x) / Number(SCALE);
}

function averageCalc({ multiplier, history_length_average }: { multiplier: number[], history_length_average: number }): number {
    if (!multiplier || multiplier.length === 0 || history_length_average === 0) {
        return multiplier?.[0] ?? 0
    }

    const oldAvg = toBig(multiplier[0]);
    const oldCount = BigInt(history_length_average);

    const tail = multiplier.slice(1).map(toBig);
    const sumTail = tail.reduce((a, b) => a + b, 0n);

    const totalSum = oldAvg * oldCount + sumTail;
    const totalCount = oldCount + BigInt(tail.length);

    const newAvg = fromBig(totalSum / totalCount);

    return newAvg;
}

function buildUserWeights(userList: UserMultiplier[]) {
    const map = new Map<string, number>();

    for (const u of userList) {
        if (!u.multiplier || !Array.isArray(u.multiplier) || u.multiplier.length === 0) {
            map.set(u.category, 0);
            continue;
        }

        if (u.history_length_average > 50) {
            const avgValue = averageCalc({ multiplier: u.multiplier, history_length_average: u.history_length_average });
            map.set(u.category, avgValue);
        } else {
            const avgValue = averageCalc({ multiplier: u.multiplier, history_length_average: 1 });
            map.set(u.category, avgValue);
        }
    }

    return map;
}


function computeCategoryMatch(itemCategories: string[], weights: Map<string, number>) {
    const recipeLen = itemCategories.length;

    if (recipeLen === 0) {
        return {
            matchCoef: 0n,
            avgUserCoef: toBig(0.01),
        };
    }

    const recipeLenBig = toBig(recipeLen);

    let matches = 0n;// PURE number of matches
    let coefSum = 0n;

    for (const cat of itemCategories) {
        const w = weights.get(cat);
        if (w !== undefined) {
            matches += SCALE;
            coefSum += toBig(w);// category weight
        }
    }

    if (matches === 0n) {
        return {
            matchCoef: 0n,
            avgUserCoef: toBig(0.01),
        };
    }

    // r = matches / recipeLen
    const r = (matches * SCALE) / recipeLenBig;

    // preference(r) = r * (1 - λ * r)
    const noisePreference =
        (r * (SCALE - (LAMBDA * r) / SCALE)) / SCALE;

    // average weight of matching categories
    const avgUserCoef = (coefSum * SCALE) / matches;

    return {
        matchCoef: noisePreference,
        avgUserCoef,
    };
}


// Video/recipe impact based on interactions
function recipeImpactBig(item: any, categoryStrengthBig: bigint): number {
    const { comments, likes, saves, views, fully } = item;

    if (views === 0) return fromBig(categoryStrengthBig);

    const viewsBig = toBig(views);
    const likesBig = toBig(likes);
    const commentsBig = toBig(comments);
    const savesBig = toBig(saves);
    const fullyBig = toBig(fully);

    // newFully = fully + 1
    const newFullyBig = fullyBig + SCALE;

    // coefLikes = 1 + likes / views
    const coefLikesBig = SCALE + (likesBig * SCALE) / (viewsBig + VIEWS_SMOOTH);

    // coefComm = 1 + comments / views
    const coefCommBig = SCALE + (commentsBig * SCALE) / (viewsBig + VIEWS_SMOOTH);

    // coefSaves = 1 + saves / views
    const coefSavesBig = SCALE + (savesBig * SCALE) / (viewsBig + VIEWS_SMOOTH);

    // interactionScore = (coefLikes + coefComm + coefSaves + newFully) / 4
    const sumBig = coefLikesBig + coefCommBig + coefSavesBig + newFullyBig;
    const interactionScoreBig = sumBig / 4n;

    // finalScore = interactionScore * categoryStrength
    const finalScoreBig = (interactionScoreBig * categoryStrengthBig) / SCALE;

    return fromBig(finalScoreBig);
}


function rankRecipes(list: any[], userWeights: Map<string, number> | null, finalLimit: number) {
    const stage1: { item: any; categoryStrength: bigint }[] = [];
    const hasUserWeights = userWeights && userWeights.size > 0;

    for (const item of list) {
        let matchCoefBig = SCALE;  // 1.0 в bigint
        let avgUserCoefBig = SCALE; // 1.0 в bigint

        if (hasUserWeights) {
            const {
                // matchCount, 
                matchCoef, avgUserCoef } = computeCategoryMatch(
                    item.categories || [],
                    userWeights
                );

            // if (matchCount === 0n) continue;

            matchCoefBig = matchCoef; //ratio of matches between user categories and recipes
            avgUserCoefBig = avgUserCoef; //how strong the weights of the matching tags are.
        }
        // categoryStrength = matchCoef * avgUserCoef
        const categoryStrengthBig = (matchCoefBig * avgUserCoefBig) / SCALE;

        stage1.push({ item, categoryStrength: categoryStrengthBig });
    }

    stage1.sort((a, b) => {
        if (a.categoryStrength > b.categoryStrength) return -1;
        if (a.categoryStrength < b.categoryStrength) return 1;
        return 0;
    });

    const top = stage1.slice(0, 120);

    const stage2 = top.map((entry) => {
        const finalScore = recipeImpactBig(entry.item, entry.categoryStrength);
        return { item: entry.item, finalScore };
    });

    stage2.sort((a, b) => b.finalScore - a.finalScore);

    return stage2.slice(0, finalLimit).map((x) => x.item);
}



export async function POST(request: Request) {
    try {
        const { connection_id, count, getAllIds } = await request.json();
        if (!connection_id || !count) {
            return NextResponse.json({ message: "Invalid data" }, { status: 400 });
        }

        await connectDB();

        // --- get user config ---
        const userData = await User.findOne({ connection_id }).select("popular_config");
        if (!userData?.popular_config) {
            return NextResponse.json({ message: "User config not found" }, { status: 404 });
        }

        let userWeights: Map<string, number> | null = null;
        if (userData.popular_config.length > 0) {
            userWeights = buildUserWeights(userData.popular_config);
        }

        // --- build exclusion (optional) ---
        const formattedGetAllIds =
            getAllIds !== null
                ? getAllIds.map((id: string) => new mongoose.Types.ObjectId(id))
                : [];

        const totalDocsCount = await RecipePopularConfig.countDocuments();

        let matchStage: any = [];
        if (formattedGetAllIds.length < totalDocsCount) {
            matchStage = [{ $match: { _id: { $nin: formattedGetAllIds } } }];
        }


        // --- get random 200 docs (fast sampling) ---
        const list = await RecipePopularConfig.aggregate([
            ...matchStage,
            { $sample: { size: 200 } }
        ]);


        // --- main ranking logic ---
        const result = rankRecipes(list, userWeights, +count);

        return NextResponse.json(result);
    } catch (error) {
        console.error(error);
        return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
    }
}



// if startSession() is placed in try session may be undefined 
// in finally if the error occurred before startTransaction(), 
// and then calling session.endSession() will throw an error.


// OUTside the try block startSession() will throw an error 
// (which is rare), it will not be handled inside catch

// The best option is to keep startSession() BEFORE try, 
// and startTransaction() already IN. 



export async function PATCH(request: Request) {
    try {
        const { config_id } = await request.json();

        if (!config_id) {
            return NextResponse.json(
                { message: 'Invalid request data' },
                { status: 400 }
            );
        }

        await connectDB();

        const updatedPopular = await RecipePopularConfig.findOneAndUpdate(
            { _id: config_id },
            { $inc: { views: 1 } },
            { new: true }
        );

        if (!updatedPopular) {
            return NextResponse.json(
                { message: 'Recipe not found' },
                { status: 404 }
            );
        }

        return NextResponse.json({ message: 'Views updated' }, { status: 200 });
    } catch (error) {
        console.log(error)
        return NextResponse.json(
            { message: 'Internal Server Error' },
            { status: 500 }
        );
    }
}


// ---- params ---- //          user
//
//  country         str         --
//  like            bool        2
//  dislike         bool        0.25
//  view_all        1-100%      0.1-1.9
//  category        []          --
//  author_name     str         --
//  fullness_author 1-100%      --
//  view            bool        --
//  id              str         --
//  video_id        str         --
//  user_id         str         --
//  subscribe       bool        1.5
//  comment         --          1.2
//  save_recipe     --          1.6
//  open_recipe     --          1.1
//  report          --          0.1



