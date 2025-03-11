import connectDB from "@/app/lib/mongoose";
import ListRecipe from "@/app/models/list-recipe";
import Recipe from "@/app/models/recipe";
import { IngredientFullData, MediaObj } from "@/app/types/types";
import { NextResponse } from "next/server";
import _ from "lodash";







export async function GET(request: Request) {
    try{
        const { searchParams } = new URL(request.url);
        const connection_id = searchParams.get("connection_id");
        const recipe_id = searchParams.get("recipe_id");

        if (!connection_id || !recipe_id) {
            return NextResponse.json(
                { message: "The input parameters are invalid" },
                { status: 400 }
            )
        }

        await connectDB();
        

        const recipe = await ListRecipe.findOne(
            {
                connection_id: connection_id,
                'recipe.recipe_id': recipe_id
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
            recipe_id, 
            ingredients:recipe.recipe.ingredients_list
        }, { status: 200 });


    }catch(error){
        console.log(error)

        return NextResponse.json({
            status: 500,
            body: { message: 'Error creating recipe', error: error },
        });
    }
}