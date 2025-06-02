import { popularInitData, PopularListDataT } from "@/app/types/types";
import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";




export type PopularOperationKey =
  | 'popularFetch'
  | 'likePopContent'
  | 'savePopContent'
  | 'updateViews'
  


type OperationStatus = {
    loading: boolean
    error: boolean
}

type OperationState = Record<PopularOperationKey, OperationStatus>

interface PopularState extends popularInitData {
    operations: OperationState
}

const defaultStatus: OperationStatus = { loading: true, error: false }

//maybe shouldn't add the number of views to the redux.

const initialState: PopularState = {
    status: false,
    error: false,
    pop_list: [
    ],
    operations:{
        popularFetch:defaultStatus,
        likePopContent:defaultStatus,
        savePopContent:defaultStatus,
        updateViews:defaultStatus
    }
}




export const popularFetch = createAsyncThunk<PopularListDataT[], { connection_id: string, count: number, getAllIds:null | string[] }, { rejectValue: string }>(
    'popular/popularFetch',
    async function (data, { rejectWithValue }) {
        try {
            const response = await fetch('/api/popular', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data)
            });

            if (!response.ok) return rejectWithValue('Server Error!');

            const dataCoef = await response.json()

            const responseData = await fetch('/api/popular/compilation', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({fullSorted:dataCoef, connection_id:data.connection_id})
            })

            if (!responseData.ok) return rejectWithValue('Server Error!');
            
            const dataList = await responseData.json()
            return dataList

        } catch (error) {
            console.log(error)
            return rejectWithValue('Request failed!');
        }
    }
)



export const likePopContent = createAsyncThunk<{ config_id: string, liked: boolean }, { config_id: string, liked: boolean, user_id: string}, { rejectValue: string } >(
    'popular/likePopContent',
    async function (data, { rejectWithValue }) {
        try {
            console.log(data)
            const response = await fetch('/api/popular/like', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data)
            });

            if (!response.ok) return rejectWithValue('Server Error!');

            const returnData = await response.json()

            return returnData

        } catch (error) {
            console.log(error)
            return rejectWithValue('Request failed!');
        }
    }
)



export const savePopContent = createAsyncThunk<{ config_id: string, saved: boolean }, { config_id: string, saved: boolean, user_id: string }, { rejectValue: string }>(
    'popular/savePopContent',
    async function (data, { rejectWithValue }) {
        try {

            const response = await fetch('/api/popular/save', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data)
            });

            if (!response.ok) return rejectWithValue('Server Error!');

            const returnData = await response.json()

            return returnData

        } catch (error) {
            console.log(error)
            return rejectWithValue('Request failed!');
        }
    }
)

export const updateViews = createAsyncThunk<{ config_id: string }, { config_id: string }, { rejectValue: string }>(
    'popular/updateViews',
    async function (data, { rejectWithValue }) {
        try {

            const response = await fetch(`/api/popular`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ config_id:data.config_id }),
            });

            if (!response.ok) return rejectWithValue('Server Error!');

            const returnData = await response.json()

            return returnData

        } catch (error) {
            console.log(error)
            return rejectWithValue('Request failed!');
        }
    }
)




const createReducerHandlers = <T extends keyof PopularState['operations']>(operationName: T) => ({
    pending: (state: PopularState) => {
        state.operations[operationName].error = false;
        state.operations[operationName].loading = true;
    },
    rejected: (state: PopularState) => {
        state.operations[operationName].error = true;
        state.operations[operationName].loading = false;
    }
});


const popularFetchHandlers = createReducerHandlers('popularFetch');
const likePopContentHandlers = createReducerHandlers('likePopContent');
const savePopContentHandlers = createReducerHandlers('savePopContent');
const updateViewsHandlers = createReducerHandlers('updateViews');


const popularSlice = createSlice({
    name: 'popular',
    initialState,
    reducers: {
        newCommCalc:(state, action:PayloadAction<{config_id:string}, string>) =>{
            const thisPop = state.pop_list.find(el => el.config_id === action.payload.config_id)
            if(thisPop){
                thisPop.comments += 1
            }
        },
        closeAlertPopular(state, action: PayloadAction<PopularOperationKey>){
            const key = action.payload

            if (state.operations[key]) {
                state.operations[key].error = false
                state.operations[key].loading = false
            }
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(popularFetch.pending, popularFetchHandlers.pending)
            .addCase(popularFetch.rejected, popularFetchHandlers.rejected)
            .addCase(popularFetch.fulfilled, (state, action: PayloadAction<PopularListDataT[], string>) => {
                state.operations.popularFetch.error = false
                state.operations.popularFetch.loading = false
                    // console.log(action.payload)
                action.payload.map(el => {
                    state.pop_list.push(el)
                })

            })


            
            .addCase(likePopContent.pending, likePopContentHandlers.pending)
            .addCase(likePopContent.rejected, likePopContentHandlers.rejected)
            .addCase(likePopContent.fulfilled, (state, action: PayloadAction<{ config_id: string, liked: boolean }, string>) => {
                state.operations.likePopContent.error = false
                state.operations.likePopContent.loading = false
                // console.log(action.payload)
                const thisPop = state.pop_list.find(el => el.config_id === action.payload.config_id)
                if (thisPop) {
                    thisPop.liked = action.payload.liked
                    thisPop.likes = action.payload.liked ? thisPop.likes + 1 : thisPop.likes - 1
                }


            })



            .addCase(savePopContent.pending, savePopContentHandlers.pending)
            .addCase(savePopContent.rejected, savePopContentHandlers.rejected)
            .addCase(savePopContent.fulfilled, (state, action: PayloadAction<{ config_id: string, saved: boolean }, string>) => {
                state.operations.savePopContent.error = false
                state.operations.savePopContent.loading = false
                // console.log(action.payload)
                const thisPop = state.pop_list.find(el => el.config_id === action.payload.config_id)
                if (thisPop) {
                    thisPop.saved = !action.payload.saved
                    thisPop.saves = action.payload.saved ? thisPop.saves - 1 : thisPop.saves + 1
                }
            })


            .addCase(updateViews.pending, updateViewsHandlers.pending)
            .addCase(updateViews.rejected, updateViewsHandlers.rejected)
            .addCase(updateViews.fulfilled, (state, action: PayloadAction<{ config_id: string }, string>) => {
                state.operations.updateViews.error = false
                state.operations.updateViews.loading = false
            })
        
    }
})





export const { newCommCalc, closeAlertPopular } = popularSlice.actions;

export default popularSlice.reducer