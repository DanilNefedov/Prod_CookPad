import connectDB from "@/app/lib/mongoose";
import { NextResponse } from "next/server";
import { PatchCreateRecipeIngredientsSchema } from "./schema";
import {
    findRecipeDocForCreateIngredients,
    processCreateRecipeIngredients,
} from "./services";




export async function PATCH(request: Request) {
    try {
        const body = await request.json();

        const parsed = PatchCreateRecipeIngredientsSchema.safeParse(body);

        if (!parsed.success) {
            return NextResponse.json(
                { message: 'Invalid request data' },
                { status: 400 }
            );
        }

        const { connection_id, ingredients, recipe_id } = parsed.data;

        await connectDB();

        const recipeDoc = await findRecipeDocForCreateIngredients(connection_id, recipe_id);

        if (!recipeDoc) {
            return NextResponse.json({ message: "Recipe not found" }, { status: 404 });
        }

        const { results, notFound } = processCreateRecipeIngredients({
            recipe_id,
            ingredients,
            recipeDoc,
        });

        await recipeDoc.save();

        return NextResponse.json({
            results,
            notFound,
        },
            { status: notFound.length > 0 ? 207 : 200 }
        );

    } catch (error) {
        console.error(error);
        return NextResponse.json(
            { error: "An internal error occurred" },
            { status: 500 }
        );
    }
}
