import connectDB from "@/app/lib/mongoose";
import ListRecipe from "@/app/models/list-recipe";
import { IListObj } from "@/app/types/types";
import { NextResponse } from "next/server";








export async function PATCH(request: Request) {
    try {
        const { connection_id, ingredient_id, shop_ingr, recipe_id } = await request.json();


        if (!connection_id || !recipe_id || !ingredient_id || typeof shop_ingr !== "boolean") {
            return NextResponse.json({ error: "Missing or invalid parameters" }, { status: 400 });
        }

        await connectDB();

        const updatedDocument = await ListRecipe.findOneAndUpdate(
            {
                connection_id,
                "recipe.recipe_id": recipe_id,
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
            (ingr:IListObj) => ingr._id.toString() === ingredient_id
        );

        if (!updatedIngredient) {
            return NextResponse.json({ error: "Ingredient not found after update" }, { status: 500 });
        }


        return NextResponse.json({
            connection_id,
            ingredient_id,
            shop_ingr: updatedIngredient.shop_ingr,
            recipe_id
        });

    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}