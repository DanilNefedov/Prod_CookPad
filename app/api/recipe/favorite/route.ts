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

        const updateData: { $set: { favorite: boolean }; $push?: { sorting: string }; $pull?: { sorting: string } } = {
            $set: { favorite: !favorite },
        };

        if (!favorite) {
            updateData.$push = { sorting: 'favorite' };
        } else {
            updateData.$pull = { sorting: 'favorite' };
        }

        const updatedRecipe = await Recipe.findOneAndUpdate(
            { connection_id, recipe_id },
            updateData,
            { new: true, select: '-_id recipe_id favorite' } 
        );

        if (!updatedRecipe) {
            return NextResponse.json(
                { message: 'Recipe not found' },
                { status: 404 }
            );
        }

        return NextResponse.json(
            updatedRecipe
        );

    } catch (error) {
        console.error(error);
        return NextResponse.json(
            { message: 'Internal Server Error' },
            { status: 500 }
        );
    }
}

