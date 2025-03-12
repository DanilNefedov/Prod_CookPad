import connectDB from "@/app/lib/mongoose";
import ListRecipe from "@/app/models/list-recipe";
import { NextResponse } from "next/server";





export async function PATCH(request: Request) {
    try{
        const data = await request.json();
        const { connection_id,  ingredient_id, updated_unit, recipe_id } = data;

        await connectDB();

        const updatedRecipe = await ListRecipe.findOneAndUpdate(
            {
                connection_id,
                "recipe.recipe_id": recipe_id,
                "recipe.ingredients_list._id": ingredient_id
            },
            {
                $push: { "recipe.ingredients_list.$.units": updated_unit }
            },
            { new: true }
        );

        if (!updatedRecipe) {
            return NextResponse.json({ error: "Document not found" }, { status: 404 });
        }

        const updatedIngredient = updatedRecipe.recipe.ingredients_list.find(
            (ingr: any) => ingr._id.toString() === ingredient_id
        );

        if (!updatedIngredient) {
            return NextResponse.json({ error: "Ingredient not found" }, { status: 404 });
        }

        const new_unit = updatedIngredient.units[updatedIngredient.units.length - 1];

        return NextResponse.json({
            connection_id,
            new_unit,
            ingredient_id,
            recipe_id
        });
        

    }catch(error){
        console.log(error)
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}