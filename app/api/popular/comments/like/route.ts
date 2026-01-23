import connectDB from "@/app/lib/mongoose";
import CommentPopular from "@/app/models/comments-popular";
import LikesComments from "@/app/models/likes-comments";
import { NextResponse } from "next/server";
import mongoose from "mongoose";
import RecipePopularConfig from "@/app/models/popular-config";
import { ErrorCode, ErrorResponse } from "@/app/types";




export async function PUT(request: Request) {
    const session = await mongoose.startSession();
    try {
        await connectDB();
        session.startTransaction();

        const { id_comment, id_author, liked, config_id} = await request.json();

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

        const like_doc = await LikesComments.findOne({ id_comment, id_author }).session(session);
        
        if (!like_doc) {
            const newLike = await new LikesComments({ id_comment, id_author, config_id }).save({ session });
            
            if (!newLike) {
                await session.abortTransaction();
                return NextResponse.json(
                    { message: 'Failed to create like document' },
                    { status: 500 }
                );
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

        const commentUpdate = await CommentPopular.updateOne({ id_comment }, update).session(session);

        if (commentUpdate.modifiedCount === 0) {
            await session.abortTransaction();
            const error: ErrorResponse = {
                code: ErrorCode.SERVER_ERROR,
                message: 'Failed to update comment like count'
            };
            return NextResponse.json(error, { status: 500 });
        }
        
        await session.commitTransaction();
        return NextResponse.json({ message: 'Success', data: { 
            id_comment, 
            id_author, 
            config_id, 
            liked: !liked 
        }  });

    } catch (err) {
        console.error(err);
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



