import { NextResponse } from 'next/server';
import connectDB from '@/app/lib/mongoose';
import ReplyComment from '@/app/models/reply-comments';
import LikesReply from '@/app/models/likes-reply';
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import updateLocale from 'dayjs/plugin/updateLocale'











export async function POST(request: Request) {
    try {
        // const page = parseInt(searchParams.get("page") || "1", 10);

        const { id_comment, page, id_author, newReply } = await request.json();

        if (!id_comment || !id_author) {
            throw new Error('Missing required query parameters');
        }

        const pageSize = 4;
        const skip = (page - 1) * pageSize;


        await connectDB();

        const comments = await ReplyComment.find({ id_branch: id_comment, id_comment: { $nin: newReply }  })
        .sort({ createdAt: 1 }) 
        .skip(skip) 
        .limit(pageSize) 
        .lean();

        const totalCommentsCount = await ReplyComment.countDocuments({ id_branch: id_comment });


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
        console.log('formattedRepliesformattedRepliesformattedRepliesformattedReplies')
        const formattedComments = await Promise.all(
            comments.map(async (el) => {
                const timeAgo = dayjs(el.createdAt).fromNow();

                const liked = !!(await LikesReply.findOne({
                    id_comment: el.id_comment,
                    id_author,
                    is_deleted: false, 
                }));
                

                return {
                    id_comment: el.id_comment,
                    id_author: el.id_author,
                    id_branch: el.id_branch,
                    author_avatar: el.author_avatar,
                    author_name: el.author_name,
                    id_parent: el.id_parent,
                    name_parent: el.name_parent,
                    liked: liked,
                    likes_count: el.likes_count,
                    text: el.text,
                    createdAt: timeAgo,
                };
            })
        );

        return NextResponse.json({formattedComments, page, totalCommentsCount});
    } catch (error) {
        return NextResponse.json({
            status: 500,
            error: { message: 'Internal Server Error', details: error },
        });
    }
}
