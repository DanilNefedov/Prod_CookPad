import { popularInitData, PopularListDataT } from "@/app/types/types";
import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";




//maybe you shouldn't add the number of views to the redux.

const initialState: popularInitData = {
    status: false,
    error: false,
    pop_list: [

    //    export type PopularAuthorInfoT = {
    //        id_author:string,
    //        author_name:string,
    //        author_img:string,
    //    }
       
    //    export type popListReturn = {
    //        config_id:string,
    //        id_recipe:string,
    //        author_info:PopularAuthorInfoT
    //        description:string,
    //        recipe_name:string,
    //        recipe_media:MediaObj[],
    //        liked:boolean,
    //        likes:number,
    //        views:number,
    //        saves:number,
    //        saved:boolean,
    //        comments:number,
    //    }
    ]
}




export const popularFetch = createAsyncThunk<PopularListDataT[], { connection_id: string, count: number, getAllIds:null | string[] }, { rejectValue: string }>(
    'popular/popularFetch',
    async function (data, { rejectWithValue }) {
        try {
            console.log(data)
            const response = await fetch('/api/popular', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data)
            });

            if (!response.ok) return rejectWithValue('Server Error!');

            const dataList = await response.json()
            console.log(dataList)

            return dataList

        } catch (error) {
            console.log(error)
            throw error
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
            throw error
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

            console.log(returnData)

            return returnData

        } catch (error) {
            console.log(error)
            throw error
        }
    }
)




const popularSlice = createSlice({
    name: 'popular',
    initialState,
    reducers: {
        newCommCalc:(state, action:PayloadAction<{config_id:string}, string>) =>{
            const thisPop = state.pop_list.find(el => el.config_id === action.payload.config_id)
            if(thisPop){
                thisPop.comments += 1
            }
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(popularFetch.pending, (state) => {
                state.status = true,
                state.error = false
            })
            .addCase(popularFetch.fulfilled, (state, action: PayloadAction<PopularListDataT[], string>) => {
                state.error = false,
                state.status = false,
                    // console.log(action.payload)
                action.payload.map(el => {

                    state.pop_list.push(el)
                })

            })


            
            .addCase(likePopContent.pending, (state) => {
                state.status = true,
                state.error = false
            })
            .addCase(likePopContent.fulfilled, (state, action: PayloadAction<{ config_id: string, liked: boolean }, string>) => {
                state.error = false
                state.status = false
                // console.log(action.payload)
                const thisPop = state.pop_list.find(el => el.config_id === action.payload.config_id)
                if (thisPop) {
                    thisPop.liked = action.payload.liked
                    thisPop.likes = action.payload.liked ? thisPop.likes + 1 : thisPop.likes - 1
                }


            })



            .addCase(savePopContent.pending, (state) => {
                state.status = true,
                    state.error = false
            })
            .addCase(savePopContent.fulfilled, (state, action: PayloadAction<{ config_id: string, saved: boolean }, string>) => {
                state.error = false
                state.status = false
                // console.log(action.payload)
                const thisPop = state.pop_list.find(el => el.config_id === action.payload.config_id)
                if (thisPop) {
                    thisPop.saved = !action.payload.saved
                    thisPop.saves = action.payload.saved ? thisPop.saves - 1 : thisPop.saves + 1
                }


            })
        
    }
})





export const { newCommCalc } = popularSlice.actions;

export default popularSlice.reducer