import CookHistory from "@/app/models/cook-history";
import ListRecipe from "@/app/models/list-recipe";
import RecipePopularConfig from "@/app/models/popular-config";
import Recipe from "@/app/models/recipe";
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



export async function deleteListRecipe({ connection_id, recipe_id }: DeleteRecipeParams, session: mongoose.ClientSession) {
    try {
        const result = await ListRecipe.deleteOne({
            connection_id,
            "recipe.recipe_id": recipe_id,
        }, { session });
        return result.deletedCount === 1;

    } catch (error) {
        console.error("Mongo delete error:", error);
        throw new Error("Database deletion failed");
    }
}



export async function deleteRecipe({ recipe_id }: { recipe_id: string }, session: mongoose.ClientSession) {
    try {
        const recipe = await Recipe.findOne(
            { recipe_id },
            { recipe_popular_config: 1 },
            { session }
        ).lean<RecipeLean>();

        if (!recipe) {
            return false;
        }

        if (recipe.recipe_popular_config) {
            try {
                await RecipePopularConfig.deleteOne({ _id: recipe.recipe_popular_config }, { session });
            } catch (err) {
                console.error("Failed to delete PopularConfig:", err);
                throw new Error("Failed to delete associated popular config");
            }
        }

        const result = await Recipe.deleteOne({ recipe_id }, { session });
        return result.deletedCount === 1;

    } catch (error) {
        console.error("Mongo delete error:", error);
        throw new Error("Database deletion failed");
    }
}