import { ERROR_MESSAGES_COMMENTS, ERROR_MESSAGES_COOK, ERROR_MESSAGES_COOK_HISTORY, ERROR_MESSAGES_LIST, ERROR_MESSAGES_LIST_RECIPE, 
        ERROR_MESSAGES_POPULAR, ERROR_MESSAGES_RECIPE, ERROR_MESSAGES_USER, LOADING_MESSAGES_COMMENTS, LOADING_MESSAGES_COOK, 
        LOADING_MESSAGES_COOK_HISTORY, LOADING_MESSAGES_LIST, LOADING_MESSAGES_LIST_RECIPE, LOADING_MESSAGES_POPULAR, LOADING_MESSAGES_RECIPE, 
        LOADING_MESSAGES_USER, SUCCESS_MESSAGES_COMMENTS, SUCCESS_MESSAGES_COOK, SUCCESS_MESSAGES_COOK_HISTORY, SUCCESS_MESSAGES_LIST, 
        SUCCESS_MESSAGES_LIST_RECIPE, SUCCESS_MESSAGES_POPULAR, SUCCESS_MESSAGES_RECIPE, SUCCESS_MESSAGES_USER } from "./dictionaries";
import { RootState } from "@/state/store";
import { closeAlertListRecipe, OperationKey } from "@/state/slices/list-recipe-slice";
import { OperationConfig } from "./StatusAlert";
import { closeAlertRecipe, RecipeOperationKey } from "@/state/slices/recipe-slice";
import { closeAlertUser, UserOperationKey } from "@/state/slices/user-slice";
import { closeAlertPopular, PopularOperationKey } from "@/state/slices/popular-slice";
import { closeAlertCook, CookOperationKey } from "@/state/slices/cook-slice";
import { closeAlertCookHistory, CookHistoryOperationKey } from "@/state/slices/cook-history";
import { closeAlertComments, CommentsOperationKey } from "@/state/slices/comments-popular-slice";
import { closeAlertList, ListOperationKey } from "@/state/slices/list-slice";




export const SLICE_CONFIGS = {
    listRecipe: {
        sliceSelector: (state: RootState) => state.listRecipe.operations,
        successMessages: SUCCESS_MESSAGES_LIST_RECIPE,
        errorMessages: ERROR_MESSAGES_LIST_RECIPE,
        loadingMessages: LOADING_MESSAGES_LIST_RECIPE,
        closeErrorAction: closeAlertListRecipe,
    } as OperationConfig<OperationKey>, 

    list:{
        sliceSelector: (state: RootState) => state.list.operations,
        successMessages: SUCCESS_MESSAGES_LIST,
        errorMessages: ERROR_MESSAGES_LIST,
        loadingMessages: LOADING_MESSAGES_LIST,
        closeErrorAction: closeAlertList
    } as OperationConfig<ListOperationKey>, 

    recipe: {
        sliceSelector: (state: RootState) => state.recipe.operations,
        successMessages: SUCCESS_MESSAGES_RECIPE,
        errorMessages: ERROR_MESSAGES_RECIPE,
        loadingMessages: LOADING_MESSAGES_RECIPE,
        closeErrorAction: closeAlertRecipe,
    } as OperationConfig<RecipeOperationKey>,

    user: {
        sliceSelector: (state: RootState) => state.user.operations, 
        successMessages: SUCCESS_MESSAGES_USER,
        errorMessages: ERROR_MESSAGES_USER,
        loadingMessages: LOADING_MESSAGES_USER,
        closeErrorAction: closeAlertUser,
    } as OperationConfig<UserOperationKey>,

    popular: {
        sliceSelector: (state: RootState) => state.popular.operations,
        successMessages: SUCCESS_MESSAGES_POPULAR,
        errorMessages: ERROR_MESSAGES_POPULAR,
        loadingMessages: LOADING_MESSAGES_POPULAR,
        closeErrorAction: closeAlertPopular,
    } as OperationConfig<PopularOperationKey>,

    cook: {
        sliceSelector: (state: RootState) => state.cook.operations,
        successMessages: SUCCESS_MESSAGES_COOK,
        errorMessages: ERROR_MESSAGES_COOK,
        loadingMessages: LOADING_MESSAGES_COOK,
        closeErrorAction: closeAlertCook,
    } as OperationConfig<CookOperationKey>,

    cookHistory: {
        sliceSelector: (state: RootState) => state.cookHistory.operations,
        successMessages: SUCCESS_MESSAGES_COOK_HISTORY,
        errorMessages: ERROR_MESSAGES_COOK_HISTORY,
        loadingMessages: LOADING_MESSAGES_COOK_HISTORY,
        closeErrorAction: closeAlertCookHistory,
    } as OperationConfig<CookHistoryOperationKey>,

    comments: {
        sliceSelector: (state: RootState) => state.comments.operations,
        successMessages: SUCCESS_MESSAGES_COMMENTS,
        errorMessages: ERROR_MESSAGES_COMMENTS,
        loadingMessages: LOADING_MESSAGES_COMMENTS,
        closeErrorAction: closeAlertComments,
    } as OperationConfig<CommentsOperationKey>,
} as const;

export type SliceKey = keyof typeof SLICE_CONFIGS;











