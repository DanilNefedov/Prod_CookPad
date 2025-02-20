'use client'
import { configureStore } from "@reduxjs/toolkit";
import userReducer from './slices/user-slice'
import recipeSlice from './slices/recipe-slice'
import stepByStep from './slices/step-by-step'
import cookHistorySlice from './slices/cook-history'
import cookSlice from './slices/cook'
import listSlice from './slices/list-slice'

export const store = configureStore({
    reducer:{
        user:userReducer,
        recipe:recipeSlice,
        setpForm:stepByStep,
        cookHistory:cookHistorySlice,
        cook:cookSlice,
        list:listSlice,
    }
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch


