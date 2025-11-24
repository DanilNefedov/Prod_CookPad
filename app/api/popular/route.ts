import connectDB from "@/app/lib/mongoose";
import User from "@/app/models/user";
import { add, bignumber, divide, mean, multiply, round, sum } from "mathjs";
import mongoose from "mongoose";
import { NextResponse } from "next/server";
import _ from 'lodash';
import RecipePopularConfig from "@/app/models/popular-config";
import { PipelineStage } from "mongoose";






// //--------------------    average coefficient of action history with EVERY item in the category    -------//
// function categoryCoefUser(data: number[]): number {
//     return data.length > 0 ? round(mean(data), 15) : 0;

// }


// function categoryCoefVideo(data: RecipeConfig, matchCoefficient: number): number {//form 1 to 2
//     const { comments, fully, likes, saves, views } = data;

//     if (views === 0) return matchCoefficient;

//     const newFully = round(add(fully, 1), 15);
//     const coefLikes = round(add(divide(likes, views), 1), 15);
//     const coefComm = round(add(divide(comments, views), 1), 15);
//     const coefSaves = round(add(divide(saves, views), 1), 15)

//     const interactionScore = mean([coefLikes, coefComm, coefSaves, newFully]);

//     return round(multiply(interactionScore, matchCoefficient), 15);
// }


// //------------------  return the number of matches between user and recipe ---------------------//

// function calculateMatchCount(categories: string[], userList: UserMultiplier[]): number {
//     return categories.filter(category => 
//         userList.some(user => user.category === category)
//     ).length;
// }


// function getSortingByCategory(selectedElements: RecipeConfig[], userList: UserMultiplier[]) {

//     const elementsWithMatchCoefficient = selectedElements.map(item => {
//         const matchCount = calculateMatchCount(item.categories, userList);

//         const categoryCount = item.categories.length || 1;
//         const matchCoefficient = round(divide(matchCount, categoryCount), 15);
//         return { item, matchCount, matchCoefficient };
//     });

//     return _.orderBy(elementsWithMatchCoefficient, ['matchCoefficient'], ['desc'])
//         .slice(0, 100)
//         .map(entry => ({
//             item: entry.item,
//             matchCoefficient: calculateAverageCoef(entry.item, userList, entry.matchCoefficient)
//         }));
// }




// function calculateAverageCoef(item: RecipeConfig, userList: UserMultiplier[], matchCoefficient: number): number {
//     const matchingUsers = item.categories
//         .map(category => userList.find(user => user.category === category))
//         .filter((user): user is UserMultiplier => !!user);
// //----------------------------------- sum of the average coefficients of the categories (user) that matched the recipe ------------------//

//     if (matchingUsers.length === 0) {
//         return matchCoefficient;
//     }

//     const coefSum = parseFloat(round(
//         sum(matchingUsers.map(user => bignumber(categoryCoefUser(user.multiplier)))),
//         15
//     ).toString());

// //----------------------------------- sorting by highest sum of average coefficients ----------------------------//
//     return round(multiply(matchCoefficient, divide(coefSum, matchingUsers.length)), 15);
// }



// //----------------------------------- sorting by other users' activity -----------------------------------//
// function orderByUsersImpact(top20Elements: TopItems[], count: number): RecipeConfig[] {//RecipeT

//     const sortedByImpact = top20Elements.map(elem => ({
//         item: elem.item,
//         matchCoefficient: categoryCoefVideo(elem.item, elem.matchCoefficient)
//     }));

//     return _.orderBy(sortedByImpact, ['matchCoefficient'], ['desc'])
//         .map(entry => entry.item)
//         .slice(0, count);

// }

// function avg(arr: number[]) {
//     if (!arr || arr.length === 0) return 0;
//     let s = 0;
//     for (let v of arr) s += v;
//     return s / arr.length;
// }

// // Build Map: category → avg(user.categoryMultiplier)
// function buildUserWeights(userList: any[]) {
//     const map = new Map<string, number>();
//     for (const u of userList) {
//         const a = avg(u.multiplier);
//         map.set(u.category, a);
//     }
//     return map;
// }

interface UserMultiplier{
    id: string;
    category: string;
    multiplier: number[];
    history_length_average:number
}


const SCALE = 1_000_000n;

function toBig(x: number): bigint {
    return BigInt(Math.round(x * Number(SCALE)));
}

function fromBig(x: bigint): number {
    return Number(x) / Number(SCALE);
}

function averageCalc({ multiplier, history_length_average }:{multiplier:number[], history_length_average:number}):number {
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

        if(u.history_length_average > 50){
            const avgValue = averageCalc({multiplier:u.multiplier, history_length_average:u.history_length_average});
            map.set(u.category, avgValue);
        }else{
            const avgValue = averageCalc({multiplier:u.multiplier, history_length_average:1});
            map.set(u.category, avgValue);
        }
    }

    return map;
}



// Compute match count & weighted category score
function computeCategoryMatch(itemCategories: string[], weights: Map<string, number>) {
    const total = itemCategories.length || 1;
    let matchCount = 0;
    let coefSum = 0;

    for (const c of itemCategories) {
        if (weights.has(c)) {
            matchCount++;
            coefSum += weights.get(c)!;
        }
    }
    const matchCoef = matchCount / total;
    const avgUserCoef = matchCount ? coefSum / matchCount : 0;

    return { matchCount, matchCoef, avgUserCoef };
}

