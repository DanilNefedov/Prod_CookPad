import connectDB from "@/app/lib/mongoose";
import { NextResponse } from "next/server";
import { PatchNewUnitSchema } from "./schema";
import { addUnitToIngredient } from "./services";







export async function PATCH(request: Request) {
    try{
        const body = await request.json();

        const parsed = PatchNewUnitSchema.safeParse(body);

        if (!parsed.success) {
            return NextResponse.json(
                { message: 'Invalid request data' }, 
                { status: 400 }
            );
        }

        const { ingredient_id, new_unit } = parsed.data;

        await connectDB();

        const updatedIngredient = await addUnitToIngredient({ ingredient_id, new_unit });


        if (!updatedIngredient) {
            return NextResponse.json({ message: 'Ingredient not found' }, { status: 404 });
        }


        const { _id, units } = updatedIngredient;

        const addedUnit = units[units.length - 1]; 

        const newUnit = {
            unit_id: addedUnit._id,
            choice: addedUnit.choice,
            amount: addedUnit.amount,
            shop_unit: addedUnit.shop_unit
        }

        return NextResponse.json({
           ingredient_id: _id, 
           new_unit: newUnit
        });

    }catch(error){
        console.error(error);
        return NextResponse.json(
            { error: "An internal error occurred" },
            { status: 500 }
        );
    }
}
