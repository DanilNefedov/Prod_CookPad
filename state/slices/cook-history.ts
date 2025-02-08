import { CookHistoryT, NameLinksT } from "@/app/types/types";
import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";





const initialState:CookHistoryT = {
    status: false,
    error: false,
    connection_id: '',
    history_links:[

    ],
    
}


interface fetchCookHistoryT {
    connection_id:string,
    history_links:NameLinksT[]
}


export const fetchHistoryCook = createAsyncThunk<fetchCookHistoryT, {connection_id:string}, {rejectValue: string}>(
    'cook-history/fetchHistoryCook',
    async function ({connection_id}, {rejectWithValue}){
        try{
            const url = `/api/cook/history?connection_id=${connection_id}`
            const response = await fetch(url);

            if (!response.ok) {
                return rejectWithValue('Server Error!');
            }
            const cookData = await response.json();
            
            return cookData

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
            console.log(data, newHeader)
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
        try{
            const response = await fetch(`/api/cook/history/${recipe_id}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({connection_id, recipe_id}),
            });

            if (!response.ok) {
                return rejectWithValue('Server Error!');
            }

            const newHeader = await response.json();
            return {connection_id, recipe_id};

        }catch(error){
            console.error(error)
            throw error
        }
    }
)





const CookHistorySlice = createSlice({
    name: 'cook-history',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
        .addCase(fetchHistoryCook.pending, (state) => {
            state.status = true,
            state.error = false
        })
        .addCase(fetchHistoryCook.fulfilled, (state, action: PayloadAction<fetchCookHistoryT, string>) => {
            state.status = false;
            state.error = false;

            state.connection_id = action.payload.connection_id
            action.payload.history_links.map(el => {
                
                const thisCook = state.history_links.find(elem => elem.recipe_id === el.recipe_id)
                if(!thisCook){

                    state.history_links.push(el)
                }
            })
        })





        .addCase(newCookHistory.pending, (state) => {
            state.status = true,
            state.error = false
        })
        .addCase(newCookHistory.fulfilled, (state, action: PayloadAction<newCookHistoryT, string>) => {
            state.status = false;
            state.error = false;

            const thisLink = state.history_links.find(el => el.recipe_id === action.payload.history_links.recipe_id)
            if(!thisLink) state.history_links.push(action.payload.history_links)
            
        })




        .addCase(deleteCookHistory.pending, (state) => {
            state.status = true,
            state.error = false
        })
        .addCase(deleteCookHistory.fulfilled, (state, action: PayloadAction<{connection_id:string, recipe_id:string}, string>) => {
            state.status = false;
            state.error = false;

            state.history_links = state.history_links.filter(link => link.recipe_id !== action.payload.recipe_id);

        })
           
    }
})


export default CookHistorySlice.reducer