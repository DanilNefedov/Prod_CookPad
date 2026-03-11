import ListRecipe from "@/app/models/list-recipe";
import { PatchNewUnitDTO } from "./schema";

export async function appendRecipeIngredientUnit({
    connection_id,
    ingredient_id,
    updated_unit,
    _id,
}: PatchNewUnitDTO) {
    return ListRecipe.findOneAndUpdate(
        {
            connection_id,
            _id,
            "recipe.ingredients_list._id": ingredient_id,
        },
        {
            $push: { "recipe.ingredients_list.$.units": updated_unit },
        },
        { new: true }
    );
}
