import connectDB from "@/app/lib/mongoose";
import LikesPopular from "@/app/models/likes-popular";
import RecipePopularConfig from "@/app/models/popular-config";
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

        const data = await request.json();
        const { config_id, liked, user_id } = data;

        if (!config_id || !user_id || typeof liked !== 'boolean') {
            // await session.abortTransaction();
            return NextResponse.json({ message: 'Missing or invalid required fields' }, { status: 400 });
        }

        const popularData = await RecipePopularConfig.findById(config_id).session(session);
        if (!popularData) {
            // await session.abortTransaction();
            return NextResponse.json({ message: 'Popular content not found' }, { status: 404 });
        }

        const update = { $inc: { likes: liked ? -1 : 1 } };
        const updateResult = await RecipePopularConfig.updateOne({ _id: config_id }, update, { session });

        if (updateResult.modifiedCount === 0) {
            // await session.abortTransaction();
            return NextResponse.json({ message: 'Failed to update likes' }, { status: 500 });
        }

        const like_doc = await LikesPopular.findOne({ config_id, user_id }).session(session);

        if (!like_doc) {
            await new LikesPopular({ user_id, config_id }).save({ session });
        } else if (liked && !like_doc.is_deleted) {
            like_doc.is_deleted = true;
            like_doc.deletedAt = new Date();
            await like_doc.save({ session });
        } else if (!liked && like_doc.is_deleted) {
            like_doc.is_deleted = false;
            like_doc.deletedAt = undefined;
            await like_doc.save({ session });
        }

        const user = await User.findOne({ connection_id: user_id }).session(session);
        if (!user) {
            // await session.abortTransaction();
            return NextResponse.json({ message: 'User not found' }, { status: 404 });
        }

        const updatedConfig = categoryUser(user.popular_config, liked, 2, popularData.categories);
        if (updatedConfig.length > 0) {
            const updateUserResult = await User.updateOne(
                { connection_id: user_id },
                { $set: { popular_config: updatedConfig } },
                { session }
            );

            if (updateUserResult.modifiedCount === 0) {
                // await session.abortTransaction();
                return NextResponse.json({ message: 'Failed to update user' }, { status: 500 });
            }
        }

        await session.commitTransaction(); 
        return NextResponse.json({ config_id, liked }, { status: 200 });

    } catch (error) {
        console.error('PATCH Error:', error);
        await session.abortTransaction();
        return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });

    } finally {
        session.endSession(); 
    }
}

