import { PayloadAction, createAsyncThunk, createSlice } from "@reduxjs/toolkit"
import {  IRecipeSlice, MainRecipeT } from "@/app/types/types";
import { setFavoriteCook } from "./cook";





export type RecipeOperationKey =
  | 'fetchRecipes'
  | 'setFavoriteRecipe'
  


type OperationStatus = {
    loading: boolean
    error: boolean
}

type OperationState = Record<RecipeOperationKey, OperationStatus>

interface ListrecipeState extends IRecipeSlice {
    operations: OperationState
}

const defaultStatus: OperationStatus = { loading: true, error: false }


const initialState: ListrecipeState = {
    status: false,
    error: false,
    page: 0,
    recipes: [
    ],
    operations:{
        fetchRecipes:defaultStatus,
        setFavoriteRecipe:defaultStatus
    }
}


export const fetchRecipes = createAsyncThunk<{recipes:MainRecipeT[], page:number, totalCount:number}, string, { rejectValue: string }>(
    'recipe/fetchRecipes',
    async function (url, { rejectWithValue, dispatch, getState }) {
        try {
            const response = await fetch(url);

            if (!response.ok) return rejectWithValue('Server Error!');

            const data = await response.json()
            
            return data
        } catch (error) {
            console.error(error)
            throw error
        }
    }
)


export interface favoriteDataRecipeT {
    connection_id:string, 
    recipe_id:string, 
    favorite:boolean
}


export const setFavoriteRecipe = createAsyncThunk<favoriteDataRecipeT, favoriteDataRecipeT, {rejectValue: string}> (
    'recipe/setFavoriteRecipe',
    async function (data, {rejectWithValue, dispatch}){
        try{
            // console.log(data)
            const response = await fetch(`/api/recipe/favorite`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data),
            });

            if (!response.ok) {
                return rejectWithValue('Server Error!');
            }
            dispatch(setFavoriteCook(data))
            const dataResponse = await response.json()
            console.log(dataResponse)
            return dataResponse;

        }catch(error){
            console.error(error)
            throw error
        }
    }
)


// export const deleteRecipe = createAsyncThunk<{connection_id:string, recipe_id:string}, {connection_id:string, recipe_id:string}, {rejectValue: string}> (
//     'recipe/deleteRecipe',
//     async function (data, {rejectWithValue, dispatch}){
//         try{
//             console.log(data)
//             const response = await fetch(`/api/recipe`, {
//                 method: 'DELETE',
//                 headers: {
//                     'Content-Type': 'application/json',
//                 },
//                 body: JSON.stringify(data),
//             });

//             if (!response.ok) {
//                 return rejectWithValue('Server Error!');
//             }

//             const recipeData = await response.json();    
//             console.log(recipeData)
//             return  data;

//         }catch(error){
//             console.error(error)
//             throw error
//         }
//     }
// )

const createReducerHandlers = <T extends keyof ListrecipeState['operations']>(operationName: T) => ({
    pending: (state: ListrecipeState) => {
        state.operations[operationName].error = false;
        state.operations[operationName].loading = true;
    },
    rejected: (state: ListrecipeState) => {
        state.operations[operationName].error = true;
        state.operations[operationName].loading = false;
    }
});


const fetchRecipesHandlers = createReducerHandlers('fetchRecipes');
const setFavoriteRecipeHandlers = createReducerHandlers('setFavoriteRecipe');


const recipeSlice = createSlice({
    name: 'recipe',
    initialState,
    reducers:{
        resetStateRecipes(state) {
            return initialState; 
        },

        closeAlertRecipe(state, action: PayloadAction<RecipeOperationKey>){
            const key = action.payload

            if (state.operations[key]) {
                state.operations[key].error = false
                state.operations[key].loading = false
            }
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchRecipes.pending, fetchRecipesHandlers.pending)
            .addCase(fetchRecipes.rejected, fetchRecipesHandlers.rejected)
            .addCase(fetchRecipes.fulfilled, (state, action: PayloadAction<{ recipes: MainRecipeT[], page: number, totalCount:number }, string>) => {
                state.operations.fetchRecipes.error = false
                state.operations.fetchRecipes.loading = false

                if (!action.payload) return;
            
                const { recipes, page, totalCount } = action.payload;
            
                const newRecipes = recipes.filter(recipe => 
                    !state.recipes.some(existing => existing.recipe_id === recipe.recipe_id)
                );
            
                state.recipes = [...state.recipes, ...newRecipes];
                
                if(totalCount === state.recipes.length) {
                    state.page = NaN;
                }else{
                    state.page = page;
                }
                
            })
            
           


            .addCase(setFavoriteRecipe.pending, setFavoriteRecipeHandlers.pending)
            .addCase(setFavoriteRecipe.rejected, setFavoriteRecipeHandlers.rejected)
            .addCase(setFavoriteRecipe.fulfilled, (state, action: PayloadAction<favoriteDataRecipeT, string>) => {
                state.operations.setFavoriteRecipe.error = false
                state.operations.setFavoriteRecipe.loading = false
                
                const { recipe_id } = action.payload;
            
                const recipeIndex = state.recipes.findIndex(el => el.recipe_id === recipe_id);
            
                if (recipeIndex !== -1) {
                    // const newFavoriteStatus = !state.recipes[recipeIndex].favorite;
                    state.recipes[recipeIndex].favorite = action.payload.favorite;
            
                    if (action.payload.favorite) {
                        if (!state.recipes[recipeIndex].sorting.includes('favorite')) {
                            state.recipes[recipeIndex].sorting.push('favorite');
                        }
                    } else {
                        const favoriteIndex = state.recipes[recipeIndex].sorting.indexOf('favorite');
                        if (favoriteIndex !== -1) {
                            state.recipes[recipeIndex].sorting.splice(favoriteIndex, 1);
                        }
                    }
                }
            })
            


            // .addCase(deleteRecipe.fulfilled, (state, action: PayloadAction<{connection_id:string, recipe_id:string}, string>)=>{
            //     state.status = false;
            //     state.error = false;
            //     const payload = action.payload;

            //     state.recipes = state.recipes.filter(recipe => recipe.recipe_id !== payload.recipe_id);

            // })
            // .addCase(deleteRecipe.rejected, (state) => {
            //     state.status = false;
            //     state.error = true;
            // })
           
    }
})
export const { resetStateRecipes, closeAlertRecipe } = recipeSlice.actions;

export default recipeSlice.reducer