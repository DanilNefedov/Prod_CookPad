import connectDB from "@/app/lib/mongoose";
import RecipePopularConfig from "@/app/models/popular-config";
import Recipe from "@/app/models/recipe";
import { NextResponse } from "next/server"


export async function POST(req: Request) {
  try {
    await connectDB();

    const data = await req.json();
    const { recipeData, recomData } = data;

    if (!recipeData) {
      return NextResponse.json({
        status: 400,
        body: { message: 'Invalid recipe data' },
      });
    }

    const newRecipe = new Recipe(recipeData);
    await newRecipe.save();

    if (recomData !== null) {
      recomData.creator = newRecipe._id;
      const saveData = new RecipePopularConfig(recomData);
      await saveData.save();

      await Recipe.updateOne(
        { _id: newRecipe._id },
        { $set: { recipe_popular_config: saveData._id } }
      );
    }

    return NextResponse.json({
      status: 201,
      body: {
        message: 'Recipe created successfully',
        data: newRecipe,
      },
    });
  } catch (error) {
    console.error('Error creating recipe:', error);
    return NextResponse.json({
      status: 500,
      body: { message: 'Error creating recipe', error: error },
    });
  }
}




export async function GET(request: Request) {
    try {
      const { searchParams } = new URL(request.url);
      const connection_id = searchParams.get("connection_id");
      const page = parseInt(searchParams.get("page") || "1", 10);
      const limit = 12;
      const skip = (page - 1) * limit;
      
      if (!connection_id) {
        return NextResponse.json(
          { error: "connection_id is required" },
          { status: 400 }
        );
      }
  
      await connectDB();
  
      const recipes = await Recipe.find({ connection_id })
        .sort({ createdAt: -1 })
        .select("recipe_id name time media recipe_type description favorite sorting -_id") 
        .skip(skip)
        .limit(limit)
        .lean(); // for faster queries
  
      if (!recipes.length) {
        return NextResponse.json(
          { message: "No recipes found for the provided connection_id" },
          { status: 404 }
        );
      }
      const totalCount = await Recipe.countDocuments({ connection_id });
      console.log(totalCount)
  
      return NextResponse.json({recipes, page, totalCount}, { status: 200 });
    } catch (error) {
      console.error("Error fetching recipes:", error);
  
      return NextResponse.json(
        { error: "An unexpected error occurred. Please try again later." },
        { status: 500 }
      );
    }
}




// export async function DELETE(req: Request) {
//   const session = await mongoose.startSession();

//   try {
//     await connectDB();
//     session.startTransaction();

//     const { connection_id, recipe_id } = await req.json();

//     const recipe = await Recipe.findOne(
//       { connection_id, recipe_id },
//       { recipe_popular_config: 1 }
//     ).session(session);

//     const baseDeletions = [
//       ListRecipe.deleteOne({
//         connection_id,
//         'recipe.recipe_id': recipe_id,
//       }).session(session),

//       CookHistory.updateOne(
//         { connection_id, 'history_links.recipe_id': recipe_id },
//         { $pull: { history_links: { recipe_id } } }
//       ).session(session),

//       Recipe.deleteOne({ connection_id, recipe_id }).session(session),
//     ];

//     if (recipe?.recipe_popular_config) {
//       const configId = recipe.recipe_popular_config.toString();

//       const advancedDeletions: Promise<any>[] = [
//         SavesPopular.deleteMany({ config_id: configId }).session(session),
//         LikesPopular.deleteMany({ config_id: configId }).session(session),
//         RecipePopularConfig.deleteOne({ _id: configId }).session(session),
//       ];

//       const comments = await CommentPopular.find(
//         { config_id: configId },
//         { _id: 0, id_comment: 1, likes_count: 1, reply_count: 1 }
//       ).session(session);

//       const commentLikeDeletions: Promise<any>[] = [];
//       const replyDeletions: Promise<any>[] = [];

