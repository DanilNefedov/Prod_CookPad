import { createSelector } from "@reduxjs/toolkit";
import { RootState } from "../store";
import { isIngredientFilled } from "@/app/helpers/ingredients-utils";




const selectNewListIngredients = (state: RootState) =>
    state.newListIngredient.ingredients;



export const checkNewListIngredient = createSelector(
    [selectNewListIngredients],
    (ingredients) => {
        if (!ingredients || ingredients.length === 0) return false;

        const hasAtLeastOneFilled = ingredients.some(isIngredientFilled);

        return !hasAtLeastOneFilled;
    }
);




export const selectFilledNewIngredients = createSelector(
    [selectNewListIngredients],
    (ingredients) => ingredients.filter(isIngredientFilled)
);