import connectDB from "@/app/lib/mongoose";
import RecipePopularConfig from "@/app/models/popular-config";
import Recipe from "@/app/models/recipe";
import User from "@/app/models/user";
import { popularList } from "@/app/types/types";
import { add, divide, mean, multiply, round, sum } from "mathjs";
import mongoose from "mongoose";
import { NextResponse } from "next/server";
import _ from 'lodash';
import LikesPopular from "@/app/models/likes-popular";
import SavesPopular from "@/app/models/saves-popular";




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
    return round(mean(data), 15);
}


function categoryCoefVideo(data: RecipeT, matchCoefficient: number): number {
    const { comments, fully, likes, saves, views } = data;
    
    
    const newFully = add(fully, 1);
    const coefLikes = round(add(divide(likes, views + 1), 1), 15);
    const coefComm = round(add(divide(comments, views + 1), 1), 15);
    const coefSaves = round(add(divide(saves, views + 1), 1), 15);
    

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

        const matchCoefficient = round(multiply(matchCount, divide(matchCount, item.categories.length)), 15);
        return { item, matchCount, matchCoefficient };
    });

    return _.orderBy(elementsWithMatchCoefficient, ['matchCoefficient'], ['desc']).slice(0, 100).map(entry => ({
        item: entry.item,
        matchCoefficient: calculateAverageCoef(entry.item, userList, entry.matchCoefficient)
    }));
}




function calculateAverageCoef(item: RecipeT, userList: UserT[], matchCoefficient: number): number {
    const matchingUsers = item.categories
        .map(category => userList.find(user => user.category === category))
        .filter((user): user is UserT => !!user);


//----------------------------------- sum of the average coefficients of the categories (user) that matched the recipe ------------------//
    const coefSum = sum(matchingUsers.map(user => categoryCoefUser(user.multiplier)));


//----------------------------------- sorting by highest sum of average coefficients ----------------------------//
    return matchingUsers.length > 0 ? round(multiply(matchCoefficient, divide(coefSum, matchingUsers.length)), 15) : 1;
}




//----------------------------------- sorting by other users' activity -----------------------------------//
function orderByUsersImpact(top20Elements: Top20ElementsT[], count: number): RecipeT[] {
    return _.orderBy(
        top20Elements.map(elem => ({
            item: elem.item,
            matchCoefficient: categoryCoefVideo(elem.item, elem.matchCoefficient)
        })),
        ['matchCoefficient'],
        ['desc']
    ).map(entry => entry.item).slice(0, count);
}




export async function GET(request: Request) {
    try {
        await connectDB();
        const { searchParams } = new URL(request.url);
        const connection_id = searchParams.get('connection_id');
        const count = searchParams.get('count');

        if (!connection_id || !count) {
            return NextResponse.json({ message: 'Missing required parameters' }, { status: 400 });
        }

        const userData = await User.findOne({ connection_id }).select('-_id -__v -createdAt -updatedAt');
        if (!userData?.popular_config) {
            return NextResponse.json({ message: 'User data not found' }, { status: 404 });
        }

        const list = await RecipePopularConfig.aggregate([{ $sample: { size: 200 } }]);


        
        const sortedByCateries = getSortingByCategory(list, userData.popular_config);
        const fullSorted = orderByUsersImpact(sortedByCateries, +count);

        console.log(fullSorted)
        const finalData = await Promise.all(fullSorted.map(async (el) => {
            const recipeData = await Recipe.findOne({ _id: el.creator });
            const authorData = await User.findOne({ connection_id: recipeData?.connection_id });
            if (!recipeData || !authorData) throw new Error('Recipe or author data not found');

            const likeAgg = [{ $search: { index: 'liked-popular', compound: { must: [
                { text: { query: el._id.toString(), path: 'config_id' } },
                { text: { query: connection_id, path: 'user_id' } },
            ] } } }];

            const saveAgg = [{ $search: { index: 'saved-popular', compound: { must: [
                { text: { query: el._id.toString(), path: 'config_id' } },
                { text: { query: connection_id, path: 'user_id' } },
            ] } } }];

            // const [like, save] = await Promise.all([
            //     LikesPopular.aggregate(likeAgg),
            //     SavesPopular.aggregate(saveAgg)
            // ]);

            const like = await LikesPopular.aggregate(likeAgg)
            const save = await SavesPopular.aggregate(saveAgg)
            
            console.log(like, save)

            return {
                config_id: el._id.toString(),
                author_info: {
                    id_author:authorData.connection_id,
                    author_name:authorData.name,
                    author_img:authorData.img,
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

        return NextResponse.json(finalData, { status: 200 });
    } catch (error) {
        return NextResponse.json({ message: 'Internal Server Error', error }, { status: 500 });
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



