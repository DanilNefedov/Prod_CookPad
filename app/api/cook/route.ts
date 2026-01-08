import connectDB from "@/app/lib/mongoose"
import Recipe from "@/app/models/recipe"
import { NextResponse } from "next/server"
import { deleteHistory, deleteListRecipe, deleteRecipe } from "./services";
import mongoose from "mongoose";




export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const connection_id = searchParams.get("connection_id");
    const recipe_id = searchParams.get("recipe");
    // const recipeExists = searchParams.get("recipeExists") === "true";

    if (!connection_id || !recipe_id) {
      return NextResponse.json(
        { message: 'Invalid request data' },
        { status: 400 }
      );
    }

    await connectDB();

    const dataCook = await Recipe.findOne({ recipe_id, connection_id })
      .select('recipe_id name time media recipe_type description favorite sorting instruction ingredients -_id')
      .lean();

    if (!dataCook) {
      return NextResponse.json(
        { message: "Recipe not found" },
        { status: 404 }
      );
    }
    return NextResponse.json({ dataCook });// isInHistory

  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "An internal error occurred" },
      { status: 500 }
    );
  }
}




export async function DELETE(request: Request) {
  const session = await mongoose.startSession();

  try {
    await connectDB();
    session.startTransaction();

    const { searchParams } = new URL(request.url);
    const connection_id = searchParams.get("connection_id");
    const recipe_id = searchParams.get("recipe");

    if (!connection_id || !recipe_id) {
      return NextResponse.json(
        { message: 'Invalid request data' },
        { status: 400 }
      );
    }

    //for the future, there is the possibility to determine return values 
    await deleteHistory({connection_id, recipe_id}, session)
    await deleteListRecipe({connection_id, recipe_id}, session)
    await deleteRecipe({recipe_id}, session)

    await session.commitTransaction();
    session.endSession();

    return new NextResponse(null, { status: 204 });

  } catch (error) {
    await session.abortTransaction();
    session.endSession();

    console.error(error);
    return NextResponse.json(
      { error: "An internal error occurred" },
      { status: 500 }
    );
  }
}