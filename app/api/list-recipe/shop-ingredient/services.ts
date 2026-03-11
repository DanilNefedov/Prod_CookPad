import ListRecipe from "@/app/models/list-recipe";
import { PatchShopIngredientDTO } from "./schema";

export async function toggleRecipeIngredientShop({
    connection_id,
    ingredient_id,
    shop_ingr,
    _id,
}: PatchShopIngredientDTO) {
    return ListRecipe.findOneAndUpdate(
        {
            connection_id,
            _id,
            "recipe.ingredients_list._id": ingredient_id,
        },
        {
            $set: { "recipe.ingredients_list.$.shop_ingr": !shop_ingr },
        },
        { new: true }
    );
}
