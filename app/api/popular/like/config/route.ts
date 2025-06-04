import connectDB from "@/app/lib/mongoose";
import RecipePopularConfig from "@/app/models/popular-config";
import User from "@/app/models/user";
import { NextResponse } from "next/server";
import { categoryUser } from "../../functions";
import mongoose from "mongoose";






export async function PUT(request: Request) {
    const session = await mongoose.startSession();

    try {
        await connectDB();
        session.startTransaction();

        const { config_id, liked, user_id } = await request.json();
        if (!config_id || !user_id || typeof liked !== 'boolean') {
            await session.abortTransaction();
            return NextResponse.json({ message: 'Invalid request data' }, { status: 400 });
        }

        const popularData = await RecipePopularConfig.findById(config_id);
        if (!popularData) {
            await session.abortTransaction();
            return NextResponse.json({ message: 'Popular config not found' }, { status: 404 });
        }

        const user = await User.findOne({ connection_id: user_id });
        if (!user) {
            await session.abortTransaction();
            return NextResponse.json({ message: 'User not found' }, { status: 404 });
        }

        const updatedConfig = categoryUser(user.popular_config, liked, 2, popularData.categories);
        if (updatedConfig.length > 0) {
            const updateUserResult = await User.updateOne(
                { connection_id: user_id },
                { $set: { popular_config: updatedConfig } }
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
