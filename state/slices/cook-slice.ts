import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../store";
import { merge } from 'lodash';
import { createOperations, createOperationStatus, OperationState } from "@/app/types";
import { CookFetchReq, CookFetchRes, CookRootState, DeleteCookFetch } from "@/app/(main)/cook/types";
import { FavoriteRecipeFetch } from "@/app/(main)/types";



export type CookOperationKey =
  | 'fetchCook'
  | 'deleteRecipe'


interface CookState extends CookRootState {
    operations: OperationState<CookOperationKey>
}

const initialState: CookState = {
    connection_id: '',
    recipes: {},
    operations:createOperations<CookOperationKey>(
        ['fetchCook', 'deleteRecipe'],
        (key) => {
            return createOperationStatus();
        }
    )
}



export const fetchCook = createAsyncThunk<CookFetchRes, CookFetchReq, { rejectValue: string }>(
    'cook/fetchCook',
    async function ({ id, recipe_id }, { rejectWithValue, getState }) {
        try {
            
            //to get less data from the database, and also to combine it with the already prepared stack.
            // const state = getState() as RootState
            // const recipeExists = state.recipe.recipes.find(el => el.recipe_id === recipe_id)
            const recipeExists = false
            //to get less data from the database, and also to combine it with the already prepared stack.



            // const url = `/api/cook?connection_id=${id}&recipe=${recipe_id}&recipeExists=${recipeExists ? true : false}`
            const url = `/api/cook?connection_id=${id}&recipe=${recipe_id}&recipeExists=${recipeExists}`
            const responseCook = await fetch(url);

            if (!responseCook.ok) return rejectWithValue('Server Error!');

            const data = await responseCook.json()

            const {dataCook} = data//isInHistory

            // if(!isInHistory){
            //     dispatch(newCookHistory({ connection_id: id, history_links: { recipe_id, recipe_name: recipeExists ? recipeExists.name : dataCook.name } }))
            // }

            if(recipeExists){
                const mergedRecipe = merge({}, recipeExists, dataCook);

                return { recipe: mergedRecipe, connection_id: id }
            }else{
                return { recipe: dataCook, connection_id: id }
            }

        } catch (error) {
            console.error(error)
            return rejectWithValue('Request failed!');
        }
    }
)


export const deleteRecipe = createAsyncThunk<DeleteCookFetch, DeleteCookFetch, { rejectValue: string }>(
    'cook/deleteRecipe',
    async function (data, { rejectWithValue }) {
        try {
            const url = `/api/cook?connection_id=${data.connection_id}/${data.recipe_id}`
            const response = await fetch(url, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (!response.ok) {
                return rejectWithValue('Server Error!');
            }
            // const cookData = await response.json();

            return data

        } catch (error) {
            console.error(error)
            return rejectWithValue('Request failed!');
        }
    }
)



const createReducerHandlers = <T extends keyof CookState['operations']>(operationName: T) => ({
    pending: (state: CookState) => {
        state.operations[operationName].error = false;
        state.operations[operationName].loading = true;
    },
    rejected: (state: CookState) => {
        state.operations[operationName].error = true;
        state.operations[operationName].loading = false;
    }
});

const fetchCookHandlers = createReducerHandlers('fetchCook');
const deleteRecipeHandlers = createReducerHandlers('deleteRecipe');

  

const cookSlice = createSlice({
    name: 'cook',
    initialState,
    
    reducers: {
        // updateStatus(state, action: PayloadAction<string, string>) {
        //     state.name_status = action.payload
        // },
        deleteCookRecipe(state, action: PayloadAction<string, string>){

        },

        setFavoriteCook(state, action: PayloadAction<FavoriteRecipeFetch, string>) {
            const payload = action.payload;

            const recipe = state.recipes[payload.recipe_id];
            if (recipe) {
                recipe.favorite = !payload.favorite;
            }
        },

        closeAlertCook(state, action: PayloadAction<CookOperationKey>){
            const key = action.payload

            if (state.operations[key]) {
                state.operations[key].error = false
                state.operations[key].loading = false
            }
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchCook.pending, fetchCookHandlers.pending)
            .addCase(fetchCook.rejected, fetchCookHandlers.rejected)
            .addCase(fetchCook.fulfilled, (state, action: PayloadAction<CookFetchRes, string>) => {
                state.operations.fetchCook.error = false
                state.operations.fetchCook.loading = false

                if (action.payload) {
                    const payload = action.payload;
                    state.connection_id = payload.connection_id;

                    const recipeId = payload.recipe.recipe_id;

                    if (!state.recipes[recipeId]) {
                        state.recipes[recipeId] = payload.recipe;
                    }
                }
            })



            .addCase(deleteRecipe.pending, deleteRecipeHandlers.pending)
            .addCase(deleteRecipe.rejected, deleteRecipeHandlers.rejected)
            .addCase(deleteRecipe.fulfilled, (state, action: PayloadAction<DeleteCookFetch, string>) => {
                state.operations.deleteRecipe.error = false;
                state.operations.deleteRecipe.loading = false;

                const recipeIdToRemove = action.payload.recipe_id;

                state.recipes = Object.fromEntries(
                    Object.entries(state.recipes).filter(([key]) => key !== recipeIdToRemove)
                );
            })

    }
})

export const { setFavoriteCook, closeAlertCook } = cookSlice.actions


export default cookSlice.reducer