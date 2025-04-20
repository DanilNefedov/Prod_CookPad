


import connectDB from "@/app/lib/mongoose"
import Recipe from "@/app/models/recipe"
import { NextResponse } from "next/server"




export async function GET(request: Request) {
    try {
      const { searchParams } = new URL(request.url);
      const connection_id = searchParams.get("connection_id");
      const recipe_id = searchParams.get("recipe");
      const recipeExists = searchParams.get("recipeExists") === "true";
  
      if (!connection_id || !recipe_id) {
        return NextResponse.json(
          { message: "Missing required parameters" },
          { status: 400 }
        );
      }
  
      await connectDB();
  
      const selectedFields = recipeExists
        ? "instruction ingredients -_id"
        : "recipe_id name time media recipe_type description favorite sorting instruction ingredients -_id";
  
     
      const dataCook = await Recipe.findOne({ recipe_id, connection_id })
        .select(selectedFields)
        .lean();
  
      if (!dataCook) {
        return NextResponse.json(
          { message: "Recipe not found" },
          { status: 404 }
        );
      }
      return NextResponse.json({ dataCook }, { status: 200 });//, isInHistory
  
    } catch (error) {
      console.error("GET /api/cook/recipe error:", error);
      return NextResponse.json(
        { message: "Internal Server Error", error },
        { status: 500 }
      );
    }
  }


