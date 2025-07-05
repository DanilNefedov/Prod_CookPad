import { ListIngrData } from "@/app/(main)/(main-list)/list/types";
import connectDB from "@/app/lib/mongoose";
import ListRecipe from "@/app/models/list-recipe";
import { NextResponse } from "next/server";








export async function PATCH(request: Request) {
    try {
        const { connection_id, ingredient_id, shop_ingr, _id } = await request.json();


        if (!connection_id || !_id || !ingredient_id || typeof shop_ingr !== "boolean") {
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
                "recipe.ingredients_list._id": ingredient_id,
            },
            {
                $set: { "recipe.ingredients_list.$.shop_ingr": !shop_ingr }, 
            },
            { new: true }
        );


        if (!updatedDocument) {
            return NextResponse.json({ error: "Ingredient not found" }, { status: 404 });
        }

        const updatedIngredient = updatedDocument.recipe.ingredients_list.find(
            (ingr:ListIngrData) => ingr._id.toString() === ingredient_id
        );

        if (!updatedIngredient) {
            return NextResponse.json({ error: "Ingredient not found after update" }, { status: 500 });
        }


        return NextResponse.json({
            connection_id,
            ingredient_id,
            shop_ingr: updatedIngredient.shop_ingr,
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