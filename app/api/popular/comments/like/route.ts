import connectDB from "@/app/lib/mongoose";
import CommentPopular from "@/app/models/comments-popular";
import LikesComments from "@/app/models/likes-comments";
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

        const dataReq = await request.json();
        const { id_comment, id_author, config_id, reply, liked } = dataReq;

        if (!id_comment || !id_author || !config_id) {
            return NextResponse.json({ message: 'Missing required parameters' }, { status: 400 });
        }

        let like_doc = await LikesComments.findOne({ id_comment, id_author }).session(session);
        
        if (!like_doc) {
            await new LikesComments({ id_comment, id_author, config_id }).save({ session });
        } else if (liked && !like_doc.is_deleted) {
            like_doc.is_deleted = true;
            like_doc.deletedAt = new Date();
            await like_doc.save({ session });
        } else if (!liked && like_doc.is_deleted) {
            like_doc.is_deleted = false;
            like_doc.deletedAt = undefined;
            await like_doc.save({ session });
        }

        const update = { $inc: { likes_count: liked ? -1 : 1 } };
        
        if (reply) {
            // await ReplyComment.updateOne({ id_comment }, update).session(session);
        } else {
            await CommentPopular.updateOne({ id_comment }, update).session(session);
        }

        if (!reply) {
            const popularData = await RecipePopularConfig.findById(config_id).session(session);
            if (!popularData) {
                return NextResponse.json({ message: 'Popular content not found' }, { status: 404 });
            }

            const user = await User.findOne({ connection_id: id_author }).session(session);
            if (!user) {
                return NextResponse.json({ message: 'User information not found' }, { status: 404 });
            }

            const updatedConfig = categoryUser(user.popular_config, liked, 1.1, popularData.categories);
            if (updatedConfig.length > 0) {
                await User.updateOne(
                    { connection_id: id_author },
                    { $set: { popular_config: updatedConfig } },
                    { session }
                );
            }
        }

        await session.commitTransaction(); 

        return NextResponse.json({ message: 'Success', data: { 
            id_comment, 
            id_author, 
            config_id, 
            reply, 
            liked: !liked 
        }  });
    } catch (error) {
        console.error('PUT Error:', error);
        await session.abortTransaction(); 
        return NextResponse.json({ message: 'Internal Server Error', error }, { status: 500 });
    } finally {
        session.endSession(); 
    }
}

