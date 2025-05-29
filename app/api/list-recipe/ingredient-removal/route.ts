import connectDB from "@/app/lib/mongoose";
import ListRecipe from "@/app/models/list-recipe";
import { NextResponse } from "next/server";






export async function PATCH(request: Request) {
    try{
        const data = await request.json();
        const { ingredient_id, connection_id, _id } = data;

        if (!connection_id || !_id || !ingredient_id) {
            return NextResponse.json(
                { message: 'Invalid request data' }, 
                { status: 400 }
            );
        }

        await connectDB();

        const updatedDocument = await ListRecipe.findOneAndUpdate(
            {
                connection_id,
                _id: _id,
            },
            {
                $pull: { "recipe.ingredients_list": { _id: ingredient_id } }
            },
            // { new: true }
        );

        if (!updatedDocument) {
            return NextResponse.json({ message: "Ingredient not found" }, { status: 404 });
        }

        return NextResponse.json({
            ingredient_id, connection_id, _id
        });


    }catch(error){
        console.log(error)
        return NextResponse.json(
            { error: "An internal error occurred" },
            { status: 500 }
        );
    }
}
