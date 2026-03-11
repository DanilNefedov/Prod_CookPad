import { ListIngrDataFetch } from "@/app/(main)/(main-list)/list-recipe/types";
import connectDB from "@/app/lib/mongoose";
import { NextResponse } from "next/server";
import { PatchShopIngredientSchema } from "./schema";
import { toggleRecipeIngredientShop } from "./services";








export async function PATCH(request: Request) {
    try {
        const body = await request.json();

        const parsed = PatchShopIngredientSchema.safeParse(body);

        if (!parsed.success) {
            return NextResponse.json(
                { message: 'Invalid request data' }, 
                { status: 400 }
            );
        }

        const { connection_id, ingredient_id, shop_ingr, _id } = parsed.data;

        await connectDB();

        const updatedDocument = await toggleRecipeIngredientShop({
            connection_id,
            ingredient_id,
            shop_ingr,
            _id,
        });


        if (!updatedDocument) {
            return NextResponse.json({ error: "Ingredient not found" }, { status: 404 });
        }

        const updatedIngredient = updatedDocument.recipe.ingredients_list.find(
            (ingr:ListIngrDataFetch) => ingr._id.toString() === ingredient_id
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
