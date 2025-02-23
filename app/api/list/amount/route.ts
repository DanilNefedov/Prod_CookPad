import connectDB from "@/app/lib/mongoose";
import ListIngredients from "@/app/models/list";
import { NextResponse } from "next/server";







export async function PATCH(request: Request) {
    try {
        const { ingredient_id, unit_id, amount } = await request.json();

        if (!ingredient_id || !unit_id || amount === undefined) {
            return NextResponse.json({ error: "Missing ingredient_id, unit_id, or amount" }, { status: 400 });
        }

        await connectDB();

        const updatedDoc = await ListIngredients.findOneAndUpdate(
            { _id: ingredient_id, "units._id": unit_id }, 
            { $set: { "units.$.amount": amount } }, 
            // { new: true } 
        );

        if (!updatedDoc) {
            return NextResponse.json({ error: "Document or unit not found" }, { status: 404 });
        }

        return NextResponse.json({}, { status: 200 });

    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}

