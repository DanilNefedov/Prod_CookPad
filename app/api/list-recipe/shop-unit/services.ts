import { ListIngrDataFetch, UnitsIdFetch } from "@/app/(main)/(main-list)/list-recipe/types";
import ListRecipe from "@/app/models/list-recipe";
import { PatchShopUnitDTO } from "./schema";

export async function toggleRecipeUnitShop({
    ingredient_id,
    connection_id,
    _id,
    unit_id,
    shop_unit,
}: PatchShopUnitDTO) {
    return ListRecipe.findOneAndUpdate(
        {
            connection_id,
            _id,
            "recipe.ingredients_list._id": ingredient_id,
            "recipe.ingredients_list.units._id": unit_id,
        },
        {
            $set: {
                "recipe.ingredients_list.$[ing].units.$[unit].shop_unit": !shop_unit,
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

export function extractUpdatedShopUnit(
    updatedDocument: any,
    ingredient_id: string,
    unit_id: string
) {
    if (!updatedDocument || !updatedDocument.recipe || !Array.isArray(updatedDocument.recipe.ingredients_list)) {
        return { error: "UPDATED_DOC_INVALID" as const };
    }

    const updatedIngredient = updatedDocument.recipe.ingredients_list.find(
        (ing: ListIngrDataFetch) => ing._id?.toString() === ingredient_id
    );

    if (!updatedIngredient || !Array.isArray(updatedIngredient.units)) {
        return { error: "INGREDIENT_NOT_FOUND" as const };
    }

    const updatedUnit = updatedIngredient.units.find(
        (unit: UnitsIdFetch) => unit._id?.toString() === unit_id
    );

    return { updatedUnit };
}
