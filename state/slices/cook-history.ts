import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { createOperations, createOperationStatus, OperationState } from "@/app/types";
import { ChangeHistoryFetchReq, ChangeHistoryFetchRes, CookHistoryRootState, DeleteCookHistoryFetch, 
    HistoryLinksFetchReq, NewCookHistoryFetch } from "@/app/(main)/cook/types";



export type CookHistoryOperationKey =
  | 'fetchHistoryCook'
  | 'newCookHistory'
  | 'deleteCookHistory'
  | 'changeHistory'


interface CookHistoryState extends CookHistoryRootState {
    operations: OperationState<CookHistoryOperationKey>
}


const initialState:CookHistoryState = {
    connection_id: '',
    history_links:[],
    operations:createOperations<CookHistoryOperationKey>(
        ['fetchHistoryCook', 'newCookHistory', 'deleteCookHistory', 'changeHistory'],
        (key) => {
            if (key === 'deleteCookHistory') {
                return createOperationStatus(false);
            }
            return createOperationStatus();
        }
    )
}



export const fetchHistoryCook = createAsyncThunk<CookHistoryRootState, HistoryLinksFetchReq, {rejectValue: string}>(
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
                dispatch(newCookHistory({ connection_id, history_links:{recipe_id:newCook.recipe_id, recipe_name:newCook.name} }))
            }
            
            return cook

        }catch(error){
            console.error(error)
            return rejectWithValue('Request failed!');
        }
    }
)



export const changeHistory = createAsyncThunk<ChangeHistoryFetchRes, ChangeHistoryFetchReq, {rejectValue: string}>(
    'cook-history/changeHistory',
    async function ({recipe_id, user_id, name}, {rejectWithValue}){
        try{
            const data = {
                name,
                user_id,
                recipe_id
            }

            const response = await fetch(`/api/cook/history/modify`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data),
            });

            if (!response.ok) {
                return rejectWithValue('Server Error!');
            }

            const res = await response.json();

            return res

        }catch(error){
            console.error(error)
            return rejectWithValue('Request failed!');
        }
    }
)




export const newCookHistory = createAsyncThunk<NewCookHistoryFetch, NewCookHistoryFetch, {rejectValue: string}>(
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

            await response.json();
            // const newHeader = await response.json();
            return data;

        }catch(error){
            console.error(error)
            return rejectWithValue('Request failed!');
        }
    }
)

export const deleteCookHistory = createAsyncThunk<DeleteCookHistoryFetch, DeleteCookHistoryFetch, {rejectValue: string}>(
    'cook-history/deleteCookHistory',
    async function ({connection_id, recipe_id}, {rejectWithValue}){
        try {
            const response = await fetch(`/api/cook/history/${recipe_id}`, {
                method: 'PATCH',
                headers: { 
                    'Content-Type': 'application/json' 
                },
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
const changeHistoryHandlers = createReducerHandlers('changeHistory');


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
            .addCase(fetchHistoryCook.fulfilled, (state, action: PayloadAction<CookHistoryRootState, string>) => {
                state.operations.fetchHistoryCook.error = false
                state.operations.fetchHistoryCook.loading = false

                state.connection_id = action.payload.connection_id
                action.payload.history_links.map(el => {
                    
                    const thisCook = state.history_links.find(elem => elem.recipe_id === el.recipe_id)
                    if(!thisCook){

                        state.history_links.unshift(el)
                    }
                })
            })



            .addCase(newCookHistory.pending, newCookHistoryHandlers.pending)
            .addCase(newCookHistory.rejected, newCookHistoryHandlers.rejected)
            .addCase(newCookHistory.fulfilled, (state, action: PayloadAction<NewCookHistoryFetch, string>) => {
                state.operations.newCookHistory.error = false
                state.operations.newCookHistory.loading = false

                const thisLink = state.history_links.find(el => el.recipe_id === action.payload.history_links.recipe_id)

                if(!thisLink) state.history_links.unshift(action.payload.history_links)
                
            })

            .addCase(changeHistory.pending, changeHistoryHandlers.pending)
            .addCase(changeHistory.rejected, changeHistoryHandlers.rejected)
            .addCase(changeHistory.fulfilled, (state, action: PayloadAction<ChangeHistoryFetchRes, string>) => {
                state.operations.newCookHistory.error = false
                state.operations.newCookHistory.loading = false

                const thisLink = state.history_links.find(el => el.recipe_id === action.payload.recipe_id)

                if(thisLink) {
                    thisLink.recipe_name = action.payload.name
                }
                
            })
            



            .addCase(deleteCookHistory.pending, deleteCookHistoryHandlers.pending)
            .addCase(deleteCookHistory.rejected, deleteCookHistoryHandlers.rejected)
            .addCase(deleteCookHistory.fulfilled, (state, action: PayloadAction<DeleteCookHistoryFetch, string>) => {
                state.operations.deleteCookHistory.error = false
                state.operations.deleteCookHistory.loading = false
            
                state.history_links = state.history_links.filter(link => link.recipe_id !== action.payload.recipe_id);
            });
    }
})

export const { closeAlertCookHistory } = CookHistorySlice.actions


export default CookHistorySlice.reducer