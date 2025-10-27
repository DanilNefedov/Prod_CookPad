'use client'
import { combineReducers, configureStore } from "@reduxjs/toolkit";
import userReducer from './slices/user-slice'
import recipeSlice from './slices/recipe-slice'
import cookHistorySlice from './slices/cook-history'
import cookSlice from './slices/cook-slice'
import listSlice from './slices/list-slice'
import listRecipeSlice from './slices/list-recipe-slice'
import popularSlice from './slices/popular-slice'
import commentsPopular from './slices/comments-popular-slice'
import commentContext from './slices/comments-context'
import stepTypeRecommend from './slices/stepper/type-recommend'
import statusStepSlice from './slices/stepper/error-open'
import nameTimeSlice from './slices/stepper/name-time'
import mediaSlice from './slices/stepper/media'
import ingredientsSlice from './slices/stepper/ingredients'
import descriptionSlice from './slices/stepper/description'
import instructionSlice from './slices/stepper/instruction'
import newListIngredient from './slices/list-form'
import formListRecipe from './slices/list-recipe-form'


export const RESET_APP = 'RESET_APP';

const appReducer = combineReducers({
    user:userReducer,
    recipe:recipeSlice,
    cookHistory:cookHistorySlice,
    cook:cookSlice,
    list:listSlice,
    listRecipe:listRecipeSlice,
    popular:popularSlice,
    comments:commentsPopular,
    commentContext:commentContext,
    formListRecipe:formListRecipe,


    statusStepSlice:statusStepSlice,
    stepTypeRecommend:stepTypeRecommend,
    nameTimeSlice:nameTimeSlice,
    mediaSlice:mediaSlice,
    ingredientsSlice:ingredientsSlice,
    descriptionSlice:descriptionSlice,
    instructionSlice:instructionSlice,
    newListIngredient:newListIngredient
});

const rootReducer = (state: ReturnType<typeof appReducer> | undefined, action: any) => {
    if (action.type === RESET_APP) {
        return appReducer(undefined, { type: '@@INIT' });
    }
    return appReducer(state, action);
};

export const store = configureStore({
    reducer: rootReducer,
});




export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch


