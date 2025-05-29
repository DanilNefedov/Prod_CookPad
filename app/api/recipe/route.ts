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
      return NextResponse.json(
        { message: 'Invalid request data' },
        { status: 400 }
      );
    }

    const newRecipe = new Recipe(recipeData);
    await newRecipe.save();

    if (recomData !== null) {
      recomData.creator = newRecipe._id;
      const saveData = new RecipePopularConfig(recomData);
      await saveData.save();

      const updateResult = await Recipe.updateOne(
        { _id: newRecipe._id },
        { $set: { recipe_popular_config: saveData._id } }
      );

      if (updateResult.matchedCount === 0) {
        return NextResponse.json(
          { message: 'Recipe not found' },
          { status: 404 }
        );
      }
      
    }

    return NextResponse.json(
      { data: newRecipe },
      { status: 201 }
    );

  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "An internal error occurred" },
      { status: 500 }
    );
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
        { error: "Invalid request data" },
        { status: 400 }
      );
    }

    await connectDB();

    const recipes = await Recipe.find({ connection_id })
      .sort({ createdAt: -1 })
      .select("recipe_id name time media recipe_type description favorite sorting -_id")
      .skip(skip)
      .limit(limit)
      .lean();

    if (!recipes) {
      return NextResponse.json(
        { error: "Failed to fetch recipes" },
        { status: 500 }
      );
    }

    const totalCount = await Recipe.countDocuments({ connection_id });

    if (typeof totalCount !== "number") {
      return NextResponse.json(
        { error: "Failed to count recipes" },
        { status: 500 }
      );
    }

    const hasMore = (page * limit) < totalCount;
    const nextPage = hasMore ? page + 1 : null;

    return NextResponse.json({ recipes, page: nextPage }, { status: 200 });

  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "An internal error occurred" },
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