// Video/recipe impact based on interactions
function recipeImpact(item: any, categoryStrength: number) {
    const { comments = 0, likes = 0, saves = 0, views = 0, fully = 0 } = item;
    if (views === 0) return categoryStrength;

    const newFully = fully + 1;
    const coefLikes = 1 + likes / views;
    const coefComm = 1 + comments / views;
    const coefSaves = 1 + saves / views;

    const interactionScore = (coefLikes + coefComm + coefSaves + newFully) / 4;
    return interactionScore * categoryStrength;
}

// Process list of recipes
// function rankRecipes(list: any[], userWeights: Map<string, number>, finalLimit: number) {
//     const stage1: {
//         item: any;
//         categoryStrength: number;
//     }[] = [];

//     // ============ 1. Compute category matching ==============
//     console.log(list)
//     for (const item of list) {
//         const { matchCount, matchCoef, avgUserCoef } = computeCategoryMatch(
//             item.categories || [],
//             userWeights
//         );

//         if (matchCount === 0) continue;

//         const categoryStrength = matchCoef * avgUserCoef;
//         console.log({ item, categoryStrength })
//         stage1.push({ item, categoryStrength });
//     }

//     // ============ 2. Take top 120 by category ==============
//     stage1.sort((a, b) => b.categoryStrength - a.categoryStrength);
//     const top = stage1.slice(0, 120);

//     // ============ 3. Final scoring with interactions =========
//     const stage2 = top.map((entry) => {
//         const finalScore = recipeImpact(entry.item, entry.categoryStrength);
//         return { item: entry.item, finalScore };
//     });

//     stage2.sort((a, b) => b.finalScore - a.finalScore);

//     return stage2.slice(0, finalLimit).map((x) => x.item);
// }

function rankRecipes(list: any[], userWeights: Map<string, number> | null, finalLimit: number) {
    const stage1: { item: any; categoryStrength: number }[] = [];

    for (const item of list) {
        let matchCoef = 1;
        let avgUserCoef = 1;

        if (userWeights && userWeights.size > 0) {
            const { matchCount, matchCoef: mc, avgUserCoef: auc } = computeCategoryMatch(
                item.categories || [],
                userWeights
            );
            if (matchCount === 0) continue; 
            matchCoef = mc;
            avgUserCoef = auc;
        }

        const categoryStrength = matchCoef * avgUserCoef;
        stage1.push({ item, categoryStrength });
    }

    stage1.sort((a, b) => b.categoryStrength - a.categoryStrength);
    const top = stage1.slice(0, 120);

    const stage2 = top.map((entry) => {
        const finalScore = recipeImpact(entry.item, entry.categoryStrength);
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
        console.log(userWeights)

        // --- build exclusion (optional) ---
        const formattedGetAllIds =
            getAllIds !== null
                ? getAllIds.map((id: string) => new mongoose.Types.ObjectId(id))
                : [];

        const totalDocsCount = await RecipePopularConfig.countDocuments();

        let matchStage:any = [];
        if (formattedGetAllIds.length < totalDocsCount) {
            matchStage = [{ $match: { _id: { $nin: formattedGetAllIds } } }];
        }

        
        // --- get random 200 docs (fast sampling) ---
        const list = await RecipePopularConfig.aggregate([
            ...matchStage,
            { $sample: { size: 200 } }
        ]);

        // console.log(list)

        // --- main ranking logic ---
        const result = rankRecipes(list, userWeights, +count);
        console.log(result)

        return NextResponse.json(result);
    } catch (error) {
        console.error(error);
        return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
    }
}



// export async function POST(request: Request) {
//     try {
//         const { connection_id, count, getAllIds } = await request.json();


//         if (!connection_id || !count) {
//             return NextResponse.json(
//                 { message: 'Invalid request data' },
//                 { status: 400 }
//             );
//         }

//         await connectDB();

//         const userData = await User.findOne({ connection_id })
//             .select('popular_config');

//         if (!userData?.popular_config) {
//             return NextResponse.json({ message: 'User data not found' }, { status: 404 });
//         }

//         const formattedGetAllIds = getAllIds !== null
//             ? getAllIds.map((id: string) => new mongoose.Types.ObjectId(id))
//             : [];

//         const totalDocsCount = await RecipePopularConfig.countDocuments();

//         let matchStage: PipelineStage[] = [];

//         if (formattedGetAllIds.length < totalDocsCount) {
//             matchStage = [{ $match: { _id: { $nin: formattedGetAllIds } } }];
//         }

//         const list = await RecipePopularConfig.aggregate([
//             ...matchStage,
//             { $sample: { size: 200 } }
//         ]);

//         // const formattedGetAllIds = getAllIds !== null ? getAllIds.map((id:string) => new mongoose.Types.ObjectId(id)) : [];
//         // const list = await RecipePopularConfig.aggregate([
//         //     ...(formattedGetAllIds.length > 0 ? [{ $match: { _id: { $nin: formattedGetAllIds } } }] : []),
//         //     { $sample: { size: 200 } }
//         // ])


//         // const sortedByCateries = getSortingByCategory(list, userData.popular_config);
//         // // const fullSorted = orderByUsersImpact(sortedByCateries, +count);
//         const sortedByCateries = processListFast(list, userData.popular_config)
//         const fullSorted = categoryCoefVideoFast(sortedByCateries, +count);

//         // const creatorIds = fullSorted.map(el => el.creator.toString());
//         // const configIds = fullSorted.map(el => el._id.toString());


//         return NextResponse.json(fullSorted);

//     } catch (error) {
//         console.error(error);
//         return NextResponse.json(
//             { message: 'Internal Server Error' },
//             { status: 500 }
//         );
//     }
// }


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



