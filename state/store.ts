'use client'
import { configureStore } from "@reduxjs/toolkit";
import userReducer from './slices/user-slice'
import recipeSlice from './slices/recipe-slice'
import stepByStep from './slices/step-by-step'

export const store = configureStore({
    reducer:{
        user:userReducer,
        recipe:recipeSlice,
        setpForm:stepByStep,
    }
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch


