import connectDB from "@/app/lib/mongoose";
import CommentPopular from "@/app/models/comments-popular";
import LikesComments from "@/app/models/likes-comments";
import moment from 'moment';
import { NextResponse } from "next/server";
import _ from 'lodash'; 









export async function POST(request: Request) {
    try {

        const { config_id, user_id, page, newComments } = await request.json();


        if (!config_id || !user_id || !page) {
            return NextResponse.json({ status: 400, message: 'Missing parameters' });
        }

        const pageSize = 5;
        const skip = (page - 1) * pageSize;

      

        await connectDB();

        const comments = await CommentPopular.find({ 
            config_id, 
            id_comment: { $nin: newComments } 
        })
            .sort({ createdAt: 1 }) 
            .skip(skip) 
            .limit(pageSize) 
            .lean();


        const commentIds = comments.map((el) => el.id_comment);

        const likes = await LikesComments.find({
            id_comment: { $in: commentIds },
            id_author:user_id,
            is_deleted: false, 
        }).lean();

        const likedSet = new Set(likes.map((like) => like.id_comment));

        const totalCommentsCount = await CommentPopular.countDocuments({config_id});

        const formattedComments = comments.map((el) => ({
            id_comment: el.id_comment,
            id_author: el.id_author,
            author_avatar: el.author_avatar,
            author_name: el.author_name,
            config_id: el.config_id, // before el.id_video)| can be misstake
            text: el.text,
            liked: likedSet.has(el.id_comment), 
            answer_count: el.answer_count,
            likes_count: el.likes_count,
            reply_list: [],
            createdAt: moment(el.createdAt).fromNow(),
        }));

        return NextResponse.json({formattedComments, page, totalCommentsCount});
        
    } catch (error) {
        console.error('Error fetching comments:', error);
        return NextResponse.json({
            status: 500,
            body: { message: 'Internal Server Error', error: error },
        });
    }
}

