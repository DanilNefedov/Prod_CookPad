import { ListIngrDataFetch, UnitsIdFetch } from "@/app/(main)/(main-list)/list-recipe/types";
import connectDB from "@/app/lib/mongoose";
import { NextResponse } from "next/server";
import { PatchNewAmountSchema } from "./schema";
import { updateRecipeUnitAmount } from "./services";





export async function PATCH(request: Request) {
    try{
        const body = await request.json();

        const parsed = PatchNewAmountSchema.safeParse(body);

        if (!parsed.success) {
            return NextResponse.json(
                { message: 'Invalid request data' }, 
                { status: 400 }
            );
        }

        const { connection_id, ingredient_id, unit_id, amount, _id } = parsed.data;

        await connectDB();

        const updatedDocument = await updateRecipeUnitAmount({
            connection_id,
            ingredient_id,
            unit_id,
            amount,
            _id,
        });


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
            amount: updatedUnit?.amount 
        });

    }catch(error){
        console.error(error);
        return NextResponse.json(
            { error: "An internal error occurred" },
            { status: 500 }
        );
    }

}
