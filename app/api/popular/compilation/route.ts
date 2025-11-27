import connectDB from "@/app/lib/mongoose";
import LikesPopular from "@/app/models/likes-popular";
import Recipe from "@/app/models/recipe";
import SavesPopular from "@/app/models/saves-popular";
import User from "@/app/models/user";
import { NextResponse } from "next/server";
import _ from 'lodash';





export async function POST(request: Request) {
    try {
        const { connection_id, fullSorted } = await request.json();

        if (!connection_id || !Array.isArray(fullSorted)) {
            return NextResponse.json({ message: 'Invalid request data' }, { status: 400 });
        }

        const configIds = fullSorted.map(el => el._id);
        const creatorIds = fullSorted.map(el => el.creator);

        await connectDB();

        const recipes = await Recipe.find({ _id: { $in: creatorIds } });
        const connectionIds = recipes.map(recipe => recipe.connection_id).filter(Boolean);

        console.log(configIds)
        const [authors, userLikes, userSaves] = await Promise.all([
            User.find({ connection_id: { $in: connectionIds } }),
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
            const configId = el._id;
            const recipeData = recipeMap[el.creator];

            if (!recipeData) return null;

            const authorData = authorMap[recipeData.connection_id];
            if (!authorData) return null;

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
        }).filter(Boolean);

        return NextResponse.json(finalData);

    } catch (error) {
        console.error(error);
        return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
    }
}

