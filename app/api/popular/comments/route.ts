import connectDB from "@/app/lib/mongoose";
import CommentPopular from "@/app/models/comments-popular";
import RecipePopularConfig from "@/app/models/popular-config";
import { NextResponse } from "next/server";
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

        if (!data || !data.config_id || !data.id_author) {
            await session.abortTransaction();
            return NextResponse.json({ message: "Invalid request data" }, { status: 400 });
        }

        const comment = await new CommentPopular(data).save({ session });

        const updatedPopular = await RecipePopularConfig.findOneAndUpdate(
            { _id: data.config_id },
            { $inc: { comments: 1 } },
            { new: true, lean: true, session }
        ).select("-_id -__v");

        if (!updatedPopular) {
            await session.abortTransaction();
            return NextResponse.json({ message: "Popular config not found" }, { status: 404 });
        }

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
        if (session.inTransaction()) {
            await session.abortTransaction();
        }
        console.error(error);
        return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
    } finally {
        session.endSession();
    }
}



// export async function POST(request: Request) {
//     const session = await mongoose.startSession();
    

//     try {
//         await connectDB();
//         session.startTransaction();

//         const data = await request.json();

//         if (!data || !data.config_id || !data.id_author) {
//             await session.abortTransaction();
//             return NextResponse.json(
//                 { message: 'Invalid request data' },
//                 { status: 400 }
//             );
//         }

//         const comment = await new CommentPopular(data).save({ session });

//         const updatedPopular = await RecipePopularConfig.findOneAndUpdate(
//             { _id: data.config_id },
//             { $inc: { comments: 1 } },
//             { new: true, lean: true, session }
//         ).select('-_id -__v') as { categories?: string[] } | null;

//         if (!updatedPopular || updatedPopular.categories === undefined) {
//             await session.abortTransaction();
//             return NextResponse.json(
//                 { message: 'Popular config not found' },
//                 { status: 404 }
//             );
//         }

//         const user = await User.findOne({ connection_id: data.id_author }).session(session);

//         if (!user) {
//             await session.abortTransaction();
//             return NextResponse.json(
//                 { message: 'User not found' },
//                 { status: 404 }
//             );
//         }

//         const updatedConfig = categoryUser(user.popular_config, data.comment, 1.2, updatedPopular.categories);
//         if (updatedConfig.length > 0) {
//             await User.updateOne(
//                 { connection_id: data.id_author },
//                 { $set: { popular_config: updatedConfig } },
//                 { session }
//             );
//         }

//         await session.commitTransaction(); 
//         dayjs.extend(relativeTime)
//         dayjs.extend(updateLocale)
//         dayjs.updateLocale('en', {
//             relativeTime: {
//                 future: 'in %s',
//                 past: '%s',
//                 s: '1 s.',    
//                 m: '1 m.',    
//                 mm: '%d m.',  
//                 h: '1 h.',    
//                 hh: '%d h.',  
//                 d: '1 d.',    
//                 dd: '%d d.',  
//                 M: '1 mo.',   
//                 MM: '%d mo.', 
//                 y: '1 y.',    
//                 yy: '%d y.',  
//             },
//         })

//         const responseData = {
//             id_comment: comment.id_comment,
//             id_author: comment.id_author,
//             author_avatar: comment.author_avatar,
//             author_name: comment.author_name,
//             config_id: comment.config_id,
//             text: comment.text,
//             reply_count: comment.reply_count,
//             likes_count: comment.likes_count,
//             // reply_list: [], 
//             createdAt: dayjs(comment.createdAt).fromNow(),
//             liked: false, 
//         };

//         return NextResponse.json({responseData, config_id:data.config_id});
//     } catch (error) {
//         await session.abortTransaction(); 
//         console.error(error);
//         return NextResponse.json(
//             { message: 'Internal Server Error' },
//             { status: 500 }
//         );
//     }finally {
//         session.endSession(); 
//     }
// }



