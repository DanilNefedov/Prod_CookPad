import { getCloudinary } from "@/app/lib/cloudinary";
import CommentPopular from "@/app/models/comments-popular";
import CookHistory from "@/app/models/cook-history";
import LikesComments from "@/app/models/likes-comments";
import LikesPopular from "@/app/models/likes-popular";
import LikesReply from "@/app/models/likes-reply";
// import ListRecipe from "@/app/models/list-recipe";
import RecipePopularConfig from "@/app/models/popular-config";
import Recipe from "@/app/models/recipe";
import ReplyComment from "@/app/models/reply-comments";
import SavesPopular from "@/app/models/saves-popular";
import { DeleteApiResponse } from "cloudinary";
import mongoose from "mongoose";


interface DeleteRecipeParams {
    connection_id: string,
    recipe_id: string
}

interface RecipeLean {
    recipe_popular_config?: string;
}

interface CloudinaryResource {
    public_id: string;
}

const DEFAULT_RETRIES = 3;
const RETRY_DELAY_MS = 2000;
const DEFAULT_BATCH_SIZE = 50;

export async function deleteHistory({ connection_id, recipe_id }: DeleteRecipeParams, session: mongoose.ClientSession) {
    try {
        const result = await CookHistory.updateOne(
            { connection_id },
            {
                $pull: {
                    history_links: { recipe_id }
                }
            },
            { session }
        );

        return result.modifiedCount > 0;

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


export async function deleteCloudinaryFolder(userId: string, recipeId: string) {
    const cloudinary = getCloudinary();
    const prefix = `recipes/${userId}/${recipeId}`;

    try {
        await deleteWithRetry(prefix, 'image');
    } catch (err) {
        console.error('Failed to delete images:', err);
    }

    try {
        await deleteWithRetry(prefix, 'video');
    } catch (err) {
        console.error('Failed to delete videos:', err);
    }

    try {
        await cloudinary.api.delete_folder(prefix);
        console.log(`Folder ${prefix} deleted successfully.`);
    } catch (err: any) {
        console.warn(`Could not delete folder ${prefix}:`, err.message || err);
    }
}

async function deleteWithRetry(prefix: string, resourceType: 'image' | 'video', retries = DEFAULT_RETRIES) {
    for (let attempt = 1; attempt <= retries; attempt++) {
        try {
            const deletedCount = await deleteResourcesByPrefixPaginated(prefix, resourceType);
            console.log(`Deleted ${deletedCount} ${resourceType}(s) from ${prefix}`);
            return;
        } catch (err: any) {
            const isRetryable =
                err.http_code === 420 || err.code === 'ETIMEDOUT' || err.code === 'ECONNRESET';


            if (isRetryable && attempt < retries) {
                console.warn(
                    `Attempt ${attempt} failed with ${err.message || err}. Retrying in ${RETRY_DELAY_MS}ms...`
                );
                await new Promise((res) => setTimeout(res, RETRY_DELAY_MS));
            } else {
                throw err;
            }
        }
    }
}

async function deleteResourcesByPrefixPaginated(prefix: string, resourceType: 'image' | 'video', batchSize = DEFAULT_BATCH_SIZE): Promise<number> {
    const cloudinary = getCloudinary();
    let nextCursor: string | undefined;
    let totalDeleted = 0;


    do {
        const res: {resources: CloudinaryResource[]; next_cursor?: string;} = await cloudinary.api.resources({
            type: 'upload',
            resource_type: resourceType,
            prefix,
            max_results: batchSize,
            next_cursor: nextCursor
        });


        const publicIds = res.resources.map((r) => r.public_id);
        if (publicIds.length > 0) {
            const deleteRes: DeleteApiResponse = await cloudinary.api.delete_resources(publicIds, {
                resource_type: resourceType
            });


            const deleted = Object.values(deleteRes).filter((v) => v === 'deleted').length;
            totalDeleted += deleted;


            const failed = Object.entries(deleteRes)
                .filter(([_, v]) => v !== 'deleted')
                .map(([id, v]) => ({ id, status: v }));


            if (failed.length > 0) {
                console.warn(`Failed to delete some ${resourceType}(s):`, failed);
            }
        }


        nextCursor = res.next_cursor;
    } while (nextCursor);


    return totalDeleted;
}