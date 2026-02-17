import { Modified } from "@/app/(main)/cook/types";
import Recipe from "@/app/models/recipe";




export async function updateRecipe(recipe_id: string, modified: Partial<Modified>) {
    const recipe = await Recipe.findOne({ recipe_id });

    if (!recipe) {
        return null;
    }

    if (Object.keys(modified).length === 0) {
        return { updated: false };
    }

    await Recipe.updateOne(
        { recipe_id },
        { $set: modified }
    );

    return { updated: true, updateFields:modified };
}