import connectDB from "@/app/lib/mongoose";
import RecipePopularConfig from "@/app/models/popular-config";
import SavesPopular from "@/app/models/saves-popular";
import User from "@/app/models/user";
import { NextResponse } from "next/server";
import { categoryUser } from "../functions";






export async function PATCH(request: Request) {
    try {
        const { config_id, saved, user_id } = await request.json();
        if (!config_id || !user_id || typeof saved !== 'boolean') {
            return NextResponse.json({ message: 'Missing or invalid required fields' }, { status: 400 });
        }

        await connectDB();

        const popVideo = await RecipePopularConfig.findOne({ _id: config_id });
        if (!popVideo) {
            return NextResponse.json({ message: 'Popular content not found' }, { status: 404 });
        }

        const update = { $inc: { saves: saved ? -1 : 1 } };
        await RecipePopularConfig.updateOne({ _id: config_id }, update);

        
        let save_doc = await SavesPopular.findOne({ config_id, user_id });

        if (!save_doc) {
            await new SavesPopular({ user_id, config_id }).save();
        } else if (saved && !save_doc.is_deleted) {
            save_doc.is_deleted = true;
            save_doc.deletedAt = new Date(); 
            await save_doc.save();
        } else if (!saved && save_doc.is_deleted) {
            save_doc.is_deleted = false;
            save_doc.deletedAt = undefined; 
            await save_doc.save();
        }
                

        const user = await User.findOne({ connection_id: user_id });
        if (!user) {
            return NextResponse.json({ message: 'User not found' }, { status: 404 });
        }

        const updatedConfig = categoryUser(user.popular_config, saved, 1.6, popVideo.categories);
        if (updatedConfig.length > 0) {
            await User.updateOne({ connection_id: user_id }, { $set: { popular_config: updatedConfig } });
        }

        return NextResponse.json({ config_id, saved }, { status: 200 });

        
    } catch (error) {
        console.error('PATCH Error:', error);

        return NextResponse.json({
            status: 500,
            body: { message: 'Internal Server Error', error: error }
        });
    }
}
