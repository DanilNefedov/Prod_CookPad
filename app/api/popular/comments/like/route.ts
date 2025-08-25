import connectDB from "@/app/lib/mongoose";
import CommentPopular from "@/app/models/comments-popular";
import LikesComments from "@/app/models/likes-comments";
import { NextResponse } from "next/server";
import mongoose from "mongoose";




export async function PUT(request: Request) {
    const session = await mongoose.startSession();
    try {
        await connectDB();
        session.startTransaction();

        const { id_comment, id_author, liked, config_id} = await request.json();

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
        
        await session.commitTransaction();
        return NextResponse.json({ message: 'Success', data: { 
            id_comment, 
            id_author, 
            config_id, 
            liked: !liked 
        }  });

    } catch (err) {
        console.error(err);
        await session.abortTransaction();
        return NextResponse.json({ success: false }, { status: 500 });
    } finally {
        session.endSession();
    }
}



