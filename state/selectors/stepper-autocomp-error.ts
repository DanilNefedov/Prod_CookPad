import { createSelector } from '@reduxjs/toolkit';
import { RootState } from '../store';











const selectIngredients = (state: RootState) => state.ingredientsSlice.ingredients;
const selectOpenPage = (state: RootState, numbStep: number) => state.statusStepSlice.steps[numbStep]?.open;



export const selectShowMinOneFilledWarning = createSelector(
    [selectIngredients, selectOpenPage],
    (ingredients, openPage) => {
        if (!openPage) return false;

        const hasAtLeastOneFilled = ingredients.some((ingredient) =>
            'amount' in ingredient.units &&
            ingredient.name.trim() !== '' &&
            ingredient.units.amount > 0 &&
            ingredient.units.choice.trim() !== ''
        );

        return !hasAtLeastOneFilled;
    }
);