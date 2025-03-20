import connectDB from "@/app/lib/mongoose";
import LikesPopular from "@/app/models/likes-popular";
import RecipePopularConfig from "@/app/models/popular-config";
import User from "@/app/models/user";
import { NextResponse } from "next/server";






export async function PATCH(request: Request) {
    try {
        const data = await request.json();
        const { config_id, liked, user_id } = data;

        if (!config_id || !user_id || liked === undefined) {
            return NextResponse.json({ status: 400, body: { message: 'Missing required fields' } });
        }

        await connectDB();

        // Fetch the popular video
        const popularData = await RecipePopularConfig.findById(config_id);
        if (!popularData) {
            return NextResponse.json({ status: 404, body: { message: 'Popular content not found' } });
        }

        // Update the popular video likes count
        const update = {
            $inc: { likes: liked ? -1 : 1 }
        };
        const result = await RecipePopularConfig.updateOne({ _id: config_id }, update);

        if (result.modifiedCount === 0) {
            return NextResponse.json({ status: 500, body: { message: 'Failed to update likes' } });
        }
        


        // Handle Liked collection
        let like_doc = await LikesPopular.findOne({ config_id:config_id, user_id });

        if (liked) {
            like_doc.is_deleted = true;
            like_doc.deletedAt = new Date(); // time for TTL
            await like_doc.save();

        } else if(!like_doc && !liked) {
            const likeData = new LikesPopular({ user_id, config_id:config_id});
            await likeData.save();
        }else if (like_doc && !liked && like_doc.is_deleted) {
            like_doc.is_deleted = false;
            like_doc.deletedAt = undefined; // remove time for TTL
            await like_doc.save();
        }


        // Fetch the user and update popular_config
        const user = await User.findOne({ connection_id: user_id });
        if (!user) {
            return NextResponse.json({ status: 404, body: { message: 'User not found' } });
        }



    } catch (error) {
        console.error(error)
        return NextResponse.json({
            status: 500,
            body: { message: 'Internal Server Error' }
        });
    }
}