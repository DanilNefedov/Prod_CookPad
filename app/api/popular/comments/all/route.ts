import connectDB from "@/app/lib/mongoose";
import CommentPopular from "@/app/models/comments-popular";
import LikesComments from "@/app/models/likes-comments";
import { NextResponse } from "next/server";
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import updateLocale from 'dayjs/plugin/updateLocale'









export async function POST(request: Request) {
    try {

        const { config_id, user_id, page, newComments } = await request.json();


        if (!config_id || !user_id || !page) {
            return NextResponse.json({ status: 400, message: 'Missing parameters' });
        }

        const pageSize = 5;
        const skip = (page - 1) * pageSize;

      

        await connectDB();

        const comments = await CommentPopular.find({ 
            config_id, 
            id_comment: { $nin: newComments } 
        })
            .sort({ createdAt: 1 }) 
            .skip(skip) 
            .limit(pageSize) 
            .lean();


        const commentIds = comments.map((el) => el.id_comment);

        const likes = await LikesComments.find({
            id_comment: { $in: commentIds },
            id_author:user_id,
            is_deleted: false, 
        }).lean();

        const likedSet = new Set(likes.map((like) => like.id_comment));

        const totalCommentsCount = await CommentPopular.countDocuments({config_id});
        // const isLastPage = skip + comments.length >= totalCommentsCount;
        // const nextPage = isLastPage ? NaN : page + 1;

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
          
        
        const formattedComments = comments.map((el) => ({
            id_comment: el.id_comment,
            id_author: el.id_author,
            author_avatar: el.author_avatar,
            author_name: el.author_name,
            config_id: el.config_id, // before el.id_video)| can be misstake
            text: el.text,
            liked: likedSet.has(el.id_comment), 
            reply_count: el.reply_count,
            likes_count: el.likes_count,
            // reply_list: [],
            createdAt: dayjs(el.createdAt).fromNow()
        }));

        // const formattedComments = comments.reduce<Record<string, CommListData>>((acc, el) => {
        //     const formattedComment = {
        //         id_comment: el.id_comment,
        //         id_author: el.id_author,
        //         author_avatar: el.author_avatar,
        //         author_name: el.author_name,
        //         config_id: el.config_id,  // before el.id_video)| can be misstake
        //         text: el.text,
        //         liked: likedSet.has(el.id_comment),
        //         reply_count: el.answer_count,  
        //         likes_count: el.likes_count,
        //         createdAt: moment(el.createdAt).fromNow(),
        //     };
        
        //     acc[el.id_comment] = formattedComment;
        
        //     return acc;
        // }, {});
        console.log('formattedCommentsformattedCommentsformattedCommentsformattedComments',formattedComments)
      
        return NextResponse.json({formattedComments, page, totalCommentsCount, config_id});
        
    } catch (error) {
        console.error('Error fetching comments:', error);
        return NextResponse.json({
            status: 500,
            body: { message: 'Internal Server Error', error: error },
        });
    }
}

