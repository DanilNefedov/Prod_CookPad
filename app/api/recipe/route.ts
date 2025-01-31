import connectDB from "@/app/lib/mongoose";
import Recipe from "@/app/models/recipe";
import RecipePopularConfig from "@/app/models/recipe-popular-config";
import { ObjectId } from "mongodb";
import mongoose from "mongoose";
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
        { $push: { recipe_popular_config: saveData._id } }
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
        .select("-_id -__v -createdAt -updatedAt -connection_id") 
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

// export async function GET(request: Request) {//need to change
//   const { searchParams } = new URL(request.url)
//   const connection_id = searchParams.get('connection_id') as string
// //   const connection_id = link_info.split("/")[0];
// //   const recipe_id = link_info.split("/recipe_id=")[1];
//   await connectDB()
// //   if (link_info === `${connection_id}/recipe_id=${recipe_id}`) {
// //     const result = await Recipe.aggregate([
// //       { $match: { connection_id } },
// //       { $unwind: '$recipes' },
// //       { $match: { 'recipes.recipe_id': recipe_id } },
// //       {
// //         $project: {
// //           _id: 0,
// //           connection_id: '$connection_id',
// //           recipes: '$recipes',
// //         },
// //       },
// //       {
// //         $project: {
// //           connection_id: 1,
// //           recipes: [{
// //             $cond: {
// //               if: { $eq: ['$recipes.recipe_id', recipe_id] },
// //               then: '$recipes',
// //               else: null,
// //             },
// //           }],
// //         },
// //       },
// //     ]);
// //     // console.log(result)
// //     return NextResponse.json(result[0])
// //   } else {
//     const recipe = await Recipe.find({ connection_id }).select('-_id -__v -createdAt -updatedAt -connection_id')
//     return NextResponse.json(recipe)
// //   }


// }




export async function DELETE(req: Request) {
  try {
      await connectDB();

      const data = await req.json();
      const { connection_id, recipe_id } = data;

      const recipe = await Recipe.findOne(
          {
              connection_id: connection_id,
              recipe_id: recipe_id,
          },
          { recipe_popular_config: 1 }
      );

      if (!recipe || !recipe.recipe_popular_config || !recipe.recipe_popular_config.length) {
          return NextResponse.json({ status: 404, message: "Recipe or recipe config not found" });
      }

      const recipePopularConfigId = recipe.recipe_popular_config[0];

      // await Promise.all([
      //     LikesPopular.deleteMany({ config_id: recipePopularConfigId.toString() }),
      //     SavePopular.deleteMany({ config_id: recipePopularConfigId.toString() }),
      //     LikedComments.deleteMany({ config_id: recipePopularConfigId.toString() }),
      // ]);

      // const comments = await CommentPopular.find(
      //     { config_id: recipePopularConfigId.toString() },
      //     { _id: 0, id_comment: 1 }
      // );

      // await Promise.all(
      //     comments.map(async (comment) => {
      //         await ReplyComment.deleteMany({ id_branch: comment.id_comment });
      //     })
      // );

      // await Promise.all([
      //     CommentPopular.deleteMany({ config_id: recipePopularConfigId.toString() }),
      //     RecipePopularConfig.deleteOne({ _id: recipePopularConfigId })
      // ]);

      await Recipe.deleteOne({
          connection_id: connection_id,
          recipe_id: recipe_id
      });

      return NextResponse.json({ status: 201, message: 'Recipe successfully deleted' });
  } catch (error) {
      return NextResponse.json({
          status: 500,
          body: { message: 'Internal Server Error', error: error },
      });
  }
}
