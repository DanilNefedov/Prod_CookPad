import connectDB from "@/app/lib/mongoose";
import Recipe from "@/app/models/recipe";
import User from "@/app/models/user";
import { popularList } from "@/app/types/types";
import { add, bignumber, divide, evaluate, format, mean, multiply, parse, round, sum } from "mathjs";
import mongoose from "mongoose";
import { NextResponse } from "next/server";
import _ from 'lodash';
import LikesPopular from "@/app/models/likes-popular";
import SavesPopular from "@/app/models/saves-popular";
import RecipePopularConfig from "@/app/models/popular-config";




interface UserT {
    id: string;
    category: string;
    multiplier: number[];
}

interface RecipeT extends popularList {
    _id: string;
    creator: mongoose.Schema.Types.ObjectId;
}

interface Top20ElementsT {
    item: RecipeT;
    matchCoefficient: number;
}


//--------------------    average coefficient of action history with EVERY item in the category    -------//
function categoryCoefUser(data: number[]): number {
    // console.log(data, round(mean(data), 15))
    return round(mean(data), 15);
    
}
// function categoryCoefUser(data: number[]): number {
//     const coefMain = sum(data);
//     console.log(data)
//     const average = divide(coefMain, data.length);
//     return parseFloat(format(average, { notation: 'fixed', precision: 15 }));
// }


function categoryCoefVideo(data: RecipeT, matchCoefficient: number): number {
    const { comments, fully, likes, saves, views } = data;
    
    
    const newFully = round(add(fully, 1), 15);
    const coefLikes = round(add(divide(likes, add(views, 1)), 1), 15);
    const coefComm = round(add(divide(comments, add(views, 1)), 1), 15);
    const coefSaves = round(add(divide(saves, add(views, 1)), 1), 15);
    
    // const likesT = 123456789.123456;
    // const viewsT = 987654321.987654;
    // 987 654 322,987654
    // console.log(
    //     round(multiply(mean([coefLikes, coefComm, coefSaves, newFully]), matchCoefficient), 15),
    //     matchCoefficient, 
    //     coefLikes, 
    //     views
    // )
    return round(multiply(mean([coefLikes, coefComm, coefSaves, newFully]), matchCoefficient), 15);
}


//------------------  retunr the number of matches between user and recipe ---------------------//
function calculateMatchCount(categories: string[], userList: UserT[]): number {
    return categories.filter(category => userList.some(user => user.category === category)).length;
}




// function getCoefficientCategories(selectedElements: RecipeT[], userList: UserT[]) {
function getSortingByCategory(selectedElements: RecipeT[], userList: UserT[]) {

    const elementsWithMatchCoefficient = selectedElements.map(item => {
        const matchCount = calculateMatchCount(item.categories, userList);

        
        // const matchCoefficient = round(multiply(matchCount, divide(matchCount, item.categories.length)), 15);
        const matchCoefficient = round(divide(matchCount, item.categories.length), 15);
        return { item, matchCount, matchCoefficient };
    });

    // console.log(_.orderBy(elementsWithMatchCoefficient, ['matchCoefficient'], ['desc']).slice(0, 5).map(entry => ({//100
    //     item: entry.item,
    //     matchCoefficient: calculateAverageCoef(entry.item, userList, entry.matchCoefficient)
    // })))
    return _.orderBy(elementsWithMatchCoefficient, ['matchCoefficient'], ['desc']).slice(0, 5).map(entry => ({//100
        item: entry.item,
        matchCoefficient: calculateAverageCoef(entry.item, userList, entry.matchCoefficient)
    }));
}




function calculateAverageCoef(item: RecipeT, userList: UserT[], matchCoefficient: number): number {
    const matchingUsers = item.categories
        .map(category => userList.find(user => user.category === category))
        .filter((user): user is UserT => !!user);
//----------------------------------- sum of the average coefficients of the categories (user) that matched the recipe ------------------//
    // const coefSum = matchingUsers.map(user => {
    //     const resCoef = categoryCoefUser(user.multiplier)
    //     console.log(resCoef)
    //     return resCoef
    // }) 
 
    const coefSum = parseFloat(round(
        sum(matchingUsers.map(user => bignumber(categoryCoefUser(user.multiplier)))),
        15
    ).toString());

    // console.log('calculateAverageCoefcalculateAverageCoefcalculateAverageCoef',matchingUsers.length > 0 ? round(multiply(matchCoefficient, divide(coefSum, matchingUsers.length)), 15) : 1)
//----------------------------------- sorting by highest sum of average coefficients ----------------------------//
    return matchingUsers.length > 0 ? round(multiply(matchCoefficient, divide(coefSum, matchingUsers.length)), 15) : 1;
}



