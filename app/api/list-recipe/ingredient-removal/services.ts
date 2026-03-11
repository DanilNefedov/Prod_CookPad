import ListRecipe from "@/app/models/list-recipe";
import { PatchIngredientRemovalDTO } from "./schema";

export async function removeIngredientFromRecipe({ connection_id, _id, ingredient_id }: PatchIngredientRemovalDTO) {
    return ListRecipe.findOneAndUpdate(
        {
            connection_id,
            _id,
        },
        {
            $pull: { "recipe.ingredients_list": { _id: ingredient_id } },
        }
    );
}
