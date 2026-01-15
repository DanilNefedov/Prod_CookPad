import CommentPopular from "@/app/models/comments-popular";
import CookHistory from "@/app/models/cook-history";
import LikesComments from "@/app/models/likes-comments";
import LikesPopular from "@/app/models/likes-popular";
import LikesReply from "@/app/models/likes-reply";
import ListRecipe from "@/app/models/list-recipe";
import RecipePopularConfig from "@/app/models/popular-config";
import Recipe from "@/app/models/recipe";
import ReplyComment from "@/app/models/reply-comments";
import SavesPopular from "@/app/models/saves-popular";
import mongoose from "mongoose";


interface DeleteRecipeParams {
    connection_id: string,
    recipe_id: string
}

interface RecipeLean {
    recipe_popular_config?: string;
}


export async function deleteHistory({ connection_id, recipe_id }: DeleteRecipeParams, session: mongoose.ClientSession) {
    try {
        const result = await CookHistory.updateOne(
            { connection_id },
            {
                $set: {
                    "history_links.$[item].is_deleted": true,
                    "history_links.$[item].deletedAt": new Date(),
                },
            },
            {
                arrayFilters: [{ "item.recipe_id": recipe_id, "item.is_deleted": false }],
                session,
            }
        );

        return result.modifiedCount > 0;

    } catch (error) {
        console.error("Mongo delete error:", error);
        throw new Error("Database deletion failed");
    }
}



export async function deleteListRecipe({ connection_id, recipe_id }: DeleteRecipeParams, session: mongoose.ClientSession) {
    try {
        const result = await ListRecipe.updateOne({
            connection_id,
            "recipe.recipe_id": recipe_id,
            is_deleted: false,
        },
            {
                $set: {
                    is_deleted: true,
                    deletedAt: new Date(),
                },
            },
            { session });

        return result.modifiedCount === 1;

    } catch (error) {
        console.error("Mongo delete error:", error);
        throw new Error("Database deletion failed");
    }
}



export async function deleteRecipeAndPopular({ recipe_id }: { recipe_id: string }, session: mongoose.ClientSession):
    Promise<{
        deleted: boolean;
        recipe_popular_config?: string;
    }> {
    try {
        const recipe = await Recipe.findOne(
            { recipe_id },
            { recipe_popular_config: 1 },
            { session }
        ).lean<RecipeLean>();

        if (!recipe) {
            return { deleted: false };
        }

        if (recipe.recipe_popular_config) {
            await RecipePopularConfig.updateOne(
                { _id: recipe.recipe_popular_config, is_deleted: false },
                {
                    $set: {
                        is_deleted: true,
                        deletedAt: new Date(),
                    },
                },
                { session }
            );
        }

        const result = await Recipe.updateOne(
            { recipe_id, is_deleted: false },
            {
                $set: {
                    is_deleted: true,
                    deletedAt: new Date(),
                },
            },
            { session }
        );

        return {
            deleted: result.modifiedCount === 1,
            recipe_popular_config: recipe.recipe_popular_config
                ? recipe.recipe_popular_config.toString()
                : undefined,
        };
        // return result.modifiedCount === 1;

    } catch (error) {
        console.error("Mongo delete error:", error);
        throw new Error("Database deletion failed");
    }
}



export async function deleteLikesPopular({ config_id }: { config_id: string }, session: mongoose.ClientSession) {
    try {

        const result = await LikesPopular.updateMany(
            { config_id, is_deleted: false },
            {
                $set: {
                    is_deleted: true,
                    deletedAt: new Date(),
                },
            },
            { session }
        );

        return result.modifiedCount;

    } catch (error) {
        console.error("Mongo delete error:", error);
        throw new Error("Database deletion failed");
    }
}



export async function deleteCommentsPopular({ config_id }: { config_id: string }, session: mongoose.ClientSession) {
    try {

        const result = await CommentPopular.updateMany(
            { config_id, is_deleted: false },
            {
                $set: {
                    is_deleted: true,
                    deletedAt: new Date(),
                },
            },
            { session }
        );

        return result.modifiedCount;

    } catch (error) {
        console.error("Mongo delete error:", error);
        throw new Error("Database deletion failed");
    }

}


export async function deleteLikesComments({ config_id }: { config_id: string }, session: mongoose.ClientSession) {
    try {

        const result = await LikesComments.updateMany(
            { config_id, is_deleted: false },
            {
                $set: {
                    is_deleted: true,
                    deletedAt: new Date(),
                },
            },
            { session }
        );

        return result.modifiedCount;

    } catch (error) {
        console.error("Mongo delete error:", error);
        throw new Error("Database deletion failed");
    }

}


export async function deleteLikesReply({ config_id }: { config_id: string }, session: mongoose.ClientSession) {
    try {

        const result = await LikesReply.updateMany(
            { config_id, is_deleted: false },
            {
                $set: {
                    is_deleted: true,
                    deletedAt: new Date(),
                },
            },
            { session }
        );

        return result.modifiedCount;

    } catch (error) {
        console.error("Mongo delete error:", error);
        throw new Error("Database deletion failed");
    }

}



export async function deleteSavePopular({ config_id }: { config_id: string }, session: mongoose.ClientSession) {
    try {

        const result = await SavesPopular.updateMany(
            { config_id, is_deleted: false },
            {
                $set: {
                    is_deleted: true,
                    deletedAt: new Date(),
                },
            },
            { session }
        );

        return result.modifiedCount;

    } catch (error) {
        console.error("Mongo delete error:", error);
        throw new Error("Database deletion failed");
    }

}


export async function deleteReplyComments({ config_id }: { config_id: string }, session: mongoose.ClientSession) {
    try {

        const result = await ReplyComment.updateMany(
            { config_id, is_deleted: false },
            {
                $set: {
                    is_deleted: true,
                    deletedAt: new Date(),
                },
            },
            { session }
        );

        return result.modifiedCount;

    } catch (error) {
        console.error("Mongo delete error:", error);
        throw new Error("Database deletion failed");
    }

}