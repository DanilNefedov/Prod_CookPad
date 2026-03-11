import ListRecipe from "@/app/models/list-recipe";
import { PatchNewAmountDTO } from "./schema";

export async function updateRecipeUnitAmount({
    connection_id,
    ingredient_id,
    unit_id,
    amount,
    _id,
}: PatchNewAmountDTO) {
    return ListRecipe.findOneAndUpdate(
        { _id, connection_id },
        {
            $set: {
                "recipe.ingredients_list.$[ing].units.$[unit].amount": amount,
            },
        },
        {
            arrayFilters: [
                { "ing._id": ingredient_id },
                { "unit._id": unit_id },
            ],
            new: true,
            projection: { "recipe.ingredients_list": 1 },
        }
    );
}
