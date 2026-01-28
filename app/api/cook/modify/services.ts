import { ModifiedRoute } from "@/app/(main)/cook/types";
import Recipe from "@/app/models/recipe";




export async function updateRecipe(recipe_id: string, modified: ModifiedRoute) {
    const recipe = await Recipe.findOne({ recipe_id });

    if (!recipe) {
        return null;
    }

    const updateFields: ModifiedRoute = {};

    if (modified.name) updateFields.name = modified.name;

    if (modified.time && (modified.time.hours?.trim() || modified.time.minutes?.trim())) {
        updateFields.time = modified.time;
    }

    if (modified.description) updateFields.description = modified.description;
    if (modified.instruction) updateFields.instruction = modified.instruction;
    if (modified.recipe_type) updateFields.recipe_type = modified.recipe_type;

    if (
        modified.sorting &&
        Array.isArray(modified.sorting) &&
        modified.sorting.length > 0
    ) {
        updateFields.sorting = modified.sorting;
    }

    if (Object.keys(updateFields).length === 0) {
        return { updated: false };
    }

    await Recipe.updateOne(
        { recipe_id },
        { $set: updateFields }
    );

    return { updated: true, updateFields };
}