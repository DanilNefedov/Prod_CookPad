import connectDB from "@/app/lib/mongoose";
import RecipePopularConfig from "@/app/models/popular-config";
import User from "@/app/models/user";
import { NextResponse } from "next/server";
import { categoryUser } from "../../../functions";
import mongoose from "mongoose";







export async function PUT(request: Request) {
    const session = await mongoose.startSession();

    try {
        await connectDB();
        session.startTransaction();

        const { id_author, config_id, liked } = await request.json();

        if (!id_author || !config_id) {
            await session.abortTransaction();
            return NextResponse.json(
                { message: 'Invalid request data' },
                { status: 400 }
            );
        }

        const popularData = await RecipePopularConfig.findById(config_id).session(session);
        if (!popularData) {
            await session.abortTransaction();
            return NextResponse.json(
                { message: 'Popular content not found' },
                { status: 404 }
            );
        }

        const user = await User.findOne({ connection_id: id_author }).session(session);
        if (!user) {
            await session.abortTransaction();
            return NextResponse.json(
                { message: 'User information not found' },
                { status: 404 }
            );
        }


        const updatedConfig = categoryUser(user.popular_config, liked, 1.1, popularData.categories);
        if (updatedConfig.length > 0) {
            const updated = await User.updateOne(
                { connection_id: id_author },
                { $set: { popular_config: updatedConfig } },
                { session }
            );

            if (updated.modifiedCount === 0) {
                await session.abortTransaction();
                return NextResponse.json(
                    { message: 'Failed to update user config' },
                    { status: 500 }
                );
            }
        }
        await session.commitTransaction();
        return NextResponse.json({ success: true });
    } catch (err) {
        console.error(err);
        await session.abortTransaction();
        return NextResponse.json({ success: false }, { status: 500 });
    }
    finally {
        session.endSession();
    }
}
