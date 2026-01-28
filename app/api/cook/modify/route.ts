import connectDB from "@/app/lib/mongoose";
import { NextResponse } from "next/server";
import { updateRecipe } from "./services";





export async function PATCH(request: Request) {
    try {
        await connectDB();
        const { recipe_id, modified } = await request.json();

        if (!recipe_id) {
            return NextResponse.json(
                { message: "Missing required fields" },
                { status: 400 }
            );
        }

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

