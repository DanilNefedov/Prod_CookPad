import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { createOperations, createOperationStatus, OperationState } from "@/app/types";
import {
    ChangeDescription, ChangeInfoFetchReq, ChangeInfoFetchRes, ChangeInstruction, ChangeName,
    ChangeTime, ChangeTypeSorting, CookFetchReq, CookFetchRes, CookRootState, DeleteCookFetch, DeleteCookFetchRes,
} from "@/app/(main)/cook/types";
import { FavoriteRecipeFetch } from "@/app/(main)/types";
import { RootState } from "../store";
import { changeHistory, deleteCookHistory } from "./cook-history";
import { changeNameRecipe, deleteRecipeData } from "./recipe-slice";
import { isObjDeepEmpty } from "@/app/utils/isObjDeepEmpty";



export type CookOperationKey =
    | 'fetchCook'
    | 'deleteRecipe'
    | 'changeNewInfo'


export type ModifiedError =
    | 'name'
    | 'time'
    | 'type'
    | 'description'
    | 'instruction'


interface CookState extends CookRootState {
    operations: OperationState<CookOperationKey>
}

const initialState: CookState = {
    connection_id: '',
    recipes: {},
    modified: {
        // name:'',
        // time: {
        //     hours:'',
        //     minutes:'',
        // },
        // recipe_type:'',
        // description: '',
        // instruction:'',
        // sorting:[]
    },
    modifiedError: [],
    redirect_to: '',
    operations: createOperations<CookOperationKey>(
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
            const url = `/api/cook?connection_id=${id}&recipe_id=${recipe_id}`
            const responseCook = await fetch(url);

            if (!responseCook.ok) return rejectWithValue('Server Error!');

            const data = await responseCook.json()

            const { dataCook } = data

            return { recipe: dataCook, connection_id: id }

        } catch (error) {
            console.error(error)
            return rejectWithValue('Request failed!');
        }
    }
)



export const changeNewInfo = createAsyncThunk<ChangeInfoFetchRes, ChangeInfoFetchReq, { rejectValue: string }>(
    'cook/changeNewInfo',
    async function ({ recipe_id, user_id }, { rejectWithValue, getState, dispatch }) {
        try {

            const state = getState() as RootState;
            const modified = state.cook.modified

            if (isObjDeepEmpty(modified)) {
                return { resData: {}, recipe_id }
            }

            const response = await fetch('/api/cook/modify', {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    recipe_id,
                    modified
                }),
            });

            if (!response.ok) {
                return rejectWithValue('Request failed!');
            }

            const resData = await response.json()

            if (typeof modified.name === 'string' && modified.name.trim() !== '') {
                dispatch(changeHistory({ recipe_id, user_id, name:resData.name}));
                dispatch(changeNameRecipe({recipe_id, name:resData.name}))
            }

            return { resData: modified, recipe_id }

        } catch (error) {
            console.error(error)
            return rejectWithValue('Request failed!');
        }
    }
)



