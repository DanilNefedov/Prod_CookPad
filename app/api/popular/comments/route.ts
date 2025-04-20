import connectDB from "@/app/lib/mongoose";
import CommentPopular from "@/app/models/comments-popular";
import RecipePopularConfig from "@/app/models/popular-config";
import User from "@/app/models/user";
import { NextResponse } from "next/server";
import { categoryUser } from "../functions";
import mongoose from "mongoose";
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import updateLocale from 'dayjs/plugin/updateLocale'





export async function POST(request: Request) {
    const session = await mongoose.startSession();
    

    try {
        await connectDB();
        session.startTransaction();

        const data = await request.json();
        console.log('datadatadatadatadatadatadatadatadatadatadatadatadatadatadatadata',data)
        if (!data || !data.config_id || !data.id_author) {
            return NextResponse.json({ status: 400, message: 'Missing required fields' });
        }

        const comment = await new CommentPopular(data).save({ session });

        const updatedPopular = await RecipePopularConfig.findOneAndUpdate(
            { _id: data.config_id },
            { $inc: { comments: 1 } },
            { new: true, lean: true, session }
        ).select('-_id -__v') as { categories?: string[] } | null;

        if (!updatedPopular || updatedPopular.categories === undefined) {
            return NextResponse.json({ status: 404, message: 'Popular config not found' });
        }

        const user = await User.findOne({ connection_id: data.id_author }).session(session);

        if (!user) {
            return NextResponse.json({ status: 404, message: 'User not found' });
        }

        const updatedConfig = categoryUser(user.popular_config, data.comment, 1.2, updatedPopular.categories);
        if (updatedConfig.length > 0) {
            await User.updateOne(
                { connection_id: data.id_author },
                { $set: { popular_config: updatedConfig } },
                { session }
            );
        }

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

        return NextResponse.json({responseData, config_id:data.config_id});
    } catch (error) {
        await session.abortTransaction(); 
        console.error('Error in POST /comments:', error);
        return NextResponse.json({ status: 500, message: 'Internal Server Error' });
    }finally {
        session.endSession(); 
    }
}



