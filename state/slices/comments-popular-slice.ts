import { createAsyncThunk, createEntityAdapter, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { newCommCalc } from "./popular-slice";
import { createOperations, createOperationStatus, OperationState } from "@/app/types";
import { CommentRootState, CommentsFetchReq, CommentsFetchRes, 
    GetRepliesFetchReq, GetRepliesFetchRes, LikeCommentFetch, CommentsData, 
    NewCommentFetchRes, NewReplyFetch, 
    ReplyData} from "@/app/(main)/popular/types";




export type CommentsOperationKey =
  | 'commVideoFetch'
  | 'newCommPopular'
  | 'likedComment'
  | 'newReplyComm'
  | 'getReplies'


const listOperationKeys: CommentsOperationKey[] = [
    'commVideoFetch',
    'newCommPopular',
    'likedComment',
    'newReplyComm',
    'getReplies',
];

interface CommentState extends CommentRootState {
    operations: OperationState<CommentsOperationKey>
}


const loadingStatus: CommentsOperationKey[] = [
    'newCommPopular',
    'newReplyComm',
];


const commentsAdapter = createEntityAdapter({
    selectId: (comment:CommentsData) => comment.id_comment,
});
  
const repliesAdapter = createEntityAdapter({
    selectId: (reply:ReplyData) => reply.id_comment,
});


const initialState: CommentState = {

    comments: {},
    replies: {},  
    operations:createOperations<CommentsOperationKey>(
        listOperationKeys,
        (key) =>
        loadingStatus.includes(key)
            ? createOperationStatus(false)
            : createOperationStatus()
    )

};




export const commVideoFetch = createAsyncThunk<CommentsFetchRes, CommentsFetchReq, { rejectValue: string }>(
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
            return rejectWithValue('Request failed!');
        }
    }
)

export const newCommPopular = createAsyncThunk<NewCommentFetchRes, CommentsData, { rejectValue: string }>(
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

            const responseConfig = await fetch('/api/popular/comments/config', {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    config_id:data.config_id,
                    id_author:data.id_author
                }),
            });

            if (!responseConfig.ok) return rejectWithValue('Server Error!');

            const dataReturn = await response.json()

            dispatch(newCommCalc({config_id:data.config_id}))
            
            return dataReturn

        } catch (error) {
            console.log(error)
            return rejectWithValue('Request failed!');
        }
    }
)


export const likedComment = createAsyncThunk<LikeCommentFetch, LikeCommentFetch, { rejectValue: string }>(
    'commentsPopular/likedComment',
    async function (data, { rejectWithValue }) {
        try {
            const urlList = data.reply ? '/api/popular/reply/like' : '/api/popular/comments/like';

            const response = await fetch(urlList, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    id_comment: data.id_comment,
                    id_author: data.id_author,
                    config_id: data.config_id,
                    liked: data.liked,
                }),
            });

            if (!response.ok) return rejectWithValue('Server Error!');

            const dataReturn = await response.json();

            if (!data.reply) {
                const responseConfig = await fetch('/api/popular/comments/like/popular-config', {
                    method: 'PATCH',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        id_author: data.id_author,
                        config_id: data.config_id,
                        liked: dataReturn.data.liked,
                    }),
                });

                if (!responseConfig.ok) return rejectWithValue('Server Error!');
            }

            return {
                reply: data.reply,
                id_branch: data.id_branch,
                id_comment: data.id_comment,
                id_author: data.id_author,
                config_id: data.config_id,
                liked: dataReturn.data.liked,
            };

        }  catch (error) {
            console.log(error)
            return rejectWithValue('Request failed!');
        }
    }
)


export const newReplyComm = createAsyncThunk<NewReplyFetch, NewReplyFetch, { rejectValue: string }>(
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
            return rejectWithValue('Request failed!');
        }
    }
)

export const getReplies = createAsyncThunk<GetRepliesFetchRes, GetRepliesFetchReq, { rejectValue: string }>(
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
            return rejectWithValue('Request failed!');
        }
    }
)




const createReducerHandlers = <T extends keyof CommentState['operations']>(operationName: T) => ({
    pending: (state: CommentState) => {
        state.operations[operationName].error = false;
        state.operations[operationName].loading = true;
    },
    rejected: (state: CommentState) => {
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
            .addCase(commVideoFetch.fulfilled, (state, action: PayloadAction<CommentsFetchRes, string>) => {
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
            .addCase(newCommPopular.fulfilled, (state, action: PayloadAction<NewCommentFetchRes, string>) => {
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
            .addCase(likedComment.fulfilled, (state, action: PayloadAction<LikeCommentFetch, string>) => {
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
            .addCase(newReplyComm.fulfilled, (state, action: PayloadAction<NewReplyFetch, string>) => {
                state.operations.newReplyComm.error = false
                state.operations.newReplyComm.loading = false

                const data = action.payload;
                const reply = data.data
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
            .addCase(getReplies.fulfilled, (state, action: PayloadAction<GetRepliesFetchRes, string>) => {
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