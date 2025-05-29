import { CommListData, ErrorStatus, ReplyCommData } from "@/app/types/types";
import { createAsyncThunk, createEntityAdapter, createSlice, EntityState, PayloadAction } from "@reduxjs/toolkit";
import { newCommCalc } from "./popular-slice";




export type CommentsOperationKey =
  | 'commVideoFetch'
  | 'newCommPopular'
  | 'likedComment'
  | 'newReplyComm'
  | 'getReplies'



type OperationStatus = {
    loading: boolean
    error: boolean
}

type OperationState = Record<CommentsOperationKey, OperationStatus>

interface CommentStateI extends CommentState {
    operations: OperationState
}

const defaultStatus: OperationStatus = { loading: true, error: false }




const commentsAdapter = createEntityAdapter({
    selectId: (comment:CommListData) => comment.id_comment,
});
  
const repliesAdapter = createEntityAdapter({
    selectId: (reply:ReplyCommData) => reply.id_comment,
});


export type CommentState = {
    status: boolean;
    error: boolean;
    comments: {
        [parentId: string]: {
            page: number;
            ids: string[];
            entities: Record<string, CommListData>;
        }
    };
    replies: {
        [parentId: string]: {
            page: number;
            ids: string[];
            entities: Record<string, ReplyCommData>;
        };
    };
};
  
const initialState: CommentStateI = {
    status: false,
    error: false,
    comments: {},
    replies: {},  
    operations:{
        commVideoFetch:defaultStatus,
        newCommPopular:defaultStatus,
        likedComment:defaultStatus,
        newReplyComm:defaultStatus,
        getReplies:defaultStatus
    }
};




interface ReturnCommDataT {
    formattedComments:CommListData[],
    page:number,
    totalCommentsCount:number,
    config_id:string
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

            return dataList

        } catch (error) {
            console.log(error)
            throw error
        }
    }
)

interface CommListDataReturn {
    responseData:CommListData,
    config_id:string
}


export const newCommPopular = createAsyncThunk<CommListDataReturn, CommListData, { rejectValue: string }>(
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

            dispatch(newCommCalc({config_id:data.config_id}))
            return dataReturn

        } catch (error) {
            console.log(error)
            throw error
        }
    }
)

interface LikedCommnetDataT {
    id_author:string, 
    id_branch:string, 
    // id_branch:string,
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

interface ReplyCommDataReturn{
    responseData:ReplyCommData
    config_id:string
}

export const newReplyComm = createAsyncThunk<ReplyCommDataReturn, {data:ReplyCommData, config_id:string}, { rejectValue: string }>(
    'popular/newReplyComm',
    async function (data, { rejectWithValue, dispatch }) {
        try {
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
            return dataReturn

        } catch (error) {
            console.log(error)
            throw error
        }
    }
)

interface returnDataT {
    dataList:ReplyCommData[],
    page:number,
    totalCommentsCount:number,
    id_comment:string
}

export const getReplies = createAsyncThunk<returnDataT, {id_comment: string, page:number, id_author:string,newReply:string[]}, { rejectValue: string }>(
    'popular/getReplies',
    async function (data, { rejectWithValue }) {
        try {
            // const { id, count } = data
            // const urlList = `/api/popular/reply?id_comment=${data.id_comment}&page=${data.page}&id_author=${data.id_author}`
            // const responseList = await fetch(urlList);
            // if (!responseList.ok) return rejectWithValue('Server Error!');
            // const dataList = await responseList.json()

            const urlList = `/api/popular/reply/all`

            const response = await fetch(urlList, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data),
            });

            if (!response.ok) return rejectWithValue('Server Error!');

            const dataList = await response.json()

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




const createReducerHandlers = <T extends keyof CommentStateI['operations']>(operationName: T) => ({
    pending: (state: CommentStateI) => {
        state.operations[operationName].error = false;
        state.operations[operationName].loading = true;
    },
    rejected: (state: CommentStateI) => {
        state.operations[operationName].error = true;
        state.operations[operationName].loading = false;
    }
});

const commVideoFetchHandlers = createReducerHandlers('commVideoFetch');
const newCommPopularHandlers = createReducerHandlers('newCommPopular');
const likedCommentHandlers = createReducerHandlers('likedComment');
const newReplyCommHandlers = createReducerHandlers('newReplyComm');
const getRepliesHandlers = createReducerHandlers('getReplies');
  



const commentsPopularSlice = createSlice({
    name: 'commentsPopular',
    initialState,
    reducers: {
        initCommentsState: (state, action: PayloadAction<string>) => {
            const config_id = action.payload;
            if (!state.comments[config_id]) {
                state.comments[config_id] = commentsAdapter.getInitialState({ page: 0 });
            }
        },

        closeAlertComments(state, action: PayloadAction<CommentsOperationKey>){
            const key = action.payload

            if (state.operations[key]) {
                state.operations[key].error = false
                state.operations[key].loading = false
            }
        }
          
        
        // resetComments: (state) =>{
        //     state.comments = commentsAdapter.getInitialState({
        //         page: 1,
        //         ids: [],
        //         entities: {},
        //     });
        // }
        
    },
    extraReducers: (builder) => {
        builder
            .addCase(commVideoFetch.pending, commVideoFetchHandlers.pending)
            .addCase(commVideoFetch.rejected, commVideoFetchHandlers.rejected)
            .addCase(commVideoFetch.fulfilled, (state, action: PayloadAction<ReturnCommDataT>) => {
                state.operations.commVideoFetch.error = false
                state.operations.commVideoFetch.loading = false
                
                const { config_id, page, totalCommentsCount, formattedComments } = action.payload;


                if (!state.comments[config_id]) {
                  state.comments[config_id] = commentsAdapter.getInitialState({ page: 0 });
                }

                const commentsState = state.comments[config_id];
                
                if (formattedComments && formattedComments.length > 0) {
                    if (page === 1) {
                        commentsAdapter.setAll(commentsState, formattedComments);
                    } else {
                        commentsAdapter.addMany(commentsState, formattedComments);
                    }
                }
                commentsState.page = totalCommentsCount <= commentsState.ids.length ? NaN : page;

            
            })


            .addCase(newCommPopular.pending, newCommPopularHandlers.pending)
            .addCase(newCommPopular.rejected, newCommPopularHandlers.rejected)
            .addCase(newCommPopular.fulfilled, (state, action: PayloadAction<CommListDataReturn, string>) => {
                state.operations.newCommPopular.error = false
                state.operations.newCommPopular.loading = false

                const { config_id, responseData } = action.payload;
                
                if (!state.comments[config_id]) {
                    state.comments[config_id] = {
                        page: 1,
                        ids: [],
                        entities: {},
                    };
                }

                commentsAdapter.addOne(state.comments[config_id], responseData);

                state.comments[config_id].ids = [
                    responseData.id_comment,
                    ...state.comments[config_id].ids.filter(id => id !== responseData.id_comment),
                ];

            })


            .addCase(likedComment.pending, likedCommentHandlers.pending)
            .addCase(likedComment.rejected, likedCommentHandlers.rejected)
            .addCase(likedComment.fulfilled, (state, action: PayloadAction<LikedCommnetDataT, string>) => {
                state.operations.likedComment.error = false
                state.operations.likedComment.loading = false

                const { id_comment, liked, reply, id_branch, config_id } = action.payload;

                if (!reply) {

                    const commentBlock = state.comments[config_id];
                    if (!commentBlock) return;

                    const existingComment = commentBlock.entities[id_comment];
                    if (!existingComment) return;

                    commentsAdapter.updateOne(commentBlock, {
                        id: id_comment,
                        changes: {
                            liked,
                            likes_count: liked
                                ? existingComment.likes_count + 1
                                : existingComment.likes_count - 1,
                        },
                    });
                } else {
                    const replyBlock = state.replies[id_branch];
                    if (!replyBlock) return;
            
                    const existingReply = replyBlock.entities[id_comment];
                    if (!existingReply) return;
            
                    repliesAdapter.updateOne(replyBlock, {
                        id: id_comment,
                        changes: {
                            liked,
                            likes_count: liked ? existingReply.likes_count + 1 : existingReply.likes_count - 1,
                        },
                    });
                }
                
            })

            .addCase(newReplyComm.pending, newReplyCommHandlers.pending)
            .addCase(newReplyComm.rejected, newReplyCommHandlers.rejected)
            .addCase(newReplyComm.fulfilled, (state, action: PayloadAction<ReplyCommDataReturn, string>) => {
                state.operations.newReplyComm.error = false
                state.operations.newReplyComm.loading = false

                const data = action.payload;
                const reply = data.responseData
                const id_comment = reply.id_branch;
                const config_id = data.config_id;
                
                if (!state.replies[id_comment]) {
                    state.replies[id_comment] = repliesAdapter.getInitialState({ page: 0 });
                } else if (typeof state.replies[id_comment].page !== 'number') {
                    state.replies[id_comment].page = 0;
                }

                repliesAdapter.addOne(state.replies[id_comment], reply);


                const replyBlock = state.replies[id_comment];
                replyBlock.entities[reply.id_comment] = reply;

                replyBlock.ids = [
                    reply.id_comment,
                    ...replyBlock.ids.filter(id => id !== reply.id_comment)
                ];



                const commentBlock = state.comments[config_id];
                if (!commentBlock) return;

                const parentComment = commentBlock.entities[id_comment];
                if (!parentComment) return;

                commentsAdapter.updateOne(commentBlock, {
                    id: id_comment,
                    changes: {
                        reply_count: parentComment.reply_count + 1,
                    },
                });

            })


            .addCase(getReplies.pending, getRepliesHandlers.pending)
            .addCase(getReplies.rejected, getRepliesHandlers.rejected)
            .addCase(getReplies.fulfilled, (state, action: PayloadAction<returnDataT, string>) => {
                state.operations.getReplies.error = false
                state.operations.getReplies.loading = false
            
                const { id_comment, dataList, page, totalCommentsCount } = action.payload;
            
                if (!state.replies[id_comment]) {
                    state.replies[id_comment] = repliesAdapter.addMany(
                        repliesAdapter.getInitialState({ page }),
                        dataList
                    );
            
                    if (dataList.length === totalCommentsCount) {
                        state.replies[id_comment].page = NaN;
                    }
                } else {
                    const replyBlock = state.replies[id_comment];
            
                    repliesAdapter.addMany(replyBlock, dataList);
            
                    if (replyBlock.ids.length === totalCommentsCount) {
                        replyBlock.page = NaN;
                    } else {
                        replyBlock.page = page;
                    }
                }
            })
 
    }
})


export const { initCommentsState, closeAlertComments } = commentsPopularSlice.actions;


export default commentsPopularSlice.reducer