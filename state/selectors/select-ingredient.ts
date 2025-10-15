import { createSelector } from "@reduxjs/toolkit";
import { RootState } from "../store";





export const selectIngredient = (ingredient_id: string) =>
    createSelector(
        (state: RootState) => state.newListIngredient.ingredients,
        (ingredients) => {
            const found = ingredients.find((ingr) => ingr.ingredient_id === ingredient_id);
            if (!found) throw new Error(`Ingredient with id ${ingredient_id} not found`);
            const { name, media } = found;
            return { name, media };
        }
    );