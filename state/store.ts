'use client'
import { configureStore } from "@reduxjs/toolkit";
import userReducer from './slices/user-slice'
import recipeSlice from './slices/recipe-slice'
import stepByStep from './slices/step-by-step'
import CookHistorySlice from './slices/cook-history'

export const store = configureStore({
    reducer:{
        user:userReducer,
        recipe:recipeSlice,
        setpForm:stepByStep,
        cookHistory:CookHistorySlice
    }
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch


