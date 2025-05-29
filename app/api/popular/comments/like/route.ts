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
        const { id_comment, id_author, config_id, reply, liked,id_branch } = dataReq;

        if (!id_comment || !id_author || !config_id) {
            await session.abortTransaction();
            return NextResponse.json(
                { message: 'Invalid request data' },
                { status: 400 }
            );
        }

        const like_doc = await LikesComments.findOne({ id_comment, id_author }).session(session);
        
        if (!like_doc) {
            const newLike = await new LikesComments({ id_comment, id_author, config_id }).save({ session });
            
            if (!newLike) {
                await session.abortTransaction();
                return NextResponse.json(
                    { message: 'Failed to create like document' },
                    { status: 500 }
                );
            }


        } else if (liked && !like_doc.is_deleted) {
            like_doc.is_deleted = true;
            like_doc.deletedAt = new Date();
            const saved = await like_doc.save({ session });

            if (!saved) {
                await session.abortTransaction();
                return NextResponse.json(
                    { message: 'Failed to soft delete like document' },
                    { status: 500 }
                );
            }
        } else if (!liked && like_doc.is_deleted) {
            like_doc.is_deleted = false;
            like_doc.deletedAt = undefined;
            const saved = await like_doc.save({ session });

            if (!saved) {
                await session.abortTransaction();
                return NextResponse.json(
                    { message: 'Failed to restore like document' },
                    { status: 500 }
                );
            }
        }

        const update = { $inc: { likes_count: liked ? -1 : 1 } };
        const commentUpdate = await CommentPopular.updateOne({ id_comment }, update).session(session);

        if (commentUpdate.modifiedCount === 0) {
            await session.abortTransaction();
            return NextResponse.json(
                { message: 'Failed to update comment like count' },
                { status: 500 }
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

        return NextResponse.json({ message: 'Success', data: { 
            id_comment, 
            id_author, 
            config_id, 
            reply, 
            id_branch,
            liked: !liked 
        }  });
    } catch (error) {
        console.error(error);
        await session.abortTransaction(); 
        return NextResponse.json(
            { message: 'Internal Server Error' },
            { status: 500 }
        );
    } finally {
        session.endSession(); 
    }
}