//       for (const comment of comments) {
//         if (comment.likes_count > 0) {
//           commentLikeDeletions.push(
//             LikesComments.deleteMany({ id_comment: comment.id_comment }).session(session)
//           );
//         }

//         if (comment.reply_count > 0) {
//           replyDeletions.push((async () => {
//             const replies = await ReplyComment.find(
//               { id_branch: comment.id_comment },
//               { _id: 0, id_comment: 1 }
//             ).session(session);

//             const likeReplyDeletions = replies.map((reply) =>
//               LikesReply.deleteMany({ id_comment: reply.id_comment }).session(session)
//             );

//             await Promise.all(likeReplyDeletions);
//             return ReplyComment.deleteMany({ id_branch: comment.id_comment }).session(session);
//           })());
//         }
//       }

//       await Promise.all([
//         ...baseDeletions,
//         ...advancedDeletions,
//         ...commentLikeDeletions,
//         ...replyDeletions,
//         CommentPopular.deleteMany({ config_id: configId }).session(session),
//       ]);
//     } else {
//       await Promise.all(baseDeletions);
//     }

//     await session.commitTransaction();

//     return NextResponse.json({
//       status: 201,
//       message: 'Recipe successfully deleted',
//     });

//   } catch (error) {
//     await session.abortTransaction();
//     console.error('Transaction Error:', error);

//     return NextResponse.json({
//       status: 500,
//       body: { message: 'Internal Server Error', error },
//     });
//   } finally {
//     session.endSession();
//   }
// }





// {
//     "recipes": [
//         {
//             "recipe_id": undefined,
//             "name": 34,
//             "time": {
//                 "hours": 4,
//                 "minutes": 44
//             },
//             "media": [
//                 {
//                     "main": false,
//                     "media_url": "https://firebasestorage.googleapis.com/v0/b/web-arch-file.appspot.com/o/recipes%2F101625596288293490906%2F27c764e9-e0af-4111-81c1-c7fa49b9c68e%2Fda5e55fc-d875-472c-8a16-9c446245e648?alt=media&token=326a4f1f-f5ca-4de8-965e-0f3c2e7533a8",
//                     "media_id": "da5e55fc-d875-472c-8a16-9c446245e648",
//                     "media_type": "image",
//                     "_id": "681f4a38ce6c3465f38fcfa2"
//                 },
//                 {
//                     "main": false,
//                     "media_url": "https://firebasestorage.googleapis.com/v0/b/web-arch-file.appspot.com/o/recipes%2F101625596288293490906%2F27c764e9-e0af-4111-81c1-c7fa49b9c68e%2Fb92e0fbc-9316-4fd0-8d95-e3a590f36e14?alt=media&token=dff8d339-a1ac-48a2-a12c-9cf4c092e3ad",
//                     "media_id": "b92e0fbc-9316-4fd0-8d95-e3a590f36e14",
//                     "media_type": "image",
//                     "_id": "681f4a38ce6c3465f38fcfa3"
//                 },
//                 {
//                     "main": false,
//                     "media_url": "https://firebasestorage.googleapis.com/v0/b/web-arch-file.appspot.com/o/recipes%2F101625596288293490906%2F27c764e9-e0af-4111-81c1-c7fa49b9c68e%2F4c0a5bcb-8c52-42ee-bdae-bcf04d32a973?alt=media&token=9ac279f0-117a-4d1f-aab4-35d06c63c6a9",
//                     "media_id": "4c0a5bcb-8c52-42ee-bdae-bcf04d32a973",
//                     "media_type": "video",
//                     "_id": "681f4a38ce6c3465f38fcfa4"
//                 }
//             ],
//             "recipe_type": "Salad",
//             "description": "sdfsdfsdsdds",
//             "sorting": [
//                 "salad"
//             ],
//             "favorite": false
//         },
        
//     ],
//     "page": 1,
//     "totalCount": 61
// }