export const deleteRecipe = createAsyncThunk<DeleteCookFetchRes, DeleteCookFetch, { rejectValue: string }>(
    'cook/deleteRecipe',
    async function ({ connection_id, recipe_id }, { rejectWithValue, dispatch }) {
        try {

            const url = `/api/cook?connection_id=${connection_id}&recipe_id=${recipe_id}`
            const response = await fetch(url, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (!response.ok) {
                return rejectWithValue('Server Error!');
            }
            const respDelete = await response.json();

            dispatch(deleteCookHistory({ connection_id, recipe_id }))
            dispatch(deleteRecipeData({ recipe_id }))

            console.log(respDelete)

            return respDelete

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
        changeName(state, action: PayloadAction<ChangeName, string>) {
            const recipe = state.recipes[action.payload.recipe_id];
            if (!recipe) return;

            const value = action.payload.name;
            const key = 'name'

            const hasError = value.length > 150 || value.trim().length === 0;

            if (hasError) {
                if (!state.modifiedError.includes(key)) {
                    state.modifiedError.push(key);
                }
            } else {
                state.modifiedError = state.modifiedError.filter(el => el !== key);
            }

            state.modified.name = value;
        },

        changeType(state, action: PayloadAction<ChangeTypeSorting, string>) {

            const recipe = state.recipes[action.payload.recipe_id];

            if (recipe) {
                state.modified.recipe_type = action.payload.type;
                state.modified.sorting = action.payload.sorting
            }

        },

        changeDescription(state, action: PayloadAction<ChangeDescription, string>) {
            const recipe = state.recipes[action.payload.recipe_id];
            if (!recipe) return;

            const value = action.payload.description;
            const key = 'description'

            const hasError = value.length > 150 || value.trim().length === 0;

            if (hasError) {
                if (!state.modifiedError.includes(key)) {
                    state.modifiedError.push(key);
                }
            } else {
                state.modifiedError = state.modifiedError.filter(el => el !== key);
            }

            state.modified.description = value;

        },

        changeInstruction(state, action: PayloadAction<ChangeInstruction, string>) {

            const recipe = state.recipes[action.payload.recipe_id];
            if (!recipe) return;

            const value = action.payload.instruction;
            const key = 'instruction'

            const hasError = value.length > 300 || value.trim().length === 0;

            if (hasError) {
                if (!state.modifiedError.includes(key)) {
                    state.modifiedError.push(key);
                }
            } else {
                state.modifiedError = state.modifiedError.filter(el => el !== key);
            }

            state.modified.instruction = value;

        },

        changeTime(state, action: PayloadAction<ChangeTime>) {
            const recipe = state.recipes[action.payload.recipe_id];
            if (!recipe) return;

            let { hours, minutes } = action.payload;

            const hoursValue = hours ?? 0;
            const minutesValue = minutes ?? 0;
            const key = 'time'

            const error =
                hours === null ||
                minutes === null ||
                isNaN(hoursValue) ||
                isNaN(minutesValue) ||
                (hoursValue === 0 && minutesValue === 0);

            if (error) {
                if (!state.modifiedError.includes(key)) {
                    state.modifiedError.push(key);
                }
            } else {
                state.modifiedError = state.modifiedError.filter(el => el !== key);
            }

            if (!state.modified.time) {
                state.modified.time = { hours: 0, minutes: 0 };
            }

            state.modified.time.hours = hoursValue;
            state.modified.time.minutes = minutesValue;
        },

        setFavoriteCook(state, action: PayloadAction<FavoriteRecipeFetch, string>) {
            const payload = action.payload;

            const recipe = state.recipes[payload.recipe_id];
            if (recipe) {
                recipe.favorite = !payload.favorite;
            }
        },

        closeAlertCook(state, action: PayloadAction<CookOperationKey>) {
            const key = action.payload

            if (state.operations[key]) {
                state.operations[key].error = false
                state.operations[key].loading = false
            }
        },

        resetModifiedTime(state){
            if (state.modified.time) {
                state.modified.time = {};
            }
        },

        setRedirect(state, action: PayloadAction<string>) {
            state.redirect_to = action.payload;
        },
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
                console.log(action.payload)

                const { name, description, instruction, recipe_type, time, sorting } = action.payload.resData;

                const recipe_id = action.payload.recipe_id;

                const recipe = state.recipes[recipe_id];
                if (!recipe) return;

                if (name !== undefined) recipe.name = name;
                if (description !== undefined) recipe.description = description;
                if (instruction !== undefined) recipe.instruction = instruction;
                if (recipe_type !== undefined) recipe.recipe_type = recipe_type;
                if (time !== undefined && (time.hours !== undefined || time.minutes !== undefined)) {
                    recipe.time = {
                        ...recipe.time,
                        ...time,
                    };
                }
                if (sorting !== undefined && Array.isArray(sorting)) recipe.sorting = sorting;

                state.modified = {};
                state.modifiedError = [];

            })



            .addCase(deleteRecipe.pending, deleteRecipeHandlers.pending)
            .addCase(deleteRecipe.rejected, deleteRecipeHandlers.rejected)
            .addCase(deleteRecipe.fulfilled, (state, action: PayloadAction<DeleteCookFetchRes, string>) => {
                state.operations.deleteRecipe.error = false;
                state.operations.deleteRecipe.loading = false;
                const { recipe_id } = action.payload;

                const { [recipe_id]: _, ...rest } = state.recipes;

                state.recipes = rest;
            })

    }
})

export const { setFavoriteCook, closeAlertCook, changeName, changeType,
    changeDescription, changeInstruction, changeTime, setRedirect, resetModifiedTime } = cookSlice.actions


export default cookSlice.reducer