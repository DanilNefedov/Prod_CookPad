import connectDB from "@/app/lib/mongoose";
import RecipePopularConfig from "@/app/models/popular-config";
import SavesPopular from "@/app/models/saves-popular";
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
        
        const { config_id, saved, user_id } = await request.json();

        if (!config_id || !user_id || typeof saved !== 'boolean') {
            await session.abortTransaction();

            const error: ErrorResponse = {
                code: ErrorCode.INVALID_INPUT,
                message: 'Invalid request data'
            };
            return NextResponse.json(error, { status: 404 });
        }

        const error: ErrorResponse = {
                        code: ErrorCode.NOT_FOUND,
                        message: 'Popular content not found or was deleted'
                    };
                    return NextResponse.json(error, { status: 404 });
        

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

        const update = { $inc: { saves: saved ? -1 : 1 } };
        const updateResult = await RecipePopularConfig.updateOne({ _id: config_id }, update, { session });

        if (updateResult.modifiedCount === 0) {
            await session.abortTransaction();
            const error: ErrorResponse = {
                code: ErrorCode.SERVER_ERROR,
                message: 'Failed to update saves',
            };
            return NextResponse.json(error, { status: 500 });
        }

        const save_doc = await SavesPopular.findOne({ config_id, user_id }).session(session);

        if (!save_doc) {

            const newSave = await new SavesPopular({ user_id, config_id }).save({ session });
            if (!newSave) {
                await session.abortTransaction();

                const error: ErrorResponse = {
                    code: ErrorCode.SERVER_ERROR,
                    message: 'Failed to create save document',
                };
                return NextResponse.json(error, { status: 500 });
            }
        } else if (saved && !save_doc.is_deleted) {

            save_doc.is_deleted = true;
            save_doc.deletedAt = new Date();
            const savedDoc = await save_doc.save({ session });
            if (!savedDoc) {
                await session.abortTransaction();

                const error: ErrorResponse = {
                    code: ErrorCode.SERVER_ERROR,
                    message: 'Failed to soft delete save document',
                };
                return NextResponse.json(error, { status: 500 });
            }
        } else if (!saved && save_doc.is_deleted) {

            save_doc.is_deleted = false;
            save_doc.deletedAt = undefined;
            const savedDoc = await save_doc.save({ session });
            if (!savedDoc) {
                await session.abortTransaction();

                const error: ErrorResponse = {
                    code: ErrorCode.SERVER_ERROR,
                    message: 'Failed to restore save document',
                };
                return NextResponse.json(error, { status: 500 });
            }
        }


        await session.commitTransaction();
        return NextResponse.json({ config_id, saved: !saved });

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


