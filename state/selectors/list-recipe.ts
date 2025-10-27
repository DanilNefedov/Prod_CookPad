import { createSelector } from '@reduxjs/toolkit';
import type { RootState } from '../store';
import { isIngredientFilled } from '@/app/helpers/ingredients-utils';

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


const selectNewListIngredients = (state: RootState) =>
    state.formListRecipe;

export const checkNewListIngredient = createSelector(
    [selectNewListIngredients, (_: RootState, recipeId: string) => recipeId],
    (ingredientsByRecipe, recipeId) => {
        const ingredients = ingredientsByRecipe[recipeId];
        if (!ingredients || ingredients.length === 0) return false;

        const hasAtLeastOneFilled = ingredients.some(isIngredientFilled);
        return !hasAtLeastOneFilled;
    }
);

export const selectFilledNewIngredients = createSelector(
    [selectNewListIngredients, (_: RootState, recipeId: string) => recipeId],
    (ingredientsByRecipe, recipeId) => {
        const ingredients = ingredientsByRecipe[recipeId];
        if (!ingredients) return [];
        return ingredients.filter(isIngredientFilled);
    }
);