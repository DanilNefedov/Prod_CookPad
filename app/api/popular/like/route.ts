import connectDB from "@/app/lib/mongoose";
import LikesPopular from "@/app/models/likes-popular";
import RecipePopularConfig from "@/app/models/popular-config";
import User from "@/app/models/user";
import { NextResponse } from "next/server";
import { categoryUser } from "../functions";






export async function PATCH(request: Request) {
    try {
        const data = await request.json();
        const { config_id, liked, user_id } = data;

        if (!config_id || !user_id || typeof liked !== 'boolean') {
            return NextResponse.json({ message: 'Missing or invalid required fields' }, { status: 400 });
        }

        await connectDB();

        const popularData = await RecipePopularConfig.findById(config_id);
        if (!popularData) {
            return NextResponse.json({ message: 'Popular content not found' }, { status: 404 });
        }
      
        const update = { $inc: { likes: liked ? -1 : 1 } };
        const updateResult = await RecipePopularConfig.updateOne({ _id: config_id }, update);

        if (updateResult.modifiedCount === 0) {
            return NextResponse.json({ message: 'Failed to update likes' }, { status: 500 });
        }

        

        //Handle Liked collection
        let like_doc = await LikesPopular.findOne({ config_id, user_id });

        if (!like_doc) {
            await new LikesPopular({ user_id, config_id }).save();
        } else if (liked && !like_doc.is_deleted) {
            like_doc.is_deleted = true;
            like_doc.deletedAt = new Date(); 
            await like_doc.save();
        } else if (!liked && like_doc.is_deleted) {
            like_doc.is_deleted = false;
            like_doc.deletedAt = undefined; 
            await like_doc.save();
        }
        



        const user = await User.findOne({ connection_id: user_id });
        if (!user) {
            return NextResponse.json({ message: 'User not found' }, { status: 404 });
        }

        const updatedConfig = categoryUser(user.popular_config, liked, 2, popularData.categories);

        if (updatedConfig.length > 0) {
            const updateUserResult = await User.updateOne(
                { connection_id: user_id },
                { $set: { popular_config: updatedConfig } }
            );

            if (updateUserResult.modifiedCount === 0) {
                return NextResponse.json({ message: 'Failed to update user' }, { status: 500 });
            }
        }
        

        return NextResponse.json({ config_id, liked }, { status: 200 });
        
    } catch (error) {
        console.error('PATCH Error:', error);
        return NextResponse.json({
            status: 500,
            body: { message: 'Internal Server Error' }
        });
    }
}