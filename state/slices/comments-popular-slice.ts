import { commListData, commListState, replyCommData } from "@/app/types/types";
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
            const urlList = `/api/popular/comments?config_id=${data.config_id}&user_id=${data.user_id}`
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
            const urlList = `/api/popular/comments`

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
    id_branch:string,
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
            const urlList = `/api/popular/comments/like`

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


export const newReplyComm = createAsyncThunk<replyCommData, {data:replyCommData, config_id:string}, { rejectValue: string }>(
    'popular/newReplyComm',
    async function (data, { rejectWithValue, dispatch }) {
        try {
            // const { id, count } = data
            const urlList = `/api/popular/comments/reply`

            const response = await fetch(urlList, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data),
            });

            if (!response.ok) return rejectWithValue('Server Error!');

            const dataReturn = await response.json()

            dispatch(newCommCalc({config_id:data.config_id}))
            dispatch(newReplyCalc({id_branch:data.data.id_branch}))
            return dataReturn

        } catch (error) {
            console.log(error)
            throw error
        }
    }
)

interface returnDataT {
    dataList:replyCommData[],
    id_comment:string
}

export const getReplies = createAsyncThunk<returnDataT, {id_comment: string, skip:number, id_author:string}, { rejectValue: string }>(
    'popular/getReplies',
    async function (data, { rejectWithValue }) {
        try {
            // const { id, count } = data
            const urlList = `/api/popular/comments/reply?id_comment=${data.id_comment}&skip=${data.skip}&id_author=${data.id_author}`
            const responseList = await fetch(urlList);

            if (!responseList.ok) return rejectWithValue('Server Error!');
            const dataList = await responseList.json()

            // const dataListWithLiked = dataList.map((item:replyCommData) => {
            //     const deepCopiedItem = _.cloneDeep(item);
            //     deepCopiedItem.liked = false;
            //     // console.log(deepCopiedItem)
            //     return deepCopiedItem;
            // });

            // console.log('rrer')

            const returnData= {
                dataList,
                id_comment:data.id_comment
            }
            return returnData

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


            .addCase(likedComment.pending, (state) => {
                state.status = true,
                state.error = false
            })
            .addCase(likedComment.fulfilled, (state, action: PayloadAction<LikedCommnetDataT, string>) => {
                const {id_author, config_id, id_branch, id_comment, liked, reply} = action.payload
                state.error = false,
                state.status = false
                // console.log(action.payload)
                
                const thisComm = !reply ? state.comm_list.find(el => el.id_comment === id_comment) :
                state.comm_list.find(el => el.id_comment === id_branch)
                
                if(thisComm) {
                    if(reply){
                        const thisReply = thisComm.reply_list?.find(el => el.id_comment === id_comment)

                        if(thisReply){
                            thisReply.liked = liked
                            thisReply.likes_count = liked ? thisReply.likes_count+1 : thisReply.likes_count-1
                        }
                        
                    }else{
                        thisComm.liked = liked
                        thisComm.likes_count = liked ? thisComm.likes_count+1 : thisComm.likes_count-1
                    }
                }

                // console.log(thisComm, action.payload.reply, action.payload)
                // if(thisComm){
                //     console.log(thisComm, action.payload.reply)
                //     if(action.payload.reply){
                //         const thisReply = thisComm.reply_list?.find(el => el.id_comment === action.payload.id_comment)
                //         console.log(thisReply, action.payload.reply)
                //         if(thisReply){
                //             thisReply.liked = !action.payload.liked
                //             thisReply.likes_count = action.payload.liked ? thisReply.likes_count - 1 : thisReply.likes_count + 1
                //         }
                //     }else{
                //         thisComm.liked = !action.payload.liked
                //         thisComm.likes_count = action.payload.liked ? thisComm.likes_count - 1 : thisComm.likes_count + 1
                //     }
                // }                

            })

            .addCase(newReplyComm.pending, (state) => {
                state.status = true,
                state.error = false
            })
            .addCase(newReplyComm.fulfilled, (state, action: PayloadAction<replyCommData, string>) => {
                state.error = false,
                state.status = false
                
                const thisComm = state.comm_list.find(el => el.id_comment === action.payload.id_branch)
                if(thisComm){
                    thisComm.reply_list?.push(action.payload)
                }
                // state.comm_list.push(action.payload)
                

            })


             .addCase(getReplies.pending, (state) => {
                            state.status = true,
                            state.error = false
            })
            .addCase(getReplies.fulfilled, (state, action: PayloadAction<returnDataT, string>) => {
                state.error = false,
                state.status = false
                
                const thisComm = state.comm_list.find(el => el.id_comment === action.payload.id_comment)
                if(thisComm){
                    // console.log('2')
                    // thisComm.reply_list?.push(...action.payload.dataList);


                    const existingIds = new Set(thisComm.reply_list?.map(reply => reply.id_comment));
                    const newReplies = action.payload.dataList.filter(reply => !existingIds.has(reply.id_comment));
                    thisComm.reply_list?.push(...newReplies);

                }
            })

    }
})


export const { newReplyCalc } = commentsPopularSlice.actions;


export default commentsPopularSlice.reducer