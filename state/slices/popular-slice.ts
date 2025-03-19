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




export const popularFetch = createAsyncThunk<PopularListDataT[], { id: string, count: number }, { rejectValue: string }>(
    'popular/popularFetch',
    async function (data, { rejectWithValue }) {
        try {
            const { id, count } = data
            const urlList = `/api/popular?connection_id=${id}&count=${count}`
            const responseList = await fetch(urlList);
            
            if (!responseList.ok) return rejectWithValue('Server Error!');
            const dataList = await responseList.json()
            console.log(dataList)
            return dataList

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
        
    }
})





export const { newCommCalc } = popularSlice.actions;

export default popularSlice.reducer