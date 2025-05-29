import connectDB from "@/app/lib/mongoose";
import LikesReply from "@/app/models/likes-reply";
import ReplyComment from "@/app/models/reply-comments";
import mongoose from "mongoose";
import { NextResponse } from "next/server";








export async function PUT(request: Request) {   
    const session = await mongoose.startSession();
         
    try {
        await connectDB();
        session.startTransaction();

        const dataReq = await request.json();
        const { id_comment, id_author, config_id, reply, liked, id_branch } = dataReq;

        if (!id_comment || !id_author || !config_id) {
            await session.abortTransaction();
            return NextResponse.json(
                { message: 'Invalid request data' },
                { status: 400 }
            );
        }
        
        const like_doc = await LikesReply.findOne({ id_comment, id_author }).session(session);
        
        if (!like_doc) {

            const newLike = await new LikesReply({ id_comment, id_author, config_id }).save({ session });
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
        
        const updateReplyComment = await ReplyComment.updateOne({ id_comment }, update).session(session);

        if (updateReplyComment.modifiedCount === 0) {
            await session.abortTransaction();
            return NextResponse.json({ message: 'Failed to update reply comment' }, { status: 500 });
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



