'use client'
// import { initUserStateType, collectionUser } from "@/types/types"
import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit"

export type popConfig = {
    category_id: string
    name:string
    multiplier: number[]
}

export type collectionUser =  {
    name: string ,
    email: string ,
    provider: string ,
    img: string ,
    connection_id: string ,
    popular_config: popConfig[] 
}

export type initUserStateType = {
    status: boolean,
    error: boolean,
    user:collectionUser
}


const initialState: initUserStateType = {
    status: false,
    error: false,
    user: {
        name: '',
        email: '',
        provider: '',
        img: '',
        connection_id: '',
        popular_config: [
           
        ]
    }

}


export const fetchUser = createAsyncThunk<collectionUser, string, { rejectValue: string }>(
    'userSlice/fetchUser',
    async function (connection_id, { rejectWithValue, dispatch }) {
        try {
            const response = await fetch(`/api/user?connection_id=${connection_id}`);

            if (!response.ok) {
                return rejectWithValue('Server Error!');
            }

            const data = await response.json();
            console.log(data)
            return data;

        } catch (error) {
            console.error(error)
            throw error
        }
    }
);

export const fetchClearUser = createAsyncThunk<[], {rejectValue: string}>(
    'userSlice/fetchClearUser',
    async function (_, {rejectWithValue}){
        try{
            const data: [] = []

            return data
        }catch(error){
            console.error(error)
            throw error
        }
    }
)

interface dataConfigUser {
    like: boolean,
    comment: number,
    save_recipe: boolean,
    id_video: string,
    id_user: string
}






const userSlice = createSlice({
    name: 'userSlice',
    initialState,
    reducers: {
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchUser.pending, (state) => {
                state.status = true;
                state.error = false;
            })
            .addCase(fetchUser.fulfilled, (state, action: PayloadAction<collectionUser, string>) => {
                if (action.payload) {
                    state.status = false;
                    state.error = false;
                    const payload = action.payload;

                    state.user.name = payload.name;
                    state.user.email = payload.email;
                    state.user.provider = payload.provider;
                    state.user.img = payload.img;
                    state.user.connection_id = payload.connection_id;

                    payload.popular_config.forEach(el => {
                        state.user.popular_config.push(el)
                    })
                  
                }
            })
            .addCase(fetchClearUser.rejected, (state) => {
                state.status = false;
                state.error = true;
            })


    }
})




export default userSlice.reducer