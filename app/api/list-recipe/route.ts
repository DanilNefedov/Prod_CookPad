import connectDB from "@/app/lib/mongoose";
import ListRecipe from "@/app/models/list-recipe";
import Recipe from "@/app/models/recipe";
import { IngredientFullData, MediaObj } from "@/app/types/types";
import { NextResponse } from "next/server";





export async function POST(request: Request) {
    try{
        // const { searchParams } = new URL(request.url);
        // const connection_id = searchParams.get("connection_id");
        // const recipe_id = searchParams.get('recipe_id')
        const data = await request.json();
        const { connection_id, recipe_id } = data;


        await connectDB();

        const recipe = await Recipe.findOne({ recipe_id, connection_id });

        if (!recipe) {
            return NextResponse.json(
                { message: "No recipes found for the provided connection_id" },
                { status: 404 }
            );
        }

        const recipe_media = recipe.media.find((m: MediaObj) => m.main) || recipe.media[0] || { media_url: '', type: 'image' };

        const transformedRecipe = {
            recipe_id: recipe.recipe_id,
            recipe_name: recipe.name,
            recipe_media: {
                url: recipe_media.media_url,
                type: recipe_media.type || 'image', 
            },
            recipe_shop: false,
            ingredients_list: recipe.ingredients.map((ing: IngredientFullData) => ({
                name: ing.name,
                media: ing.media || '',
                shop_ingr: false, 
                units: [{
                    choice:ing.units.choice,
                    amount:ing.units.amount,
                    shop_unit:false
                }],
                list: ing.units.list,
            })),
        };

        const newListRecipe = new ListRecipe({
            connection_id,
            recipe: transformedRecipe,
        });

        await newListRecipe.save();


        return NextResponse.json({
            status: 201,
            body: {
                message: 'Recipe created successfully',
                data: newListRecipe,
            },
        });



    }catch(error){
        console.log(error)
        return NextResponse.json({
            status: 500,
            body: { message: 'Error creating recipe', error: error },
        });
    }
}