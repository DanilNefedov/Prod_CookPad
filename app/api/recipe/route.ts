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
      .select("recipe_id name media recipe_type favorite sorting -_id")
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


