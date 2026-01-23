import connectDB from "@/app/lib/mongoose";
import LikesReply from "@/app/models/likes-reply";
import RecipePopularConfig from "@/app/models/popular-config";
import ReplyComment from "@/app/models/reply-comments";
import { ErrorCode, ErrorResponse } from "@/app/types";
import mongoose from "mongoose";
import { NextResponse } from "next/server";








export async function PUT(request: Request) {   
    const session = await mongoose.startSession();
         
    try {
        await connectDB();
        session.startTransaction();

        const dataReq = await request.json();
        const { id_comment, id_author, config_id, reply, liked, id_branch } = dataReq;

        if (!id_comment || !id_author || !config_id) {
            await session.abortTransaction();
            const error: ErrorResponse = {
                code: ErrorCode.INVALID_INPUT,
                message: 'Invalid request data'
            };
            return NextResponse.json(error, { status: 400 });
        }

        const popVideo = await RecipePopularConfig
            .findById(config_id)
            .select('_id is_deleted')
            .setOptions({ withDeleted: true })

        if (!popVideo) {
            const error: ErrorResponse = {
                code: ErrorCode.NOT_FOUND,
                message: 'Popular content not found or was deleted'
            };
            return NextResponse.json(error, { status: 404 });
        }

        if (popVideo.is_deleted) {
            const error: ErrorResponse = {
                code: ErrorCode.DELETED,
                message: 'Recipe was deleted',
            };
            return NextResponse.json(error, { status: 410 });
        }
        
        
        const like_doc = await LikesReply.findOne({ id_comment, id_author }).session(session);
        
        if (!like_doc) {

            const newLike = await new LikesReply({ id_comment, id_author, config_id }).save({ session });
            if (!newLike) {
                await session.abortTransaction();
                const error: ErrorResponse = {
                    code: ErrorCode.SERVER_ERROR,
                    message: 'Failed to create like document'
                };
                return NextResponse.json(error, { status: 500 });
            }
        } else if (liked && !like_doc.is_deleted) {
            
            like_doc.is_deleted = true;
            like_doc.deletedAt = new Date();
            const saved = await like_doc.save({ session });
            if (!saved) {
                await session.abortTransaction();
                const error: ErrorResponse = {
                    code: ErrorCode.SERVER_ERROR,
                    message: 'Failed to soft delete like document'
                };
                return NextResponse.json(error, { status: 500 });
            }
        } else if (!liked && like_doc.is_deleted) {
            
            like_doc.is_deleted = false;
            like_doc.deletedAt = undefined;
            const saved = await like_doc.save({ session });
            if (!saved) {
                await session.abortTransaction();
                const error: ErrorResponse = {
                    code: ErrorCode.SERVER_ERROR,
                    message: 'Failed to restore like document'
                };
                return NextResponse.json(error, { status: 500 });
            }
        }

        const update = { $inc: { likes_count: liked ? -1 : 1 } };
        
        const updateReplyComment = await ReplyComment.updateOne({ id_comment }, update).session(session);

        if (updateReplyComment.modifiedCount === 0) {
            await session.abortTransaction();
            const error: ErrorResponse = {
                code: ErrorCode.SERVER_ERROR,
                message: 'Failed to update reply comment'
            };
            return NextResponse.json(error, { status: 500 });
        }

        await session.commitTransaction();
        
        return NextResponse.json({ message: 'Success', data: { 
            id_comment, 
            id_author, 
            config_id, 
            reply, 
            id_branch,
            liked: !liked 
        }  });
    } catch (error) {
        console.error(error);
        await session.abortTransaction(); 
        const errorRes: ErrorResponse = {
            code: ErrorCode.SERVER_ERROR,
            message: 'Internal Server Error'
        };
        return NextResponse.json(errorRes, { status: 500 });
    } finally {
        session.endSession(); 
    }
}



