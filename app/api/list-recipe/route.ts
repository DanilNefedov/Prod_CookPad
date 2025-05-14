import connectDB from "@/app/lib/mongoose";
import ListRecipe from "@/app/models/list-recipe";
import Recipe from "@/app/models/recipe";
import { IngredientFullData, MediaObj } from "@/app/types/types";
import { NextResponse } from "next/server";
import _ from "lodash";





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

        const recipe_media = recipe.media.find((m: MediaObj) => m.main) || recipe.media[0];

        const transformedRecipe = {
            recipe_id: recipe.recipe_id,
            recipe_name: recipe.name,
            recipe_media: {
                url: recipe_media.media_url,
                type: recipe_media.media_type, 
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






export async function GET(request: Request) {
    try {   
        const { searchParams } = new URL(request.url);
        const connection_id = searchParams.get("connection_id");
        const page = parseInt(searchParams.get("page") || "1", 10);
        
        await connectDB();

        if (!connection_id) {
            return NextResponse.json(
                { message: "The input parameters are invalid" },
                { status: 400 }
            )
        }

        const pageSize = 12;
        const skip = (page - 1) * pageSize;


        const recipes = await ListRecipe.find({ connection_id },
            {   
                _id:0,
                connection_id: 1,
                "recipe.recipe_id": 1,
                "recipe.recipe_name": 1,
                "recipe.recipe_shop": 1,
                "recipe.recipe_media.url": 1,
                "recipe.recipe_media.type": 1,
            }
        )
        .sort({ createdAt: -1 }) 
        .skip(skip)
        .limit(pageSize)
        .lean();

        const formattedRecipes = {
            connection_id: connection_id,
            recipe: _.cloneDeep(recipes.map(({ recipe }) => recipe)), 
            page
        };

        return NextResponse.json(formattedRecipes, { status: 200 });

    }catch(error){
        console.log(error)
        return NextResponse.json({
            status: 500,
            body: { message: 'Error creating recipe', error: error },
        });
    }

}





export async function DELETE(req: Request) {
  try {
    const { connection_id, recipe_id } = await req.json();

    if (!connection_id || !recipe_id) {
        return NextResponse.json({ message: 'Missing parameters' }, { status: 400 });
    }

    await connectDB();

    const result = await ListRecipe.findOneAndDelete({
        connection_id,
        'recipe.recipe_id': recipe_id,
    });

    if (!result) {
        return NextResponse.json({ message: 'Not found' }, { status: 404 });
    }

    return NextResponse.json(recipe_id, { status: 200 });

    } catch (error) {
        console.error('Error deleting recipe:', error);
        return NextResponse.json({ message: 'Server error' }, { status: 500 });
    }
}