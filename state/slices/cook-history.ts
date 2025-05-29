import { CookHistoryT, NameLinksT } from "@/app/types/types";
import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../store";



export type CookHistoryOperationKey =
  | 'fetchHistoryCook'
  | 'newCookHistory'
  | 'deleteCookHistory'



type OperationStatus = {
    loading: boolean
    error: boolean
}

type OperationState = Record<CookHistoryOperationKey, OperationStatus>

interface CookHistoryState extends CookHistoryT {
    operations: OperationState
}

const defaultStatus: OperationStatus = { loading: true, error: false }


const initialState:CookHistoryState = {
    status: false,
    error: false,
    connection_id: '',
    history_links:[
    ],
    operations:{
        fetchHistoryCook:defaultStatus,
        newCookHistory:defaultStatus,
        deleteCookHistory:defaultStatus
    }
}


interface fetchCookHistoryT {
    connection_id:string,
    history_links:NameLinksT[]
}


export const fetchHistoryCook = createAsyncThunk<fetchCookHistoryT, {connection_id:string, recipe_id:string}, {rejectValue: string}>(
    'cook-history/fetchHistoryCook',
    async function ({connection_id, recipe_id,}, {rejectWithValue, dispatch }){
        try{

            const url = `/api/cook/history?connection_id=${connection_id}&recipe_id=${recipe_id}`
            const response = await fetch(url);

            if (!response.ok) {
                return rejectWithValue('Server Error!');
            }
            const {cook, newCook} = await response.json();

            if(newCook !== null){
                // console.log(newCook)
                dispatch(newCookHistory({ connection_id, history_links:{recipe_id:newCook.recipe_id, recipe_name:newCook.name} }))
            }
            
            return cook

        }catch(error){
            console.error(error)
            throw error
        }
    }
)

interface newCookHistoryT {
    connection_id:string,
    history_links:{
        recipe_id:string,
        recipe_name:string
    }
}


export const newCookHistory = createAsyncThunk<newCookHistoryT, newCookHistoryT, {rejectValue: string}>(
    'cook-history/changeCookHistory',
    async function (data, {rejectWithValue}){
        try{
            const response = await fetch(`/api/cook/history`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data),
            });

            if (!response.ok) {
                return rejectWithValue('Server Error!');
            }

            const newHeader = await response.json();
            // console.log(data, newHeader)
            return data;

        }catch(error){
            console.error(error)
            throw error
        }
    }
)

export const deleteCookHistory = createAsyncThunk<{connection_id:string, recipe_id:string}, {connection_id:string, recipe_id:string}, {rejectValue: string}>(
    'cook-history/deleteCookHistory',
    async function ({connection_id, recipe_id}, {rejectWithValue}){
        try {
            const response = await fetch(`/api/cook/history/${recipe_id}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ connection_id, recipe_id }),
            });

            if (!response.ok) {
                return rejectWithValue('Server Error!');
            }

            return { connection_id, recipe_id };

        } catch (error) {
            console.error(error);
            return rejectWithValue('Request failed!');
        }
    }
)




const createReducerHandlers = <T extends keyof CookHistoryState['operations']>(operationName: T) => ({
    pending: (state: CookHistoryState) => {
        state.operations[operationName].error = false;
        state.operations[operationName].loading = true;
    },
    rejected: (state: CookHistoryState) => {
        state.operations[operationName].error = true;
        state.operations[operationName].loading = false;
    }
});

const fetchHistoryCookHandlers = createReducerHandlers('fetchHistoryCook');
const newCookHistoryHandlers = createReducerHandlers('newCookHistory');
const deleteCookHistoryHandlers = createReducerHandlers('deleteCookHistory');



const CookHistorySlice = createSlice({
    name: 'cook-history',
    initialState,
    reducers: {
        closeAlertCookHistory(state, action: PayloadAction<CookHistoryOperationKey>){
            const key = action.payload

            if (state.operations[key]) {
                state.operations[key].error = false
                state.operations[key].loading = false
            }
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchHistoryCook.pending, fetchHistoryCookHandlers.pending)
            .addCase(fetchHistoryCook.rejected, fetchHistoryCookHandlers.rejected)
            .addCase(fetchHistoryCook.fulfilled, (state, action: PayloadAction<fetchCookHistoryT, string>) => {
                state.operations.fetchHistoryCook.error = false
                state.operations.fetchHistoryCook.loading = false

                state.connection_id = action.payload.connection_id
                action.payload.history_links.map(el => {
                    
                    const thisCook = state.history_links.find(elem => elem.recipe_id === el.recipe_id)
                    if(!thisCook){

                        state.history_links.push(el)
                    }
                })
            })



            .addCase(newCookHistory.pending, newCookHistoryHandlers.pending)
            .addCase(newCookHistory.rejected, newCookHistoryHandlers.rejected)
            .addCase(newCookHistory.fulfilled, (state, action: PayloadAction<newCookHistoryT, string>) => {
                state.operations.newCookHistory.error = false
                state.operations.newCookHistory.loading = false

                const thisLink = state.history_links.find(el => el.recipe_id === action.payload.history_links.recipe_id)
                // console.log(thisLink, action.payload.history_links)
                if(!thisLink) state.history_links.push(action.payload.history_links)
                
            })



            .addCase(deleteCookHistory.pending, deleteCookHistoryHandlers.pending)
            .addCase(deleteCookHistory.rejected, deleteCookHistoryHandlers.rejected)
            .addCase(deleteCookHistory.fulfilled, (state, action: PayloadAction<{ connection_id: string, recipe_id: string }>) => {
                state.operations.deleteCookHistory.error = false
                state.operations.deleteCookHistory.loading = false
            
                state.history_links = state.history_links.filter(link => link.recipe_id !== action.payload.recipe_id);
            });
    }
})

export const { closeAlertCookHistory } = CookHistorySlice.actions


export default CookHistorySlice.reducer