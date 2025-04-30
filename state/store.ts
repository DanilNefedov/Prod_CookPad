'use client'
import { configureStore } from "@reduxjs/toolkit";
import userReducer from './slices/user-slice'
import recipeSlice from './slices/recipe-slice'
import stepByStep from './slices/step-by-step'
import cookHistorySlice from './slices/cook-history'
import cookSlice from './slices/cook'
import listSlice from './slices/list-slice'
import listRecipeSlice from './slices/list-recipe-slice'
import popularSlice from './slices/popular-slice'
import commentsPopular from './slices/comments-popular-slice'
import commentContext from './slices/comments-context'
import stepTypeRecommend from './slices/stepper/type-recommend'
import statusSlice from './slices/stepper/error-open'
import nameTimeSlice from './slices/stepper/name-time'
import mediaSlice from './slices/stepper/media'
import ingredientsSlice from './slices/stepper/ingredients'



export const store = configureStore({
    reducer:{
        user:userReducer,
        recipe:recipeSlice,
        setpForm:stepByStep,
        cookHistory:cookHistorySlice,
        cook:cookSlice,
        list:listSlice,
        listRecipe:listRecipeSlice,
        popular:popularSlice,
        comments:commentsPopular,
        commentContext:commentContext,


        statusSlice:statusSlice,
        stepTypeRecommend:stepTypeRecommend,
        nameTimeSlice:nameTimeSlice,
        mediaSlice:mediaSlice,
        ingredientsSlice:ingredientsSlice,
    }
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch


