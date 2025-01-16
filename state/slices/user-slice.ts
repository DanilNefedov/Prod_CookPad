'use client'
// import { initUserStateType, collectionUser } from "@/types/types"
import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit"

export type popConfig = {
    category_id: string
    name:string
    multiplier: number[]
}

export type collectionUser =  {
    name: string | null,
    email: string | null,
    provider: string | null,
    img: string ,
    connection_id: string | null,
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
        name: null,
        email: null,
        provider: null,
        img: '',
        connection_id: null,
        popular_config: [
           
        ]
    }

}


// export const fetchUser = createAsyncThunk<collectionUser, string, { rejectValue: string }>(
//     'user/fetchUser',
//     async function (id, { rejectWithValue, dispatch }) {
//         try {
//             const response = await fetch(`/api/user?connection_id=${id}`);

//             if (!response.ok) {
//                 return rejectWithValue('Server Error!');
//             }

//             const data = await response.json();
//             // console.log(data)

//             // if (data.user.length === 0) {
//             //     // dispatch(addUser())
//             //     console.error('Object User is empty')
//             // } else {
//             return data;
//             // }
            

//         } catch (error) {
//             console.error(error)
//             throw error
//         }
//     }
// );//clear

// export const fetchClearUser = createAsyncThunk<[], {rejectValue: string}>(
//     'user/fetchClearUser',
//     async function (_, {rejectWithValue}){
//         try{
//             const data: [] = []

//             return data
//         }catch(error){
//             console.error(error)
//             throw error
//         }
//     }
// )

// interface dataConfigUser {
//     like: boolean,
//     comment: number,
//     save_recipe: boolean,
//     id_video: string,
//     id_user: string
// }






const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
    },
    extraReducers: (builder) => {
        builder
            // .addCase(fetchUser.pending, (state) => {
            //     state.status = true;
            //     state.error = false;
            // })
            // .addCase(fetchUser.fulfilled, (state, action: PayloadAction<collectionUser, string>) => {
            //     if (action.payload) {
            //         state.status = false;
            //         state.error = false;
            //         const payload = action.payload;

            //         state.user.name = payload.name;
            //         state.user.email = payload.email;
            //         state.user.provider = payload.provider;
            //         state.user.img = payload.img;
            //         state.user.connection_id = payload.connection_id;

            //         payload.popular_config.forEach(el => {
            //             state.user.popular_config.push(el)
            //         })
                  
            //     }
            // })
            // .addCase(fetchClearUser.rejected, (state) => {
            //     state.status = false;
            //     state.error = true;
            // })


    }
})




export default userSlice.reducer