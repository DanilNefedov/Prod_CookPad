import { createSelector } from '@reduxjs/toolkit';
import { RootState } from '../store';
import { useMemo } from 'react';
import { useAppSelector } from '../hook';




// export const selectUnitData = (recipe_id: string | undefined, ingredient_id: string, unit_id: string) => createSelector(
//         (state: RootState) => state,
//         (state) => {
//             const ingredient = recipe_id
//                 ? state.listRecipe.recipes
//                     .find(recipe => recipe._id === recipe_id)
//                     ?.ingredients_list.find(ingr => ingr._id === ingredient_id)
//                 : state.list.list_ingr.find(ingr => ingr._id === ingredient_id);

//             const unitInfo = ingredient?.units.find(unit => unit._id === unit_id);

//             return {
//                 state_amount: unitInfo?.amount ?? 0,
//                 state_shop: unitInfo?.shop_unit ?? false,
//                 state_choice: unitInfo?.choice ?? ''
//             };
//     }
// );




// export const selectIngredientUnits = (ingredient_id: string) => createSelector(
//         [
//             (state: RootState) => state.list.ingredients[ingredient_id],
//             (state: RootState) => state.list.units
//         ],
//         (ingredient, unitsMap) => {
//             if (!ingredient) return [];
//             return ingredient.unit_ids
//                 .map((id) => unitsMap[id])
//                 .filter(Boolean);
//         }
// );

// export const useMemoizedIngredientUnits = (ingredient_id: string) => {
//     const selector = useMemo(() => selectIngredientUnits(ingredient_id), [ingredient_id]);
//     return useAppSelector(selector);
// };