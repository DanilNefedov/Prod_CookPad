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
            return NextResponse.json(
                { message: 'Invalid request data' },
                { status: 400 }
            );
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

        if (!Array.isArray(comments)) {
            return NextResponse.json(
                { message: 'Failed to fetch comments' },
                { status: 500 }
            );
        }

        const commentIds = comments.map((el) => el.id_comment);

        const likes = await LikesComments.find({
            id_comment: { $in: commentIds },
            id_author:user_id,
            is_deleted: false, 
        }).lean();

        if (!Array.isArray(likes)) {
            return NextResponse.json(
                { message: 'Failed to fetch likes' },
                { status: 500 }
            );
        }

        // Promise.all with findOne inside:
        // Makes one separate query per comment to find a user's likes.
        // That is, if there are 100 comments, there will be 100 separate queries to the database - no matter if there is a like or not.


        // find({ $in: [...] }):
        // Makes a single query that immediately looks for all the user's likes on these 100 comments.
        // Returns only the ones that have a like.
        // Even if the 100 comments only have 3 likes, it's still one query, and it's efficient.

        const likedSet = new Set(likes.map((like) => like.id_comment));

        const totalCommentsCount = await CommentPopular.countDocuments({config_id});

        if (typeof totalCommentsCount !== 'number') {
            return NextResponse.json(
                { message: 'Failed to count comments' },
                { status: 500 }
            );
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
            createdAt: dayjs(el.createdAt).fromNow()
        }));


      
        return NextResponse.json({formattedComments, page, totalCommentsCount, config_id});
        
    } catch (error) {
        console.error(error);
        return NextResponse.json(
            { message: 'Internal Server Error' },
            { status: 500 }
        );
    }
}

