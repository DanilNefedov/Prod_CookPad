import { commListData, commListState, replyCommData } from "@/app/types/types";
import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { newCommCalc } from "./popular-slice";




const initialState:commListState = {
    status: false,
    error: false,
    page:1,
    comm_list: [

        // id_comment: string,
        // id_author: string,
        // id_video: string,
        // text: string,
        // answer_count:number,
        // createdAt:string
    ]
}

interface ReturnCommDataT {
    formattedComments:commListData[],
    page:number,
    totalCommentsCount:number
}


export const commVideoFetch = createAsyncThunk<ReturnCommDataT, {config_id: string, user_id:string, page:number,newComments:string[]}, { rejectValue: string }>(
    'commentsPopular/commVideoFetch',
    async function (data, { rejectWithValue }) {
        try {
            const responseList = await fetch(`/api/popular/comments/all`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data),
            });

            if (!responseList.ok) return rejectWithValue('Server Error!');

            const dataList = await responseList.json()

            // console.log(dataList)
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
            const urlList = data.reply ? '/api/popular/reply/like': `/api/popular/comments/like`

            const response = await fetch(urlList, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data),
            });

            if (!response.ok) return rejectWithValue('Server Error!');
            
            const dataReturn = await response.json()
            // console.log(data, dataReturn)
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
            const urlList = `/api/popular/reply`

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
    page:number,
    totalCommentsCount:number,
    id_comment:string
}

export const getReplies = createAsyncThunk<returnDataT, {id_comment: string, page:number, id_author:string}, { rejectValue: string }>(
    'popular/getReplies',
    async function (data, { rejectWithValue }) {
        try {
            // const { id, count } = data
            const urlList = `/api/popular/reply?id_comment=${data.id_comment}&page=${data.page}&id_author=${data.id_author}`
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
                dataList:dataList.formattedComments,
                page:dataList.page,
                totalCommentsCount:dataList.totalCommentsCount,
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
        },
        
        resetComments: (state) =>{
            state.page = 1
        }
        
    },
    extraReducers: (builder) => {
        builder
            .addCase(commVideoFetch.pending, (state) => {
                state.status = true,
                state.error = false
            })
            .addCase(commVideoFetch.fulfilled, (state, action: PayloadAction<ReturnCommDataT, string>) => {
                state.error = false
                state.status = false
                // action.payload.map(el => {
                //     state.comm_list.push(el)
                // })
                // state.page = action.payload.page
                // state.comm_list = action.payload.formattedComments
                
                
                if (action.payload.page === 1) {
                    state.comm_list = action.payload.formattedComments;
                } else {
                    const newComments = action.payload.formattedComments;
                    state.comm_list.push(...newComments);
                
                    if (action.payload.totalCommentsCount === state.comm_list.length) {
                        state.page = NaN; 
                    } else {
                        state.page = action.payload.page;
                    }
                }
                
            
            })


            .addCase(newCommPopular.pending, (state) => {
                state.status = true,
                state.error = false
            })
            .addCase(newCommPopular.fulfilled, (state, action: PayloadAction<commListData, string>) => {
                state.error = false,
                state.status = false,
                // console.log(action.payload)
                state.comm_list.unshift(action.payload)

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
                if(thisComm && thisComm.reply_list){
                    // console.log('2')
                    // thisComm.reply_list?.push(...action.payload.dataList);

                    if(action.payload.totalCommentsCount === thisComm.reply_list?.length + action.payload.dataList.length) {
                        thisComm.page_reply = NaN;
                    }else{
                        thisComm.page_reply = action.payload.page;
                    }

                    const existingIds = new Set(thisComm.reply_list?.map(reply => reply.id_comment));
                    const newReplies = action.payload.dataList.filter(reply => !existingIds.has(reply.id_comment));
                    thisComm.reply_list?.push(...newReplies);

                }
            })

    }
})


export const { newReplyCalc, resetComments } = commentsPopularSlice.actions;


export default commentsPopularSlice.reducer