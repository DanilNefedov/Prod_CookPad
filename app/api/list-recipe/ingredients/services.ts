import ListRecipe from "@/app/models/list-recipe";
import { GetListRecipeIngredientsQueryDTO } from "./schema";

export async function findListRecipeIngredients({ connection_id, _id }: GetListRecipeIngredientsQueryDTO) {
    return ListRecipe.findOne(
        {
            connection_id,
            _id,
        },
        { "recipe.ingredients_list": 1, _id: 0 }
    );
}
