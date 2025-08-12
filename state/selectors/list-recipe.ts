import { createSelector } from '@reduxjs/toolkit';
import type { RootState } from '../store';

const selectRecipeIngredientIds = (state: RootState, recipeId: string) => {
    const ingredientIds = state.listRecipe.recipes[recipeId]?.ingredient_ids;
    return ingredientIds ?? null;
};


const selectIngredientsMap = (state: RootState) => state.listRecipe.ingredients;

export const selectIngredientsListByRecipeId = createSelector(
    [selectRecipeIngredientIds, selectIngredientsMap],
    (ingredientIds, ingredients) => {
        if (!ingredientIds) return [];
        return ingredientIds.map(id => ingredients[id]).filter(Boolean);
    }
);
