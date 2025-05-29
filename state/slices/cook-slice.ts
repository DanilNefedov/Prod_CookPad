import { CookPageT, CookSliceT } from "@/app/types/types";
import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { newCookHistory } from "./cook-history";
import { favoriteDataRecipeT } from "./recipe-slice";
import { RootState } from "../store";
import { merge } from 'lodash';


// export interface returnDataFavorite {
//     recipe_id: string | null;
//     favorite: boolean;
// }

// export interface favoriteDataRecipe {
//     url:string, 
//     recipeData: {
//         recipe_id: string | null, 
//         favorite: boolean
//     }
// }

export type CookOperationKey =
  | 'fetchCook'
  | 'deleteRecipe'



type OperationStatus = {
    loading: boolean
    error: boolean
}

type OperationState = Record<CookOperationKey, OperationStatus>

interface CookState extends CookSliceT {
    operations: OperationState
}

const defaultStatus: OperationStatus = { loading: true, error: false }


const initialState: CookState = {
    status: false,
    error: false,
    name_status: '',
    connection_id: '',
    recipes: [
    ],
    operations:{
        fetchCook:defaultStatus,
        deleteRecipe:defaultStatus
    }
}


interface fetchDataT {
    recipe: CookPageT
    connection_id: string
}



export const fetchCook = createAsyncThunk<fetchDataT, { id: string, recipe_id: string}, { rejectValue: string }>(
    'cook/fetchCook',
    async function ({ id, recipe_id }, { rejectWithValue, getState }) {
        try {
            
            //to get less data from the database, and also to combine it with the already prepared stack.
            const state = getState() as RootState
            const recipeExists = state.recipe.recipes.find(el => el.recipe_id === recipe_id)
            //to get less data from the database, and also to combine it with the already prepared stack.



            const url = `/api/cook?connection_id=${id}&recipe=${recipe_id}&recipeExists=${recipeExists ? true : false}`
            const responseCook = await fetch(url);

            if (!responseCook.ok) return rejectWithValue('Server Error!');

            const data = await responseCook.json()

            const {dataCook} = data//isInHistory

            // if(!isInHistory){
            //     console.log('2')
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

type DataDelete = {
    connection_id: string, 
    recipe_id: string
}

export const deleteRecipe = createAsyncThunk<DataDelete, DataDelete, { rejectValue: string }>(
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
            // console.log(cookData)

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

        setFavoriteCook(state, action: PayloadAction<favoriteDataRecipeT, string>) {
            const payload = action.payload;

            const findRecipe = state.recipes.find(el => el.recipe_id === payload.recipe_id)

            if (findRecipe) {
                findRecipe.favorite = !payload.favorite
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
            .addCase(fetchCook.fulfilled, (state, action: PayloadAction<fetchDataT, string>) => {
                state.operations.fetchCook.error = false
                state.operations.fetchCook.loading = false

                if (action.payload) {
                    const payload = action.payload;
                    state.connection_id = payload.connection_id;
                    
                    const existingRecipe = state.recipes.find(el => el.recipe_id === payload.recipe.recipe_id);
                    if (!existingRecipe) {
                        state.recipes.push(payload.recipe);
                    }
                }
            })



            .addCase(deleteRecipe.pending, deleteRecipeHandlers.pending)
            .addCase(deleteRecipe.rejected, deleteRecipeHandlers.rejected)
            .addCase(deleteRecipe.fulfilled, (state, action: PayloadAction<DataDelete, string>) => {
                state.operations.deleteRecipe.error = false
                state.operations.deleteRecipe.loading = false
                // state.name_links = state.name_links.filter(link => link.recipe_id !== action.payload.recipe_id);
                state.recipes = state.recipes.filter(link => link.recipe_id !== action.payload.recipe_id)
            })
    }
})

export const { setFavoriteCook, closeAlertCook } = cookSlice.actions


export default cookSlice.reducer