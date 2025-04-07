import { NextResponse } from 'next/server';
import { cloneDeep } from 'lodash';
import mongoose from 'mongoose';
import connectDB from '@/app/lib/mongoose';
import ReplyComment from '@/app/models/reply-comments';
import RecipePopularConfig from '@/app/models/popular-config';
import CommentPopular from '@/app/models/comments-popular';
import LikesReply from '@/app/models/likes-reply';
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'





export async function POST(request: Request) {
    const session = await mongoose.startSession(); 
    try {
        await connectDB();
        session.startTransaction();

        const dataReq = await request.json();
        const { data, config_id } = dataReq;

        
        const comment = new ReplyComment(data);
        const res = await comment.save({ session }); 

        const updatedPopularT = await RecipePopularConfig.findOne({_id: config_id})
        console.log(res, updatedPopularT, config_id)

        const updatedPopular = await RecipePopularConfig.findOneAndUpdate(
            { _id: config_id },
            { $inc: { comments: 1 } },
            { new: true, session }
        );

        if (!updatedPopular) {
            throw new Error('Popular document not found');
        }

        const updatedParentComm = await CommentPopular.findOneAndUpdate(
            { id_comment: data.id_branch },
            { $inc: { reply_count: 1 } },
            { new: true, session } 
        );

        if (!updatedParentComm) {
            throw new Error('Parent comment not found');
        }

        
        dayjs.extend(relativeTime)

        const responseData = cloneDeep(data);
        const timeAgo = dayjs(responseData.createdAt).fromNow();


        responseData.liked = false;
        responseData.createdAt = timeAgo;


        await session.commitTransaction(); 


        return NextResponse.json(responseData);
    } catch (error) {
        await session.abortTransaction(); 
        
        return NextResponse.json({
            status: 500,
            body: {
                message: 'Internal Server Error',
                error: error,
            },
        });
    } finally {
        session.endSession();
    }
}






// export async function GET(request: Request) {
//     try {
//         const { searchParams } = new URL(request.url);
//         const id_comment = searchParams.get('id_comment');
//         const page = parseInt(searchParams.get("page") || "1", 10);
//         const id_author = searchParams.get('id_author');

//         if (!id_comment || !id_author) {
//             throw new Error('Missing required query parameters');
//         }

//         const pageSize = 4;
//         const skip = (page - 1) * pageSize;

//         await connectDB();

//         const comments = await ReplyComment.find({ id_branch: id_comment })
//         .sort({ createdAt: 1 }) 
//         .skip(skip) 
//         .limit(pageSize) 
//         .lean();

//         const totalCommentsCount = await ReplyComment.countDocuments({ id_branch: id_comment });


//         dayjs.extend(relativeTime)
        
//         const formattedComments = await Promise.all(
//             comments.map(async (el) => {
//                 const timeAgo = dayjs(el.createdAt).fromNow();

//                 const liked = !!(await LikesReply.findOne({
//                     id_comment: el.id_comment,
//                     id_author,
//                     is_deleted: false, 
//                 }));
                

//                 return {
//                     id_comment: el.id_comment,
//                     id_author: el.id_author,
//                     id_branch: el.id_branch,
//                     author_avatar: el.author_avatar,
//                     author_name: el.author_name,
//                     id_parent: el.id_parent,
//                     name_parent: el.name_parent,
//                     liked: liked,
//                     likes_count: el.likes_count,
//                     text: el.text,
//                     createdAt: timeAgo,
//                 };
//             })
//         );

//         return NextResponse.json({formattedComments, page, totalCommentsCount});
//     } catch (error) {
//         return NextResponse.json({
//             status: 500,
//             error: { message: 'Internal Server Error', details: error },
//         });
//     }
// }
