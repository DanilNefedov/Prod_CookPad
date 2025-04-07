import { CommListData, ErrorStatus, ReplyCommData } from "@/app/types/types";
import { createAsyncThunk, createEntityAdapter, createSlice, EntityState, PayloadAction } from "@reduxjs/toolkit";
import { newCommCalc } from "./popular-slice";



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
        page: number;
        ids: string[];
        entities: Record<string, CommListData>;
    };
    replies: {
        [parentId: string]: {
            page: number;
            ids: string[];
            entities: Record<string, ReplyCommData>;
        };
    };
};
  
const initialState: CommentState = {
    status: false,
    error: false,
    comments: commentsAdapter.getInitialState({
        page: 1,
        ids: [],
        entities: {},
    }),
    replies: {},  
};

// {
//     status: false,
//     error: false,
//     comments: {
//       page: 1,
//       ids: ['id1', 'id2'],
//       entities: {
//         'id1':{
//             id_comment:'id1';
//             name:"name"
//         },
//         'id2':{
//             id_comment:'id2';
//             name:"name"

//         }
//       }, 
//     },
//     replies: {
//         'id1':{
//             page:1,
//             ids: ['id11', 'id22'],
//             entities:{
//                 'id11':{
//                 id_comment:'id11';
//                 name:"name"
//                 },
//                 'id22':{
//                     id_comment:'id22';
//                     name:"name"
//                 }
//             }
//         },
//         'id2':{
//             page:1,
//             ids: ['id11', 'id22'],
//             entities:{
//                 'id11':{
//                     id_comment:'id11';
//                     name:"name"
//                 },
//             }
            
//         }
//     },  
// }



interface ReturnCommDataT {
    formattedComments:CommListData[],
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

            return dataList

        } catch (error) {
            console.log(error)
            throw error
        }
    }
)



export const newCommPopular = createAsyncThunk<CommListData, CommListData, { rejectValue: string }>(
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


export const newReplyComm = createAsyncThunk<ReplyCommData, {data:ReplyCommData, config_id:string}, { rejectValue: string }>(
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
            // dispatch(newReplyCalc({id_branch:data.data.id_branch}))
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
// 
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


const commentsPopularSlice = createSlice({
    name: 'commentsPopular',
    initialState,
    reducers: {
        // newReplyCalc:(state, action:PayloadAction<{id_branch:string}, string>) =>{
        //     const thisPop = state.comments.list.find(el => el.id_comment === action.payload.id_branch)
        //     // console.log('2w', thisPop)
        //     if(thisPop){
        //         // console.log('22w')
        //         thisPop.reply_count += 1
        //     }
        // },
        
        resetComments: (state) =>{
            state.comments.page = 1
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
                
                if (action.payload.page === 1) {
                    commentsAdapter.setAll(state.comments, action.payload.formattedComments);
                } else {
                    commentsAdapter.addMany(state.comments, action.payload.formattedComments);
                }

                state.comments.page = action.payload.totalCommentsCount === state.comments.ids.length ? NaN : action.payload.page;
               
            })


            .addCase(newCommPopular.pending, (state) => {
                state.status = true,
                state.error = false
            })
            .addCase(newCommPopular.fulfilled, (state, action: PayloadAction<CommListData, string>) => {
                state.error = false,
                state.status = false,
                // console.log(action.payload)
                commentsAdapter.addOne(state.comments, action.payload)

                state.comments.ids = [
                    action.payload.id_comment,
                    ...state.comments.ids.filter(id => id !== action.payload.id_comment)
                ];

            })


            .addCase(likedComment.pending, (state) => {
                state.status = true,
                state.error = false
            })
            .addCase(likedComment.fulfilled, (state, action: PayloadAction<LikedCommnetDataT, string>) => {
                const { id_comment, liked, reply, id_branch } = action.payload;
                state.error = false,
                state.status = false

                if (!reply) {
                    const existingComment = state.comments.entities[id_comment];
                    if (!existingComment) return;
            
                    commentsAdapter.updateOne(state.comments, {
                        id: id_comment,
                        changes: {
                            liked,
                            likes_count: liked ? existingComment.likes_count + 1 : existingComment.likes_count - 1,
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
                // const existingComment = state.comments.entities[id_comment];
                
                // if (!existingComment) return;

                // commentsAdapter.updateOne(state.comments, {
                //     id: id_comment,
                //     changes: {
                //         liked,
                //         likes_count: liked ? existingComment.likes_count + 1 : existingComment.likes_count - 1
                //     }
                // });
                // console.log(action.payload)
            })

            .addCase(newReplyComm.pending, (state) => {
                state.status = true,
                state.error = false
            })
            .addCase(newReplyComm.fulfilled, (state, action: PayloadAction<ReplyCommData, string>) => {
                // state.error = false,
                // state.status = false
                
                // const thisComm = state.comments_list.find(el => el.id_comment === action.payload.id_branch)
                // if(thisComm){
                //     thisComm.reply_list?.push(action.payload)
                // }
                
                state.error = false;
                state.status = false;

                const reply = action.payload;
                const id_comment = reply.id_branch;
                // if (!state.replies[id_comment]) {
                //     state.replies[id_comment] = repliesAdapter.getInitialState({ page: 0 });
                // }
                if (!state.replies[id_comment]) {
                    // создаём с page = 0, если вообще ничего нет
                    state.replies[id_comment] = repliesAdapter.getInitialState({ page: 0 });
                } else if (typeof state.replies[id_comment].page !== 'number') {
                    // если replies уже есть, но page не задан — задаём
                    state.replies[id_comment].page = 0;
                }

                repliesAdapter.addOne(state.replies[id_comment], reply);


                const replyBlock = state.replies[id_comment];
                replyBlock.entities[reply.id_comment] = reply;

                replyBlock.ids = [
                    reply.id_comment,
                    ...replyBlock.ids.filter(id => id !== reply.id_comment)
                ];


                const parentComment = state.comments.entities[id_comment];
                if (parentComment) {
                    commentsAdapter.updateOne(state.comments, {
                        id: id_comment,
                        changes: {
                            reply_count: parentComment.reply_count + 1
                        }
                    });
                }

            })


            .addCase(getReplies.pending, (state) => {
                state.status = true,
                state.error = false
            })
            .addCase(getReplies.fulfilled, (state, action: PayloadAction<returnDataT, string>) => {
                state.error = false;
                state.status = false;
            
                const { id_comment, dataList, page, totalCommentsCount } = action.payload;
            
                // Если replies[id_comment] ещё не существует — создаём и сразу кладём туда данные
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


export const { resetComments } = commentsPopularSlice.actions;


export default commentsPopularSlice.reducer