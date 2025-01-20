import connectDB from "@/app/lib/mongoose";
import Recipe from "@/app/models/recipe";
import { NextResponse } from "next/server"






export async function PATCH(request: Request) {
    try {
        await connectDB();

        const data = await request.json();
        const { connection_id, recipe_id, favorite } = data;

        if (!connection_id || !recipe_id || typeof favorite !== 'boolean') {
            return NextResponse.json(
                { message: 'Invalid request data' },
                { status: 400 }
            );
        }

        const result = await Recipe.updateOne(
            { connection_id, recipe_id },
            { $set: { favorite: !favorite } }
        );

        if (result.modifiedCount === 0) {
            return NextResponse.json(
                { message: 'Recipe not found or no changes made' },
                { status: 404 }
            );
        }

        return NextResponse.json(
            { message: 'Recipe updated successfully' },
            { status: 200 }
        );

    } catch (error) {
        return NextResponse.json(
            { message: 'Internal Server Error' },
            { status: 500 }
        );
    }
}
