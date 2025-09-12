import { ModifiedRoute } from "@/app/(main)/cook/types";
import connectDB from "@/app/lib/mongoose";
import Recipe from "@/app/models/recipe";
import { NextResponse } from "next/server";








export async function PATCH(request: Request) {
    try {
        await connectDB();

        const data = await request.json();
        const { recipe_id, modified } = data;
        
        if (!recipe_id ) {
            return NextResponse.json({ message: "Missing required fields" }, { status: 400 });
        }

        const recipe = await Recipe.findOne({ recipe_id });

        if (!recipe) {
            return NextResponse.json({ message: "Recipe not found" }, { status: 404 });
        }

        const updateFields: ModifiedRoute = {};

        if (modified.name) updateFields.name = modified.name;
        if (modified.time) updateFields.time = modified.time;
        if (modified.description) updateFields.description = modified.description;
        if (modified.instruction) updateFields.instruction = modified.instruction;
        if (modified.recipe_type) updateFields.recipe_type = modified.recipe_type;
        if (modified.sorting && Array.isArray(modified.sorting) && modified.sorting.length > 0) updateFields.sorting = modified.sorting


            
        const result = await Recipe.updateOne(
            { recipe_id },
            { $set: updateFields }
        );

        console.log(updateFields)

        return NextResponse.json(updateFields);
    
        
    } catch (error) {
        console.error(error)
        return NextResponse.json(
            { error: "An internal error occurred" },
            { status: 500 }
        );
    }
}

