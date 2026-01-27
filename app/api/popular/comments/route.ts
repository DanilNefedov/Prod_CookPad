import connectDB from "@/app/lib/mongoose";
import CommentPopular from "@/app/models/comments-popular";
import RecipePopularConfig from "@/app/models/popular-config";
import { NextResponse } from "next/server";
import mongoose from "mongoose";
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import updateLocale from 'dayjs/plugin/updateLocale'
import { ErrorCode, ErrorResponse } from "@/app/types";





export async function POST(request: Request) {
    const session = await mongoose.startSession();

    try {
        await connectDB();
        session.startTransaction();

        const data = await request.json();

        if (!data || !data.config_id || !data.id_author) {
            await session.abortTransaction();
            const error: ErrorResponse = {
                code: ErrorCode.INVALID_INPUT,
                message: 'Invalid request data'
            };
            return NextResponse.json(error, { status: 400 });
        }
        
        const popVideo = await RecipePopularConfig
            .findById(data.config_id)
            .select('_id is_deleted')
            .setOptions({ withDeleted: true })

        if (!popVideo) {
            const error: ErrorResponse = {
                code: ErrorCode.NOT_FOUND,
                message: 'Popular content not found or was deleted'
            };
            return NextResponse.json(error, { status: 404 });
        }

        if (popVideo.is_deleted) {
            const error: ErrorResponse = {
                code: ErrorCode.DELETED,
                message: 'Recipe was deleted',
            };
            return NextResponse.json(error, { status: 410 });
        }

        const comment = await new CommentPopular(data).save({ session });

        await RecipePopularConfig.findByIdAndUpdate(
            data.config_id,
            { $inc: { comments: 1 } },
            { session }
        );

        await session.commitTransaction();

        await session.commitTransaction(); 
        dayjs.extend(relativeTime)
        dayjs.extend(updateLocale)
        dayjs.updateLocale('en', {
            relativeTime: {
                future: 'in %s',
                past: '%s',
                s: '1 s.',    
                m: '1 m.',    
                mm: '%d m.',  
                h: '1 h.',    
                hh: '%d h.',  
                d: '1 d.',    
                dd: '%d d.',  
                M: '1 mo.',   
                MM: '%d mo.', 
                y: '1 y.',    
                yy: '%d y.',  
            },
        })

        const responseData = {
            id_comment: comment.id_comment,
            id_author: comment.id_author,
            author_avatar: comment.author_avatar,
            author_name: comment.author_name,
            config_id: comment.config_id,
            text: comment.text,
            reply_count: comment.reply_count,
            likes_count: comment.likes_count,
            // reply_list: [], 
            createdAt: dayjs(comment.createdAt).fromNow(),
            liked: false, 
        };

        return NextResponse.json({ responseData, config_id: data.config_id });
    } catch (error) {
        await session.abortTransaction();
        console.error(error);
        const errorRes: ErrorResponse = {
            code: ErrorCode.SERVER_ERROR,
            message: 'Internal Server Error'
        };
        return NextResponse.json(errorRes, { status: 500 });
    } finally {
        session.endSession();
    }
}

