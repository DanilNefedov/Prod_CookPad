import connectDB from "@/app/lib/mongoose";
import ListIngredients from "@/app/models/list";
import { NextResponse } from "next/server";







export async function PATCH(request: Request) {
    try{
        const { ingredient_id, new_unit } = await request.json();

        await connectDB();

        const updatedIngredient = await ListIngredients.findOneAndUpdate(
            { _id: ingredient_id},
            {
                $push: { units: new_unit }, 
            },
            { new: true }
        )


        if (!updatedIngredient) {
            return NextResponse.json({ message: 'Ingredient not found' }, { status: 404 });
        }


        const { _id, units } = updatedIngredient;

        const addedUnit = units[units.length - 1]; 

        return NextResponse.json({
           ingredient_id: _id, 
           new_unit: addedUnit
        });



    }catch(error){

        console.error('Error adding new unit:', error);
        return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
    
    }
}