import connectDB from "@/app/lib/mongoose";
import ListIngredients from "@/app/models/list";
import { NextResponse } from "next/server";





export async function PATCH(request: Request) {
    try {
        const { ingredient_id, unit_id } = await request.json();

        if (!ingredient_id || !unit_id) {
            return NextResponse.json(
                { message: 'Invalid request data' }, 
                { status: 400 }
            );
        }

        await connectDB();

        const updatedDoc = await ListIngredients.findOneAndUpdate(
            { _id: ingredient_id },
            { $pull: { units: { _id: unit_id } } },
            // { new: true } 
        );

        if (!updatedDoc) {
            return NextResponse.json({ error: "Document not found" }, { status: 404 });
        }

        return NextResponse.json({}, { status: 200 });

    } catch (error) {
        console.error(error);
        return NextResponse.json(
            { error: "An internal error occurred" },
            { status: 500 }
        );
    }
}
