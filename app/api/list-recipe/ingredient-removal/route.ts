import connectDB from "@/app/lib/mongoose";
import { NextResponse } from "next/server";
import { PatchIngredientRemovalSchema } from "./schema";
import { removeIngredientFromRecipe } from "./services";






export async function PATCH(request: Request) {
    try{
        const body = await request.json();

        const parsed = PatchIngredientRemovalSchema.safeParse(body);

        if (!parsed.success) {
            return NextResponse.json(
                { message: 'Invalid request data' }, 
                { status: 400 }
            );
        }

        const { ingredient_id, connection_id, _id } = parsed.data;

        await connectDB();

        const updatedDocument = await removeIngredientFromRecipe({ ingredient_id, connection_id, _id });

        if (!updatedDocument) {
            return NextResponse.json({ message: "Ingredient not found" }, { status: 404 });
        }

        return NextResponse.json({
            ingredient_id, connection_id, _id
        });


    }catch(error){
        console.error(error)
        return NextResponse.json(
            { error: "An internal error occurred" },
            { status: 500 }
        );
    }
}
