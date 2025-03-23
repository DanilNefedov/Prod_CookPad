import { commListData, commListState } from "@/app/types/types";
import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { newCommCalc } from "./popular-slice";




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



export const newCommPopular = createAsyncThunk<commListData, {data:commListData, comment_branch:boolean}, { rejectValue: string }>(
    'commentsPopular/newCommPopular',
    async function (data, { rejectWithValue, dispatch }) {
        try {
            // const { id, count } = data
            const urlList = `/api/popular/comments/popular`

            const response = await fetch(urlList, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data),
            });

            if (!response.ok) return rejectWithValue('Server Error!');

            const dataReturn = await response.json()

            dispatch(newCommCalc({config_id:data.data.config_id}))
            return dataReturn

        } catch (error) {
            console.log(error)
            throw error
        }
    }
)

interface LikedCommnetDataT {
    id_author:string, 
    // id_branch:openReply === '' ? infoReply.id_comment : openReply, 
    id_comment:string, 
    config_id:string, 
    // id_parent, 
    liked:boolean, 
    reply:boolean
}

export const likedComment = createAsyncThunk<LikedCommnetDataT, LikedCommnetDataT, { rejectValue: string }>(
    'commentsPopular/likedComment',
    async function (data, { rejectWithValue }) {
        try {
            const urlList = `/api/popular/like/comment`

            const response = await fetch(urlList, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data),
            });

            if (!response.ok) return rejectWithValue('Server Error!');
            
            const dataReturn = await response.json()
            console.log(data, dataReturn)
            return dataReturn.data

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


            .addCase(newCommPopular.pending, (state) => {
                state.status = true,
                state.error = false
            })
            .addCase(newCommPopular.fulfilled, (state, action: PayloadAction<commListData, string>) => {
                state.error = false,
                state.status = false,
                // console.log(action.payload)
                state.comm_list.push(action.payload)

            })

    }
})


export const { newReplyCalc } = commentsPopularSlice.actions;


export default commentsPopularSlice.reducer