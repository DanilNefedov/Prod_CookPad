import connectDB from "@/app/lib/mongoose";
import CommentPopular from "@/app/models/comments-popular";
import LikesComments from "@/app/models/likes-comments";
import moment from 'moment';
import { NextResponse } from "next/server";






export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const config_id = searchParams.get('config_id');
        const id_author = searchParams.get('user_id');

        if (!config_id || !id_author) {
            return NextResponse.json({ status: 400, message: 'Missing parameters' });
        }

        await connectDB();

        const comments = await CommentPopular.find({ config_id })
            .sort({ createdAt: 1 })
            .limit(15)
            .lean();


        const commentIds = comments.map((el) => el.id_comment);

        const likes = await LikesComments.find({
            id_comment: { $in: commentIds },
            id_author
        }).lean();

        const likedSet = new Set(likes.map((like) => like.id_comment));


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

        return NextResponse.json(formattedComments);
        
    } catch (error) {
        console.error('Error fetching comments:', error);
        return NextResponse.json({
            status: 500,
            body: { message: 'Internal Server Error', error: error },
        });
    }
}
