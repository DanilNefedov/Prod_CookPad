import connectDB from "@/app/lib/mongoose";
import LikesPopular from "@/app/models/likes-popular";
import RecipePopularConfig from "@/app/models/popular-config";
import { NextResponse } from "next/server";
import mongoose from "mongoose";
import { ErrorCode, ErrorResponse } from "@/app/types";



// if startSession() is placed in try session may be undefined 
// in finally if the error occurred before startTransaction(), 
// and then calling session.endSession() will throw an error.


// OUTside the try block startSession() will throw an error 
// (which is rare), it will not be handled inside catch

// The best option is to keep startSession() BEFORE try, 
// and startTransaction() already IN. 



export async function PUT(request: Request) {
    const session = await mongoose.startSession();

    try {
        await connectDB();
        session.startTransaction();

        const { config_id, liked, user_id } = await request.json();

        if (!config_id || !user_id || typeof liked !== 'boolean') {
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
            .session(session);

        if (!popVideo) {
            await session.abortTransaction();
            const error: ErrorResponse = {
                code: ErrorCode.NOT_FOUND,
                message: 'Popular content not found or was deleted'
            };
            return NextResponse.json(error, { status: 404 });
        }

        if (popVideo.is_deleted) {
            await session.abortTransaction();
            const error: ErrorResponse = {
                code: ErrorCode.DELETED,
                message: 'Recipe was deleted',
            };
            return NextResponse.json(error, { status: 410 });
        }


        const update = { $inc: { likes: liked ? -1 : 1 } };
        const updateResult = await RecipePopularConfig.updateOne({ _id: config_id }, update, { session });

        if (updateResult.modifiedCount === 0) {
            await session.abortTransaction();
            const error: ErrorResponse = {
                code: ErrorCode.SERVER_ERROR,
                message: 'Failed to update likes',
            };
            return NextResponse.json(error, { status: 500 });
        }

        const like_doc = await LikesPopular.findOne({ config_id, user_id }).session(session);

        if (!like_doc) {
            const newLike = await new LikesPopular({ user_id, config_id }).save({ session });

            if (!newLike) {
                await session.abortTransaction();

                const error: ErrorResponse = {
                    code: ErrorCode.SERVER_ERROR,
                    message: 'Failed to create like document',
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
                    message: 'Failed to soft delete like document',
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
                    message: 'Failed to restore like document',
                };
                return NextResponse.json(error, { status: 500 });
            }
        }

        await session.commitTransaction();
        return NextResponse.json({ config_id, liked: !liked });

    } catch (error) {
        console.error(error);
        await session.abortTransaction();
        const errorRes: ErrorResponse = {
            code: ErrorCode.SERVER_ERROR,
            message: 'Internal Server Error',
        };
        return NextResponse.json(errorRes, { status: 500 });
    } finally {
        session.endSession();
    }
}






