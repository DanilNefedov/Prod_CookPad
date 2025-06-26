import { CommentsOperationKey } from "@/state/slices/comments-popular-slice";
import { CookOperationKey } from "@/state/slices/cook-slice";
import { CookHistoryOperationKey } from "@/state/slices/cook-history";
import { OperationKey } from "@/state/slices/list-recipe-slice";
import { listOperationKey } from "@/state/slices/list-slice";
import { PopularOperationKey } from "@/state/slices/popular-slice";
import { RecipeOperationKey } from "@/state/slices/recipe-slice";
import { UserOperationKey } from "@/state/slices/user-slice";


//----------------------------------  list-recipe-slice ---------------------------------//
export const SUCCESS_MESSAGES_LIST_RECIPE: Partial<Record<OperationKey, string>> = {
    newListRecipe: 'Recipe list created successfully!',
    deleteListRecipe: 'Recipe deleted.',
};

export const LOADING_MESSAGES_LIST_RECIPE: Partial<Record<OperationKey, string>> = {
    newListRecipe: 'Creating recipe list...',
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



//----------------------------------  list ---------------------------------//
export const SUCCESS_MESSAGES_LIST: Partial<Record<listOperationKey, string>> = {
    newIngredientList: 'New ingredient added successfully.',
    newUnitIngredientList: 'New unit added successfully.',
    updateCookUnit: 'Cooking unit updated successfully.',
};

export const LOADING_MESSAGES_LIST: Partial<Record<listOperationKey, string>> = {
    newIngredientList: 'Adding new ingredient...',
    newUnitIngredientList: 'Adding new unit...',
    updateCookUnit: 'Updating cooking unit...',

};
    
export const ERROR_MESSAGES_LIST: Partial<Record<listOperationKey, string>> = {
    fetchList: 'Failed to load ingredient list.',
    newIngredientList: 'Failed to load ingredient list.',
    newUnitIngredientList:'Failed to load ingredient list.',
    updateCookUnit: 'Failed to update cooking unit.',
    toggleShopIngrFetch: 'Failed to update ingredient shopping status.',
    shopUnitUpdate: 'Failed to update shopping unit.',
    deleteIngredientFetch: 'Failed to remove ingredient.',
    deleteUnitIngrFetch: 'Failed to remove unit from ingredient.',
    changeAmountFetch: 'Failed to update ingredient amount.',
    addNewUnit: 'Failed to add new unit.',
};
//----------------------------------  list ---------------------------------//



//----------------------------------  recipe ---------------------------------//
export const SUCCESS_MESSAGES_RECIPE: Partial<Record<RecipeOperationKey, string>> = {

};

export const ERROR_MESSAGES_RECIPE: Partial<Record<RecipeOperationKey, string>> = {
    fetchRecipes: 'Loading recipes failed.',
    setFavoriteRecipe: 'Failed to update favorite.',
}

export const LOADING_MESSAGES_RECIPE: Partial<Record<RecipeOperationKey, string>> = {
    
}
//----------------------------------  recipe ---------------------------------//


//----------------------------------  user ---------------------------------//
export const SUCCESS_MESSAGES_USER: Partial<Record<UserOperationKey, string>> = {
    
};

export const ERROR_MESSAGES_USER: Partial<Record<UserOperationKey, string>> = {
    fetchUser: 'Unable to load recipes.',
    fetchClearUser: 'Unable to update favorite recipe.',
}

export const LOADING_MESSAGES_USER: Partial<Record<UserOperationKey, string>> = {
    
}
//----------------------------------  user ---------------------------------//


//----------------------------------  popular ---------------------------------//
export const SUCCESS_MESSAGES_POPULAR: Partial<Record<PopularOperationKey, string>> = {
    
};

export const ERROR_MESSAGES_POPULAR: Partial<Record<PopularOperationKey, string>> = {
    popularFetch: 'Unable to load popular recipes.',
    likePopContent: 'Unable to update favorite recipe.',
    savePopContent: 'Unable to save recipe changes.',
    updateViews:'Unable to update view recipe.'
}

export const LOADING_MESSAGES_POPULAR: Partial<Record<PopularOperationKey, string>> = {
    
}
//----------------------------------  popular ---------------------------------//



//----------------------------------  cook ---------------------------------//
export const SUCCESS_MESSAGES_COOK: Partial<Record<CookOperationKey, string>> = {
    
};

export const ERROR_MESSAGES_COOK: Partial<Record<CookOperationKey, string>> = {
    fetchCook: 'Unable to load your recipes.',
    deleteRecipe: 'Unable to delete the recipe.',
}

export const LOADING_MESSAGES_COOK: Partial<Record<CookOperationKey, string>> = {
    
}
//----------------------------------  cook ---------------------------------//




//----------------------------------  cook ---------------------------------//
export const SUCCESS_MESSAGES_COOK_HISTORY: Partial<Record<CookHistoryOperationKey, string>> = {
    
};

export const ERROR_MESSAGES_COOK_HISTORY: Partial<Record<CookHistoryOperationKey, string>> = {
    fetchHistoryCook: 'Unable to load your cooking history.',
    newCookHistory: 'Unable to add a recipe to cooking history.',
    deleteCookHistory: 'Unable to remove the recipe from history.',
}

export const LOADING_MESSAGES_COOK_HISTORY: Partial<Record<CookHistoryOperationKey, string>> = {
    
}
//----------------------------------  cook ---------------------------------//




//----------------------------------  comments ---------------------------------//
export const SUCCESS_MESSAGES_COMMENTS: Partial<Record<CommentsOperationKey, string>> = {
    
};

export const ERROR_MESSAGES_COMMENTS: Partial<Record<CommentsOperationKey, string>> = {
    commVideoFetch: 'Unable to load comments.',
    newCommPopular: 'Unable to post your comment.',
    likedComment: 'Unable to update your like on the comment.',
    newReplyComm: 'Unable to reply to the comment.',
    getReplies: 'Unable to load replies.',
}

export const LOADING_MESSAGES_COMMENTS: Partial<Record<CommentsOperationKey, string>> = {
    
}
//----------------------------------  comments ---------------------------------//
