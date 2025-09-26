// *S - start
// *E - end

import mongoose from "mongoose"
import { RecipeMedia } from "../types"

//----------- state S-----------//

export interface PopularRootState {
    pop_list:PopularData[]
}

export interface PopularData {
    config_id:string,
    id_recipe:string,
    author_info:PopularAuthorInfo
    description:string,
    recipe_name:string,
    recipe_media:RecipeMediaId[],
    liked:boolean,
    likes:number,
    views:number,
    saves:number,
    saved:boolean,
    comments:number,
}

export interface PopularAuthorInfo {
    id_author:string,
    author_name:string,
    author_img:string,
}

export interface PopularConfig{
    fully:number,
    likes:number,
    views:number,
    saves:number,
    comments:number,
    categories:string[],
}

export interface RecipeMediaId extends RecipeMedia {
    _id:string
}



//---------- thunks S----------//

export interface PopularFetchReq {
    more:boolean
    connection_id: string, 
    count: number, 
    getAllIds:null | string[]
}

export interface PopularFetchRes {
    list: PopularData[],
    more:boolean
}

export interface LikePopFetchRes {
    config_id: string, 
    liked: boolean 
}

export interface LikePopFetchReq {
    config_id: string, 
    liked: boolean, 
    user_id: string
}


export interface SavePopFetchRes {
    config_id: string, 
    saved: boolean
}

export interface SavePopFetchReq {
    config_id: string, 
    saved: boolean, 
    user_id: string
}

//---------- thunks E----------//

//--------- comments S---------//


export interface CommentRootState {
    comments: {
        [parentId: string]: {
            page: number;
            ids: string[];
            entities: Record<string, CommentsData>;
        }
    };
    replies: {
        [parentId: string]: {
            page: number;
            ids: string[];
            entities: Record<string, ReplyData>;
        };
    };
};

export interface CommentsData {
    id_comment: string,
    id_author: string,
    author_avatar:string,
    author_name:string,
    config_id: string,
    text: string,
    reply_count:number,
    likes_count:number
    createdAt?:string,
    liked?:boolean
}

export type ReplyData = {
    id_comment: string,
    id_author:string,
    id_branch:string, //id_comment from commListData
    id_parent: string,// for first reply - commListData next id_comment form replyCommData
    name_parent:string,
    author_avatar:string,
    author_name:string,
    text: string,
    likes_count:number,
    createdAt?:string,
    liked?:boolean
}

//--------- comments E---------//

//---------- thunks S----------//

export interface CommentsFetchRes {
    formattedComments:CommentsData[],
    page:number,
    totalCommentsCount:number,
    config_id:string
}

export interface CommentsFetchReq {
    config_id: string, 
    user_id:string, 
    page:number,
    newComments:string[]
}

export interface NewCommentFetchRes{
    responseData:CommentsData,
    config_id:string
}


export interface LikeCommentFetch {
    id_author:string, 
    id_branch:string, 
    id_comment:string, 
    config_id:string, 
    liked:boolean, 
    reply:boolean
}

export interface NewReplyFetch {
    data:ReplyData, 
    config_id:string
} 

export interface GetRepliesFetchRes{
    dataList:ReplyData[],
    page:number,
    totalCommentsCount:number,
    id_comment:string
}

export interface GetRepliesFetchReq{
    id_comment: string, 
    page:number, 
    id_author:string,
    newReply:string[]
}

//---------- thunks E----------//

//----------- state E-----------//

//---------- route E----------//

export interface UserMultiplier{
    id: string;
    category: string;
    multiplier: number[];
}

export interface RecipeConfig extends PopularConfig {
    _id: string;
    creator: mongoose.Schema.Types.ObjectId;
}

export interface TopItems{
    item: RecipeConfig;
    matchCoefficient: number;
}

export interface UserHistoryMulti{
    category: string,
    multiplier: number[],
    history_length_average: number
}

export interface Avarage{
    multiplier: number[],
    history_length_average: number
}

//---------- route E----------//





export interface Like {
    id_comment: string,
    config_id: string,
    liked: boolean | undefined,
    reply: boolean,
    id_branch: string
}