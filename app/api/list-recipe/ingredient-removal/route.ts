import connectDB from "@/app/lib/mongoose";
import ListRecipe from "@/app/models/list-recipe";
import { NextResponse } from "next/server";






export async function PATCH(request: Request) {
    try{
        const data = await request.json();
        const { ingredient_id, connection_id, recipe_id } = data;

        if (!connection_id || !recipe_id || !ingredient_id) {
            return NextResponse.json(
                { message: "The input parameters are invalid" },
                { status: 400 }
            )
        }

        await connectDB();

        const updatedDocument = await ListRecipe.findOneAndUpdate(
            {
                connection_id,
                "recipe.recipe_id": recipe_id,
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
            ingredient_id, connection_id, recipe_id
         });


    }catch(error){
        console.log(error)
        return NextResponse.json({
            status: 500,
            body: { message: 'Error creating recipe', error: error },
        });
    }
}
