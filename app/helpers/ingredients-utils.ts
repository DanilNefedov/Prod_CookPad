import { IngredientAutocomplite } from "../(main)/new-recipe/types";





export const isIngredientFilled = (ingredient: IngredientAutocomplite) => {
    if (Array.isArray(ingredient.units)) return false;

    return (
        ingredient.name.trim() !== '' &&
        ingredient.units.amount > 0 &&
        ingredient.units.choice.trim() !== ''
    );
};