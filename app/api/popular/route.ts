import connectDB from "@/app/lib/mongoose";
import Recipe from "@/app/models/recipe";
import User from "@/app/models/user";
import { popularList } from "@/app/types/types";
import { add, bignumber, divide,  mean, multiply, round, sum } from "mathjs";
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
    // console.log('categoryCoefUsercategoryCoefUsercategoryCoefUsercategoryCoefUser',data.length > 0 ? round(mean(0.2,0.1),10) : 0)
    return data.length > 0 ? round(mean(data), 15) : 0;
    
}
// function categoryCoefUser(data: number[]): number {
//     const coefMain = sum(data);
//     console.log(data)
//     const average = divide(coefMain, data.length);
//     return parseFloat(format(average, { notation: 'fixed', precision: 15 }));
// }


function categoryCoefVideo(data: RecipeT, matchCoefficient: number): number {//form 1 to 2
    const { comments, fully, likes, saves, views } = data;

    if (views === 0) return matchCoefficient;
//0,6168571428571428
    // console.log(matchCoefficient, data)
    const newFully = round(add(fully, 1), 15);//1,616857142857143
    const coefLikes = round(add(divide(likes, views), 1), 15);//1,025
    const coefComm = round(add(divide(comments, views), 1), 15);//1,05
    const coefSaves = round(add(divide(saves, views), 1), 15);//1,025
    
    // const likesT = 123456789.123456;
    // const viewsT = 987654321.987654;
    // 987 654 322,987654
    // console.log(
    //     round(multiply(mean([coefLikes, coefComm, coefSaves, newFully]), matchCoefficient), 15),
    //     matchCoefficient, 
    //     coefLikes, 
    //     views
    // )
    const interactionScore = mean([coefLikes, coefComm, coefSaves, newFully]);//4,716857142857143 / 4 = 1,179214285714286
    // return round(multiply(interactionScore, matchCoefficient), 15);
    // console.log(interactionScore, round(multiply(interactionScore, matchCoefficient), 15), round(add(divide(0, 0), 1), 15))//1,733445

    return round(multiply(interactionScore, matchCoefficient), 15);
}


//------------------  return the number of matches between user and recipe ---------------------//

function calculateMatchCount(categories: string[], userList: UserT[]): number {
    return categories.filter(category => 
        userList.some(user => user.category === category)
    ).length;
}