//----------------------------------- sorting by other users' activity -----------------------------------//
function orderByUsersImpact(top20Elements: Top20ElementsT[], count: number): any[] {//RecipeT
    console.log('fullSortedfullSortedfullSortedfullSortedfullSortedfullSorted',_.orderBy(
        top20Elements.map(elem => ({
            item: elem.item,
            matchCoefficient: categoryCoefVideo(elem.item, elem.matchCoefficient)
        })),
        ['matchCoefficient'],
        ['desc']
    ),'fullSortedfullSortedfullSortedfullSortedfullSortedfullSorted',)
    return _.orderBy(
        top20Elements.map(elem => ({
            item: elem.item,
            matchCoefficient: categoryCoefVideo(elem.item, elem.matchCoefficient)
        })),
        ['matchCoefficient'],
        ['desc']
    ).map(entry => entry.item).slice(0, count);
}

// if startSession() is placed in try session may be undefined 
// in finally if the error occurred before startTransaction(), 
// and then calling session.endSession() will throw an error.


// OUTside the try block startSession() will throw an error 
// (which is rare), it will not be handled inside catch

// The best option is to keep startSession() BEFORE try, 
// and startTransaction() already IN. 


export async function GET(request: Request) {
    const session = await mongoose.startSession();
    

    try {
        await connectDB();
        session.startTransaction();

        const { searchParams } = new URL(request.url);
        const connection_id = searchParams.get('connection_id');
        const count = searchParams.get('count');

        if (!connection_id || !count) {
            return NextResponse.json({ message: 'Missing required parameters' }, { status: 400 });
        }

        const userData = await User.findOne({ connection_id })
            .select('-_id -__v -createdAt -updatedAt')
            .session(session);

        if (!userData?.popular_config) {
            return NextResponse.json({ message: 'User data not found' }, { status: 404 });
        }

        const list = await RecipePopularConfig.aggregate([{ $sample: { size: 300 } }]).session(session);

        const sortedByCateries = getSortingByCategory(list, userData.popular_config);
        console.log('sortedByCateriessortedByCateriessortedByCateriessortedByCateries',
            sortedByCateries,
            'sortedByCateriessortedByCateriessortedByCateriessortedByCateries',
        )
        const fullSorted = orderByUsersImpact(sortedByCateries, +count);
        // console.log('fullSortedfullSortedfullSortedfullSortedfullSortedfullSorted',
            // fullSorted,
        // 'fullSortedfullSortedfullSortedfullSortedfullSortedfullSorted',)
        const finalData = await Promise.all(fullSorted.map(async (el) => {
            const recipeData = await Recipe.findOne({ _id: el.creator }).session(session);
            const authorData = await User.findOne({ connection_id: recipeData?.connection_id }).session(session);
            
            if (!recipeData || !authorData) {
                throw new Error('Recipe or author data not found');
            }

            const likeAgg = [{ 
                $search: { 
                    index: 'liked-popular', 
                    compound: { must: [
                        { text: { query: el._id.toString(), path: 'config_id' } },
                        { text: { query: connection_id, path: 'user_id' } },
                    ] } 
                } 
            }];

            const saveAgg = [{ 
                $search: { 
                    index: 'saved-popular', 
                    compound: { must: [
                        { text: { query: el._id.toString(), path: 'config_id' } },
                        { text: { query: connection_id, path: 'user_id' } },
                    ] } 
                } 
            }];

            const [like, save] = await Promise.all([
                LikesPopular.aggregate(likeAgg),
                SavesPopular.aggregate(saveAgg)
            ]);
            
        
            return {
                config_id: el._id.toString(),
                author_info: {
                    id_author: authorData.connection_id,
                    author_name: authorData.name,
                    author_img: authorData.img,
                },
                id_recipe: recipeData.recipe_id,
                description: recipeData.description,
                recipe_name: recipeData.name,
                recipe_media: _.cloneDeep(recipeData.media),
                liked: like.length > 0,
                likes: el.likes,
                views: el.views,
                saves: el.saves,
                saved: save.length > 0,
                comments: el.comments,
            };
        }));

        await session.commitTransaction(); 

        return NextResponse.json(finalData, { status: 200 });
    } catch (error) {
        console.error(error);
        await session.abortTransaction(); 
        return NextResponse.json({ message: 'Internal Server Error', error }, { status: 500 });
    }finally {
        session.endSession(); 
    }
}






export async function PATCH(request: Request) {
    try {
        const { config_id } = await request.json();

        if(!config_id){
            return NextResponse.json({ error: "Missing config_id" }, { status: 400 });
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
        return NextResponse.json(
            { message: 'Internal Server Error', error: error },
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



