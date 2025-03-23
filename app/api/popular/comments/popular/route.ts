import connectDB from "@/app/lib/mongoose";
import CommentPopular from "@/app/models/comments-popular";
import LikesComments from "@/app/models/likes-comments";
import RecipePopularConfig from "@/app/models/popular-config";
import User from "@/app/models/user";
import moment from 'moment';
import { NextResponse } from "next/server";
import { categoryUser } from "../../functions";
import _ from 'lodash'; 





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



export async function POST(request: Request) {
    try {
        const { data } = await request.json();

        if (!data || !data.config_id || !data.id_author) {
            return NextResponse.json({ status: 400, message: 'Missing required fields' });
        }

        await connectDB();

        const comment = await new CommentPopular(data).save();

        const updatedPopular = await RecipePopularConfig.findOneAndUpdate(
            { _id: data.config_id },
            { $inc: { comments: 1 } },
            { new: true, lean: true }
        ).select('-_id -__v') as { categories?: string[] } | null;

        if (!updatedPopular || updatedPopular.categories === undefined) {
            return NextResponse.json({ status: 404, message: 'Popular config not found' });
        }

        const user = await User.findOne({ connection_id: data.id_author })

        if (!user) {
            return NextResponse.json({ status: 404, message: 'User not found' });
        }

        const updatedConfig = categoryUser(user.popular_config, !data.comment, 1.2, updatedPopular.categories);
        if (updatedConfig.length > 0) {
            await User.updateOne(
                { connection_id: data.id_author },
                { $set: { popular_config: updatedConfig } }
            );
        }

        const responseData = {
            id_comment: comment.id_comment,
            id_author: comment.id_author,
            author_avatar: comment.author_avatar,
            author_name: comment.author_name,
            config_id: comment.config_id,
            text: comment.text,
            answer_count: comment.answer_count,
            likes_count: comment.likes_count,
            reply_list: [], 
            createdAt: moment(comment.createdAt).fromNow(),
            liked: false, 
        };

        return NextResponse.json(responseData);

    } catch (error) {
        console.error('Error in POST /comments:', error);
        return NextResponse.json({ status: 500, message: 'Internal Server Error' });
    }
}