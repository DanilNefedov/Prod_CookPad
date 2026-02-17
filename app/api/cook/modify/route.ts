import connectDB from "@/app/lib/mongoose";
import { NextResponse } from "next/server";
import { updateRecipe } from "./services";
import { PatchRecipeSchema } from "./schema";





export async function PATCH(request: Request) {
    try {
        const raw = await request.json();

        const parsed = PatchRecipeSchema.safeParse(raw);

        if (!parsed.success) {
            return NextResponse.json(
                { message: 'Invalid request data' },
                { status: 400 }
            );
        }

        const { recipe_id, modified } = parsed.data;

        await connectDB();

        const result = await updateRecipe(recipe_id, modified);

        if (!result) {
            return NextResponse.json(
                { message: "Recipe not found" },
                { status: 404 }
            );
        }

        if (!result.updated) {
            return NextResponse.json(
                { message: "Nothing to update" },
                { status: 200 }
            );
        }

        return NextResponse.json(result.updateFields);

    } catch (error) {
        console.error(error);
        return NextResponse.json(
            { error: "An internal error occurred" },
            { status: 500 }
        );
    }
}

