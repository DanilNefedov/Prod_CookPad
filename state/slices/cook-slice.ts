import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { createOperations, createOperationStatus, OperationState } from "@/app/types";
import { ChangeDescription, ChangeHours, ChangeInfoFetchReq, ChangeInfoFetchRes, ChangeInstruction, 
    ChangeMinutes, ChangeName, ChangeTypeSorting, CookFetchReq, CookFetchRes, CookRootState, DeleteCookFetch, } from "@/app/(main)/cook/types";
import { FavoriteRecipeFetch } from "@/app/(main)/types";
import { RootState } from "../store";
import { changeHistory } from "./cook-history";
import { changeNameRecipe } from "./recipe-slice";



export type CookOperationKey =
  | 'fetchCook'
  | 'deleteRecipe'
  | 'changeNewInfo'


interface CookState extends CookRootState {
    operations: OperationState<CookOperationKey>
}

const initialState: CookState = {
    connection_id: '',
    recipes: {},
    modified:{
        name:'',
        time: {
            hours:'',
            minutes:'' ,
        },
        recipe_type:'',
        description: '',
        instruction:'',
        sorting:[]
    },
    operations:createOperations<CookOperationKey>(
        ['fetchCook', 'deleteRecipe', 'changeNewInfo'],
        (key) => {
            return createOperationStatus();
        }
    )
}



export const fetchCook = createAsyncThunk<CookFetchRes, CookFetchReq, { rejectValue: string }>(
    'cook/fetchCook',
    async function ({ id, recipe_id }, { rejectWithValue }) {
        try {
            const url = `/api/cook?connection_id=${id}&recipe=${recipe_id}`
            const responseCook = await fetch(url);

            if (!responseCook.ok) return rejectWithValue('Server Error!');

            const data = await responseCook.json()

            const {dataCook} = data

            return { recipe: dataCook, connection_id: id }

        } catch (error) {
            console.error(error)
            return rejectWithValue('Request failed!');
        }
    }
)



export const changeNewInfo = createAsyncThunk<ChangeInfoFetchRes, ChangeInfoFetchReq, { rejectValue: string }>(
    'cook/changeNewInfo',
    async function ({recipe_id, user_id}, { rejectWithValue, getState, dispatch  }) {
        try {
            
            const state = getState() as RootState;
            const modified = state.cook.modified

            const url = '/api/cook/modify'
            const data = {
                recipe_id,
                modified
            }

            const response = await fetch(url, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data),
            });

            if (!response.ok) {
                return rejectWithValue('Request failed!');
            }

            const resData = await response.json()

            if (modified.name.trim() !== '') {
                dispatch(changeHistory({ recipe_id, user_id, name:resData.name}));
                dispatch(changeNameRecipe({recipe_id, name:resData.name}))
            }

            return {resData, recipe_id}

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
const changeNewInfoHandlers = createReducerHandlers('changeNewInfo');

  

const cookSlice = createSlice({
    name: 'cook',
    initialState,
    
    reducers: {
        // updateStatus(state, action: PayloadAction<string, string>) {
        //     state.name_status = action.payload
        // },
        
        deleteCookRecipe(state, action: PayloadAction<string, string>){

        },

        changeName(state, action: PayloadAction<ChangeName, string>){

            const recipe = state.recipes[action.payload.recipe_id];

            if (recipe) {
                state.modified.name = action.payload.name;
            }

        },

        changeType(state, action: PayloadAction<ChangeTypeSorting, string>){

            const recipe = state.recipes[action.payload.recipe_id];

            if (recipe) {
                state.modified.recipe_type = action.payload.type;
                state.modified.sorting = action.payload.sorting
            }

        },

        changeDescription(state, action: PayloadAction<ChangeDescription, string>){

            const recipe = state.recipes[action.payload.recipe_id];

            if (recipe) {
                state.modified.description = action.payload.description;
            }

        },

        changeInstruction(state, action: PayloadAction<ChangeInstruction, string>){

            const recipe = state.recipes[action.payload.recipe_id];

            if (recipe) {
                state.modified.instruction = action.payload.instruction;
            }

        },

        changeHours(state, action: PayloadAction<ChangeHours, string>){
            const recipe = state.recipes[action.payload.recipe_id];

            if (recipe) {
                state.modified.time.hours = action.payload.hours;
            }
        },
        
        changeMinutes(state, action: PayloadAction<ChangeMinutes, string>){
            const recipe = state.recipes[action.payload.recipe_id];

            if (recipe) {
                state.modified.time.minutes = action.payload.minutes;
            }
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



            .addCase(changeNewInfo.pending, changeNewInfoHandlers.pending)
            .addCase(changeNewInfo.rejected, changeNewInfoHandlers.rejected)
            .addCase(changeNewInfo.fulfilled, (state, action: PayloadAction<ChangeInfoFetchRes, string>) => {
                state.operations.deleteRecipe.error = false;
                state.operations.deleteRecipe.loading = false;

                const { name, description, instruction, recipe_type, time, sorting } = action.payload.resData;
    
                const recipe_id = action.payload.recipe_id;

                const recipe = state.recipes[recipe_id];
                if (!recipe) return;

                if (name !== undefined) recipe.name = name;
                if (description !== undefined) recipe.description = description;
                if (instruction !== undefined) recipe.instruction = instruction;
                if (recipe_type !== undefined) recipe.recipe_type = recipe_type;
                if (time !== undefined && (time.hours?.trim() || time.minutes?.trim())) {
                    recipe.time = time;
                }
                if (sorting !== undefined && Array.isArray(sorting)) recipe.sorting = sorting;
                
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

export const { setFavoriteCook, closeAlertCook, changeName, changeType, changeDescription, changeInstruction,changeHours, changeMinutes } = cookSlice.actions


export default cookSlice.reducer