import { NextResponse } from 'next/server';
import mongoose from 'mongoose';
import connectDB from '@/app/lib/mongoose';
import ReplyComment from '@/app/models/reply-comments';
import RecipePopularConfig from '@/app/models/popular-config';
import CommentPopular from '@/app/models/comments-popular';
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import _ from 'lodash';
import updateLocale from 'dayjs/plugin/updateLocale'
import { ErrorCode, ErrorResponse } from '@/app/types';




export async function POST(request: Request) {
    const session = await mongoose.startSession(); 
    try {
        await connectDB();
        session.startTransaction();

        const dataReq = await request.json();
        const { data, config_id } = dataReq;

        if(!data || !config_id){
            await session.abortTransaction();
            const error: ErrorResponse = {
                code: ErrorCode.INVALID_INPUT,
                message: 'Invalid request data'
            };
            return NextResponse.json(error, { status: 400 });
        }

        const popVideo = await RecipePopularConfig
            .findById(config_id)
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

        const comment = new ReplyComment(data);
        await comment.save({ session }); 

        await RecipePopularConfig.findByIdAndUpdate(
            data.config_id,
            { $inc: { comments: 1 } },
            { session }
        );

        const updatedParentComm = await CommentPopular.findOneAndUpdate(
            { id_comment: data.id_branch },
            { $inc: { reply_count: 1 } },
            { new: true, session } 
        );


        if (!updatedParentComm) {
            await session.abortTransaction();
            const error: ErrorResponse = {
                code: ErrorCode.SERVER_ERROR,
                message: 'Parent comment not found'
            };
            return NextResponse.json(error, { status: 404 });
        }

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

        const responseData = _.cloneDeep(data);
        responseData.liked = false;
        responseData.createdAt = dayjs(responseData.createdAt).fromNow()


        await session.commitTransaction(); 

        
        return NextResponse.json({data:responseData, config_id});
    } catch (error) {
        console.log(error)
        await session.abortTransaction(); 
        const errorRes: ErrorResponse = {
            code: ErrorCode.SERVER_ERROR,
            message: 'Internal Server Error'
        };
        return NextResponse.json(errorRes, { status: 500 });
    } finally {
        session.endSession();
    }
}




