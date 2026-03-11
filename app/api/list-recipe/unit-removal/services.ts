import ListRecipe from "@/app/models/list-recipe";
import { PatchUnitRemovalDTO } from "./schema";

export async function removeRecipeUnit({
    ingredient_id,
    connection_id,
    unit_id,
    _id,
}: PatchUnitRemovalDTO) {
    return ListRecipe.findOneAndUpdate(
        { connection_id, _id },
        { $pull: { "recipe.ingredients_list.$[ingredient].units": { _id: unit_id } } },
        { arrayFilters: [{ "ingredient._id": ingredient_id }], new: true }
    );
}
