import { NextResponse } from 'next/server';
import connectDB from '@/app/lib/mongoose';
import ReplyComment from '@/app/models/reply-comments';
import LikesReply from '@/app/models/likes-reply';
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import updateLocale from 'dayjs/plugin/updateLocale'











export async function POST(request: Request) {
    try {

        const { id_comment, page, id_author, newReply } = await request.json();

        if (!id_comment || !id_author) {
            return NextResponse.json(
                { message: 'Invalid request data' },
                { status: 400 }
            );
        }

        const pageSize = 4;
        const skip = (page - 1) * pageSize;


        await connectDB();

        const comments = await ReplyComment.find({ id_branch: id_comment, id_comment: { $nin: newReply }  })
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

        const totalCommentsCount = await ReplyComment.countDocuments({ id_branch: id_comment });

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



        // Promise.all with findOne inside:
        // Makes one separate query per comment to find a user's likes.
        // That is, if there are 100 comments, there will be 100 separate queries to the database - no matter if there is a like or not.


        // find({ $in: [...] }):
        // Makes a single query that immediately looks for all the user's likes on these 100 comments.
        // Returns only the ones that have a like.
        // Even if the 100 comments only have 3 likes, it's still one query, and it's efficient.



        const commentIds = comments.map(comment => comment.id_comment);

        const userLikes = await LikesReply.find({
            id_comment: { $in: commentIds },
            id_author,
            is_deleted: false
        }).lean();

        const likedCommentIds = new Set(userLikes.map(like => like.id_comment));

        const formattedComments = comments.map(el => {
            const timeAgo = dayjs(el.createdAt).fromNow();
            const liked = likedCommentIds.has(el.id_comment);

            return {
                id_comment: el.id_comment,
                id_author: el.id_author,
                id_branch: el.id_branch,
                author_avatar: el.author_avatar,
                author_name: el.author_name,
                id_parent: el.id_parent,
                name_parent: el.name_parent,
                liked,
                likes_count: el.likes_count,
                text: el.text,
                createdAt: timeAgo,
            };
        });

        return NextResponse.json({formattedComments, page, totalCommentsCount});
    } catch (error) {
        console.error(error);
        return NextResponse.json(
            { message: 'Internal Server Error' },
            { status: 500 }
        );
    }
}
