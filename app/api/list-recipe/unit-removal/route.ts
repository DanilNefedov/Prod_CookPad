import connectDB from "@/app/lib/mongoose";
import ListRecipe from "@/app/models/list-recipe";
import { NextResponse } from "next/server";





export async function PATCH(request: Request) {
    try {
        const { ingredient_id, connection_id, unit_id, _id} = await request.json();

        if (!ingredient_id || !unit_id || !connection_id || !_id) {
            return NextResponse.json(
                { message: 'Invalid request data' }, 
                { status: 400 }
            );
        }
        
        await connectDB();

        const updatedRecipe = await ListRecipe.findOneAndUpdate(
            { "connection_id": connection_id, _id: _id },
            { $pull: { "recipe.ingredients_list.$[ingredient].units": { "_id": unit_id } } },
            { arrayFilters: [{ "ingredient._id": ingredient_id }], new: true }
        );

        if (!updatedRecipe) {
            return NextResponse.json({ error: "Recipe or ingredient not found" }, { status: 404 });
        }

        return NextResponse.json({
            ingredient_id, 
            connection_id, 
            unit_id, 
            _id
        });

    } catch (error) {
        console.error(error);
        return NextResponse.json(
            { error: "An internal error occurred" },
            { status: 500 }
        );
    }
}