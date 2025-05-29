import connectDB from "@/app/lib/mongoose";
import ListRecipe from "@/app/models/list-recipe";
import { NextResponse } from "next/server";







export async function GET(request: Request) {
    try{
        const { searchParams } = new URL(request.url);
        const connection_id = searchParams.get("connection_id");
        const _id = searchParams.get("_id");

        if (!connection_id || !_id) {
            return NextResponse.json(
                { message: 'Invalid request data' }, 
                { status: 400 }
            );
        }

        await connectDB();
        

        const recipe = await ListRecipe.findOne(
            {
                connection_id: connection_id,
                _id:_id
                // 'recipe.recipe_id': recipe_id
            },
            { "recipe.ingredients_list": 1, _id: 0 }
        );


        if (!recipe || !recipe.recipe) {
            return NextResponse.json(
                { message: "Recipe not found" },
                { status: 404 }
            );
        }

        return NextResponse.json(
        {
            connection_id,
            _id, 
            ingredients:recipe.recipe.ingredients_list
        });


    }catch(error){
        console.log(error)

        return NextResponse.json(
            { error: "An internal error occurred" },
            { status: 500 }
        );
    }
}