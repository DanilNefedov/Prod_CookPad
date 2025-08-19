import { ListIngrDataFetch, UnitsIdFetch } from "@/app/(main)/(main-list)/list-recipe/types";
import connectDB from "@/app/lib/mongoose";
import ListRecipe from "@/app/models/list-recipe";
import { NextResponse } from "next/server";








export async function PATCH(request: Request) {
    try {
        const data = await request.json();
        const { ingredient_id, connection_id, _id, unit_id, shop_unit } = data;

        if (!connection_id || !_id || !ingredient_id || !unit_id || typeof shop_unit !== "boolean") {
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
                "recipe.ingredients_list.units._id": unit_id,
            },
            {
                $set: { 
                    "recipe.ingredients_list.$[ing].units.$[unit].shop_unit": !shop_unit 
                }
            },
            {
                arrayFilters: [
                    { "ing._id": ingredient_id },
                    { "unit._id": unit_id }
                ],
                new: true,
                projection: { "recipe.ingredients_list": 1 } // Return only the required fields
            }
        );

        // if (!updatedDocument) {
        //     return NextResponse.json({ message: "Ingredient or unit not found" }, { status: 404 });
        // }
        if (!updatedDocument || !updatedDocument.recipe || !Array.isArray(updatedDocument.recipe.ingredients_list)) {
            return NextResponse.json(
                { message: "Updated document not found or has incorrect structure" },
                { status: 404 }
            );
        }


        const updatedIngredient = updatedDocument.recipe.ingredients_list.find((ing: ListIngrDataFetch) => 
            ing._id?.toString() === ingredient_id
        );

        
        if (!updatedIngredient || !Array.isArray(updatedIngredient.units)) {
            return NextResponse.json(
                { message: "Ingredient not found or has no units" },
                { status: 404 }
            );
        }

        const updatedUnit = updatedIngredient.units.find((unit: UnitsIdFetch) => 
            unit._id?.toString() === unit_id
        );

        return NextResponse.json({
            ingredient_id,
            connection_id,
            _id,
            unit_id,
            shop_unit: updatedUnit?.shop_unit
        });
        

    }catch(error){
        console.error(error);
        return NextResponse.json(
            { error: "An internal error occurred" },
            { status: 500 }
        );
    }
}