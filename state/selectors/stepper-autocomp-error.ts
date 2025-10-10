import { createSelector } from '@reduxjs/toolkit';
import { RootState } from '../store';







const selectIngredients = (state:RootState) => state.ingredientsSlice.ingredients;


export const selectIngredientsWithAtLeastOneFilled = createSelector(
  [selectIngredients, (_, numbStep) => numbStep],
  (ingredients) => {
    return ingredients.some((ingredient) => 
      'amount' in ingredient.units &&
      ingredient.name.trim() !== '' &&
      ingredient.units.amount > 0 &&
      ingredient.units.choice.trim() !== ''
    );
  }
);
