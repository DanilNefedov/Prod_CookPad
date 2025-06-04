import connectDB from "@/app/lib/mongoose";
import RecipePopularConfig from "@/app/models/popular-config";
import User from "@/app/models/user";
import mongoose from "mongoose";
import { NextResponse } from "next/server";
import { categoryUser } from "../../functions";









export async function PUT(request: Request) {
    const session = await mongoose.startSession();

    try {
        await connectDB();
        session.startTransaction();

        const { config_id, saved, user_id } = await request.json();
        if (!config_id || !user_id || typeof saved !== 'boolean') {
            await session.abortTransaction();
            return NextResponse.json({ message: 'Invalid request data' }, { status: 400 });
        }

        const user = await User.findOne({ connection_id: user_id }).session(session);
        if (!user) {
            await session.abortTransaction();
            return NextResponse.json({ message: 'User not found' }, { status: 404 });
        }

        const popVideo = await RecipePopularConfig.findById(config_id).session(session);
        if (!popVideo) {
            await session.abortTransaction();
            return NextResponse.json({ message: 'Popular content not found' }, { status: 404 });
        }

        const updatedConfig = categoryUser(user.popular_config, saved, 1.6, popVideo.categories);
        if (updatedConfig.length > 0) {
            const updateUserResult = await User.updateOne(
                { connection_id: user_id },
                { $set: { popular_config: updatedConfig } },
                { session }
            );

            if (updateUserResult.modifiedCount === 0) {
                await session.abortTransaction();
                return NextResponse.json({ message: 'Failed to update user' }, { status: 500 });
            }
        }

        await session.commitTransaction();
        return NextResponse.json({ message: 'User config updated' });

    } catch (error) {
        console.error(error);
        await session.abortTransaction();
        return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
    } finally {
        session.endSession();
    }
}