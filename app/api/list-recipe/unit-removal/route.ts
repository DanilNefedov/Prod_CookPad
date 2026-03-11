import connectDB from "@/app/lib/mongoose";
import { NextResponse } from "next/server";
import { PatchUnitRemovalSchema } from "./schema";
import { removeRecipeUnit } from "./services";





export async function PATCH(request: Request) {
    try {
        const body = await request.json();

        const parsed = PatchUnitRemovalSchema.safeParse(body);

        if (!parsed.success) {
            return NextResponse.json(
                { message: 'Invalid request data' }, 
                { status: 400 }
            );
        }

        const { ingredient_id, connection_id, unit_id, _id } = parsed.data;
        
        await connectDB();

        const updatedRecipe = await removeRecipeUnit({
            ingredient_id,
            connection_id,
            unit_id,
            _id,
        });

        if (!updatedRecipe) {
            return NextResponse.json({ error: "Recipe or ingredient not found" }, { status: 404 });
        }

        return NextResponse.json({
            ingredient_id, 
            connection_id, 
            unit_id, 
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
