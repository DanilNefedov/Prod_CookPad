import connectDB from "@/app/lib/mongoose";
import { NextResponse } from "next/server";
import { GetListRecipeIngredientsQuerySchema } from "./schema";
import { findListRecipeIngredients } from "./services";







export async function GET(request: Request) {
    try{
        const { searchParams } = new URL(request.url);
        const rawQuery = {
            connection_id: searchParams.get("connection_id"),
            _id: searchParams.get("_id"),
        };

        const parsed = GetListRecipeIngredientsQuerySchema.safeParse(rawQuery);

        if (!parsed.success) {
            return NextResponse.json(
                { message: 'Invalid request data' }, 
                { status: 400 }
            );
        }

        const { connection_id, _id } = parsed.data;

        await connectDB();
        

        const recipe = await findListRecipeIngredients({ connection_id, _id });


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
        console.error(error)

        return NextResponse.json(
            { error: "An internal error occurred" },
            { status: 500 }
        );
    }
}
