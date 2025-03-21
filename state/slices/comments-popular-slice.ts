import { commListData, commListState } from "@/app/types/types";
import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";




const initialState:commListState = {
    status: false,
    error: false,
    comm_list: [

        // id_comment: string,
        // id_author: string,
        // id_video: string,
        // text: string,
        // answer_count:number,
        // createdAt:string
    ]
}




export const commVideoFetch = createAsyncThunk<commListData[], {config_id: string, user_id:string}, { rejectValue: string }>(
    'commentsPopular/commVideoFetch',
    async function (data, { rejectWithValue }) {
        try {
            const urlList = `/api/popular/comments/popular?config_id=${data.config_id}&user_id=${data.user_id}`
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




const commentsPopularSlice = createSlice({
    name: 'commentsPopular',
    initialState,
    reducers: {
        newReplyCalc:(state, action:PayloadAction<{id_branch:string}, string>) =>{
            const thisPop = state.comm_list.find(el => el.id_comment === action.payload.id_branch)
            // console.log('2w', thisPop)
            if(thisPop){
                // console.log('22w')
                thisPop.answer_count += 1
            }
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(commVideoFetch.pending, (state) => {
                state.status = true,
                state.error = false
            })
            .addCase(commVideoFetch.fulfilled, (state, action: PayloadAction<commListData[], string>) => {
                state.error = false,
                state.status = false,
                // action.payload.map(el => {
                //     state.comm_list.push(el)
                // })

                state.comm_list = action.payload
            })

    }
})


export const { newReplyCalc } = commentsPopularSlice.actions;


export default commentsPopularSlice.reducer