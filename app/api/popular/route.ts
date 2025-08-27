import connectDB from "@/app/lib/mongoose";
import User from "@/app/models/user";
import { add, bignumber, divide,  mean, multiply, round, sum } from "mathjs";
import mongoose from "mongoose";
import { NextResponse } from "next/server";
import _ from 'lodash';
import RecipePopularConfig from "@/app/models/popular-config";
import { PipelineStage } from "mongoose";
import { RecipeConfig, TopItems, UserMultiplier } from "@/app/(main)/popular/types";






//--------------------    average coefficient of action history with EVERY item in the category    -------//
function categoryCoefUser(data: number[]): number {
    return data.length > 0 ? round(mean(data), 15) : 0;
    
}


function categoryCoefVideo(data: RecipeConfig, matchCoefficient: number): number {//form 1 to 2
    const { comments, fully, likes, saves, views } = data;

    if (views === 0) return matchCoefficient;

    const newFully = round(add(fully, 1), 15);
    const coefLikes = round(add(divide(likes, views), 1), 15);
    const coefComm = round(add(divide(comments, views), 1), 15);
    const coefSaves = round(add(divide(saves, views), 1), 15)

    const interactionScore = mean([coefLikes, coefComm, coefSaves, newFully]);
   
    return round(multiply(interactionScore, matchCoefficient), 15);
}


//------------------  return the number of matches between user and recipe ---------------------//

function calculateMatchCount(categories: string[], userList: UserMultiplier[]): number {
    return categories.filter(category => 
        userList.some(user => user.category === category)
    ).length;
}


function getSortingByCategory(selectedElements: RecipeConfig[], userList: UserMultiplier[]) {

    const elementsWithMatchCoefficient = selectedElements.map(item => {
        const matchCount = calculateMatchCount(item.categories, userList);

        const categoryCount = item.categories.length || 1;
        const matchCoefficient = round(divide(matchCount, categoryCount), 15);
        return { item, matchCount, matchCoefficient };
    });

    return _.orderBy(elementsWithMatchCoefficient, ['matchCoefficient'], ['desc'])
        .slice(0, 100)
        .map(entry => ({
            item: entry.item,
            matchCoefficient: calculateAverageCoef(entry.item, userList, entry.matchCoefficient)
        }));
}




function calculateAverageCoef(item: RecipeConfig, userList: UserMultiplier[], matchCoefficient: number): number {
    const matchingUsers = item.categories
        .map(category => userList.find(user => user.category === category))
        .filter((user): user is UserMultiplier => !!user);
//----------------------------------- sum of the average coefficients of the categories (user) that matched the recipe ------------------//

    if (matchingUsers.length === 0) {
        return matchCoefficient;
    }
 
    const coefSum = parseFloat(round(
        sum(matchingUsers.map(user => bignumber(categoryCoefUser(user.multiplier)))),
        15
    ).toString());

//----------------------------------- sorting by highest sum of average coefficients ----------------------------//
    return round(multiply(matchCoefficient, divide(coefSum, matchingUsers.length)), 15);
}



//----------------------------------- sorting by other users' activity -----------------------------------//
function orderByUsersImpact(top20Elements: TopItems[], count: number): RecipeConfig[] {//RecipeT

    const sortedByImpact = top20Elements.map(elem => ({
        item: elem.item,
        matchCoefficient: categoryCoefVideo(elem.item, elem.matchCoefficient)
    }));

    return _.orderBy(sortedByImpact, ['matchCoefficient'], ['desc'])
        .map(entry => entry.item)
        .slice(0, count);

}



export async function POST(request: Request) {
    try{
        const { connection_id, count, getAllIds } = await request.json();


        if (!connection_id || !count) {
            return NextResponse.json(
                { message: 'Invalid request data' },
                { status: 400 }
            );
        }

        await connectDB();

        const userData = await User.findOne({ connection_id })
            .select('popular_config');

        if (!userData?.popular_config) {
            return NextResponse.json({ message: 'User data not found' }, { status: 404 });
        }

        const formattedGetAllIds = getAllIds !== null
        ? getAllIds.map((id: string) => new mongoose.Types.ObjectId(id))
        : [];

        const totalDocsCount = await RecipePopularConfig.countDocuments();

        let matchStage: PipelineStage[] = [];

        if (formattedGetAllIds.length < totalDocsCount) {
            matchStage = [{ $match: { _id: { $nin: formattedGetAllIds } } }];
        }

        const list = await RecipePopularConfig.aggregate([
            ...matchStage,
            { $sample: { size: 200 } }
        ]);

        // const formattedGetAllIds = getAllIds !== null ? getAllIds.map((id:string) => new mongoose.Types.ObjectId(id)) : [];
        // const list = await RecipePopularConfig.aggregate([
        //     ...(formattedGetAllIds.length > 0 ? [{ $match: { _id: { $nin: formattedGetAllIds } } }] : []),
        //     { $sample: { size: 200 } }
        // ])


        const sortedByCateries = getSortingByCategory(list, userData.popular_config);
        const fullSorted = orderByUsersImpact(sortedByCateries, +count);
        
        // const creatorIds = fullSorted.map(el => el.creator.toString());
        // const configIds = fullSorted.map(el => el._id.toString());


        return NextResponse.json(fullSorted);

    }catch(error){
        console.error(error);
        return NextResponse.json(
            { message: 'Internal Server Error' },
            { status: 500 }
        );
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

        if(!config_id){
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



