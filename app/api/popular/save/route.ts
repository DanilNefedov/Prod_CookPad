import connectDB from "@/app/lib/mongoose";
import RecipePopularConfig from "@/app/models/popular-config";
import SavesPopular from "@/app/models/saves-popular";
import User from "@/app/models/user";
import { NextResponse } from "next/server";
import { categoryUser } from "../functions";
import mongoose from "mongoose";




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
            return NextResponse.json({ message: 'Missing or invalid required fields' }, { status: 400 });
        }

        const popVideo = await RecipePopularConfig.findOne({ _id: config_id }).session(session);
        if (!popVideo) {
            return NextResponse.json({ message: 'Popular content not found' }, { status: 404 });
        }

        const update = { $inc: { saves: saved ? -1 : 1 } };
        const updateResult = await RecipePopularConfig.updateOne({ _id: config_id }, update, { session });

        if (updateResult.modifiedCount === 0) {
            return NextResponse.json({ message: 'Failed to update saves' }, { status: 500 });
        }

        const save_doc = await SavesPopular.findOne({ config_id, user_id }).session(session);

        if (!save_doc) {
            await new SavesPopular({ user_id, config_id }).save({ session });
        } else if (saved && !save_doc.is_deleted) {
            save_doc.is_deleted = true;
            save_doc.deletedAt = new Date();
            await save_doc.save({ session });
        } else if (!saved && save_doc.is_deleted) {
            save_doc.is_deleted = false;
            save_doc.deletedAt = undefined;
            await save_doc.save({ session });
        }


        const user = await User.findOne({ connection_id: user_id }).session(session);
        if (!user) {
            return NextResponse.json({ message: 'User not found' }, { status: 404 });
        }

        const updatedConfig = categoryUser(user.popular_config, saved, 1.6, popVideo.categories);
        if (updatedConfig.length > 0) {
            const updateUserResult = await User.updateOne(
                { connection_id: user_id },
                { $set: { popular_config: updatedConfig } },
                { session }
            );

            if (updateUserResult.modifiedCount === 0) {
                return NextResponse.json({ message: 'Failed to update user' }, { status: 500 });
            }
        }

        await session.commitTransaction(); 
        return NextResponse.json({ config_id, saved }, { status: 200 });

    } catch (error) {
        console.error('PUT Error:', error);
        await session.abortTransaction(); 
        return NextResponse.json({ message: 'Internal Server Error', error }, { status: 500 });

    } finally {
        session.endSession(); 
    }
}