// function getCoefficientCategories(selectedElements: RecipeT[], userList: UserT[]) {
function getSortingByCategory(selectedElements: RecipeT[], userList: UserT[]) {

    const elementsWithMatchCoefficient = selectedElements.map(item => {
        const matchCount = calculateMatchCount(item.categories, userList);

        const categoryCount = item.categories.length || 1;
        // const matchCoefficient = round(multiply(matchCount, divide(matchCount, item.categories.length)), 15);
        const matchCoefficient = round(divide(matchCount, categoryCount), 15);
        return { item, matchCount, matchCoefficient };
    });

    // console.log(_.orderBy(elementsWithMatchCoefficient, ['matchCoefficient'], ['desc']).slice(0, 5).map(entry => ({//100
    //     item: entry.item,
    //     matchCoefficient: calculateAverageCoef(entry.item, userList, entry.matchCoefficient)
    // })))
    return _.orderBy(elementsWithMatchCoefficient, ['matchCoefficient'], ['desc'])
        .slice(0, 5)//100
        .map(entry => ({
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
    if (matchingUsers.length === 0) {
        return matchCoefficient;
    }
 
    const coefSum = parseFloat(round(
        sum(matchingUsers.map(user => bignumber(categoryCoefUser(user.multiplier)))),
        15
    ).toString());

    // console.log('calculateAverageCoefcalculateAverageCoefcalculateAverageCoef',matchingUsers.length > 0 ? round(multiply(matchCoefficient, divide(coefSum, matchingUsers.length)), 15) : 1)
//----------------------------------- sorting by highest sum of average coefficients ----------------------------//
    return round(multiply(matchCoefficient, divide(coefSum, matchingUsers.length)), 15);
}



//----------------------------------- sorting by other users' activity -----------------------------------//
function orderByUsersImpact(top20Elements: Top20ElementsT[], count: number): RecipeT[] {//RecipeT
    console.log('fullSortedfullSortedfullSortedfullSortedfullSortedfullSorted',_.orderBy(
        top20Elements.map(elem => ({
            item: elem.item,
            matchCoefficient: categoryCoefVideo(elem.item, elem.matchCoefficient)
        })),
        ['matchCoefficient'],
        ['desc']
    ),'fullSortedfullSortedfullSortedfullSortedfullSortedfullSorted',)


    const sortedByImpact = top20Elements.map(elem => ({
        item: elem.item,
        matchCoefficient: categoryCoefVideo(elem.item, elem.matchCoefficient)
    }));

    return _.orderBy(sortedByImpact, ['matchCoefficient'], ['desc'])
        .map(entry => entry.item)
        .slice(0, count);

}

// if startSession() is placed in try session may be undefined 
// in finally if the error occurred before startTransaction(), 
// and then calling session.endSession() will throw an error.


// OUTside the try block startSession() will throw an error 
// (which is rare), it will not be handled inside catch

// The best option is to keep startSession() BEFORE try, 
// and startTransaction() already IN. 


export async function POST(request: Request) {
    const session = await mongoose.startSession();
    
    try {
        await connectDB();
        session.startTransaction();

        const { connection_id, count, getAllIds } = await request.json();


        if (!connection_id || !count) {
            return NextResponse.json({ message: 'Missing required parameters' }, { status: 400 });
        }

        const userData = await User.findOne({ connection_id })
            .select('-_id -__v -createdAt -updatedAt')
            .session(session);

        if (!userData?.popular_config) {
            return NextResponse.json({ message: 'User data not found' }, { status: 404 });
        }
        console.log(getAllIds)
        // const list = await RecipePopularConfig.aggregate([{ $sample: { size: 200 } }]).session(session);
        const formattedGetAllIds = getAllIds !== null ? getAllIds.map((id:string) => new mongoose.Types.ObjectId(id)) : [];

        const list = await RecipePopularConfig.aggregate([
            ...(formattedGetAllIds.length > 0 ? [{ $match: { _id: { $nin: formattedGetAllIds } } }] : []),
            { $sample: { size: 200 } }
        ]).session(session);
        console.log(list.length)


        const sortedByCateries = getSortingByCategory(list, userData.popular_config);
        const fullSorted = orderByUsersImpact(sortedByCateries, +count);
        
        const creatorIds = fullSorted.map(el => el.creator.toString());
        const configIds = fullSorted.map(el => el._id.toString());
        
        const recipes = await Recipe.find({ _id: { $in: creatorIds } }).session(session);
        
        const connectionIds = recipes.map(recipe => recipe.connection_id).filter(Boolean);
        
        const [authors, userLikes, userSaves] = await Promise.all([
            User.find({ connection_id: { $in: connectionIds } }).session(session),
            LikesPopular.aggregate([
                {
                    $search: {
                        index: 'liked-popular',
                        compound: {
                            must: [
                                { text: { query: configIds.join('|'), path: 'config_id' } },
                                { text: { query: connection_id, path: 'user_id' } }
                            ]
                        }
                    }
                },
                {
                    $match: { is_deleted: { $ne: true } } 
                }
            ]),
            
            SavesPopular.aggregate([
                { 
                    $search: { 
                        index: 'saved-popular', 
                        compound: { 
                            must: [
                                { text: { query: configIds.join('|'), path: 'config_id' } },
                                { text: { query: connection_id, path: 'user_id' } },
                            ] 
                        } 
                    } 
                },
                {
                    $match: { is_deleted: { $ne: true } } 
                }
            ])
        ]);
        
        const recipeMap = recipes.reduce((map, recipe) => {
            map[recipe._id.toString()] = recipe;
            return map;
        }, {});
        
        const authorMap = authors.reduce((map, author) => {
            map[author.connection_id] = author;
            return map;
        }, {});
        
        const likedMap = userLikes.reduce((map, like) => {
            map[like.config_id] = true;
            return map;
        }, {});
        
        const savedMap = userSaves.reduce((map, save) => {
            map[save.config_id] = true;
            return map;
        }, {});
        
        const finalData = fullSorted.map(el => {
            const configId = el._id.toString();
            const recipeData = recipeMap[el.creator.toString()];
            
            if (!recipeData) {
                return null;
            }
            
            const authorData = authorMap[recipeData.connection_id];
            
            if (!authorData) {
                return null;
            }
            
            return {
                config_id: configId,
                author_info: {
                    id_author: authorData.connection_id,
                    author_name: authorData.name,
                    author_img: authorData.img,
                },
                id_recipe: recipeData.recipe_id,
                description: recipeData.description,
                recipe_name: recipeData.name,
                recipe_media: _.cloneDeep(recipeData.media),
                liked: !!likedMap[configId],
                likes: el.likes,
                views: el.views,
                saves: el.saves,
                saved: !!savedMap[configId],
                comments: el.comments,
            };
        }).filter(item => item !== null);

        await session.commitTransaction(); 

        return NextResponse.json(finalData, { status: 200 });
    } catch (error) {
        console.error(error);
        await session.abortTransaction(); 
        return NextResponse.json({ message: 'Internal Server Error', error }, { status: 500 });
    } finally {
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



