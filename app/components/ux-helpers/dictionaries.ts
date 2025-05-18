import { OperationKey } from "@/state/slices/list-recipe-slice";


//----------------------------------  list-recipe-slice ---------------------------------//

export const SUCCESS_MESSAGES_LIST_RECIPE: Partial<Record<OperationKey, string>> = {
    newListRecipe: 'Recipe list created successfully!',
    deleteListRecipe: 'Recipe deleted.',
    // shopIngrListRecipe: 'Ingredients added to shopping list.',
    // deleteIngrRecipeList: 'Ingredient removed from the recipe list.',
    // shopUnitListRecipe: 'Units added to the shopping list.',
    // newAmountListRecipe: 'Ingredient amount updated successfully.',
    // newUnitListRecipe: 'Unit updated successfully.',
    // deleteUnitListRecipe: 'Unit removed successfully.',
};

export const LOADING_MESSAGES_LIST_RECIPE: Partial<Record<OperationKey, string>> = {
    newListRecipe: 'Creating recipe list...',
    // shopIngrListRecipe: 'Adding ingredients to shopping list...',
    // deleteIngrRecipeList: 'Removing ingredient from recipe...',
    // shopUnitListRecipe: 'Adding units to shopping list...',
    // newAmountListRecipe: 'Updating ingredient amount...',
    // newUnitListRecipe: 'Updating unit...',
    // deleteUnitListRecipe: 'Removing unit...', 
};
    
export const ERROR_MESSAGES_LIST_RECIPE: Partial<Record<OperationKey, string>> = {
    preLoaderMain: 'Error loading recipes.',
    ingredientsListRecipe: 'Error loading ingredients.',
    deleteListRecipe: 'Failed to delete a recipe.',
    newListRecipe: 'Failed to create recipe list.',
    shopIngrListRecipe: 'Failed to add ingredients to shopping list.',
    deleteIngrRecipeList: 'Failed to remove ingredient from recipe.',
    shopUnitListRecipe: 'Failed to add units to shopping list.',
    newAmountListRecipe: 'Failed to update ingredient amount.',
    newUnitListRecipe: 'Failed to update unit.',
    deleteUnitListRecipe: 'Failed to remove unit.',
};

//----------------------------------  list-recipe-slice ---------------------------------//