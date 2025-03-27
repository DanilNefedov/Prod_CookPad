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
            return NextResponse.json({ message: 'Missing required parameters' }, { status: 400 });
        }
        
        let like_doc = await LikesReply.findOne({ id_comment, id_author }).session(session);
        
        if (!like_doc) {
            await new LikesReply({ id_comment, id_author, config_id }).save({session});
        } else if (liked && !like_doc.is_deleted) {
            like_doc.is_deleted = true;
            like_doc.deletedAt = new Date();
            await like_doc.save({session});
        } else if (!liked && like_doc.is_deleted) {
            like_doc.is_deleted = false;
            like_doc.deletedAt = undefined;
            await like_doc.save({session});
        }

        const update = { $inc: { likes_count: liked ? -1 : 1 } };
        
        await ReplyComment.updateOne({ id_comment }, update).session(session);

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
        console.error('PUT Error:', error);
        await session.abortTransaction(); 
        return NextResponse.json({ message: 'Internal Server Error', error }, { status: 500 });
    } finally {
        session.endSession(); 
    }
}



