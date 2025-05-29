import connectDB from "@/app/lib/mongoose";
import ListIngredients from "@/app/models/list";
import { NextResponse } from "next/server";







export async function PATCH(request: Request) {
    try {
        const { ingredient_id, unit_id, shop_unit } = await request.json();

        if (!unit_id || !ingredient_id || typeof shop_unit !== "boolean") {
            return NextResponse.json(
                { message: 'Invalid request data' }, 
                { status: 400 }
            );
        }

        await connectDB();

        const updatedDoc = await ListIngredients.findOneAndUpdate(
            { _id:ingredient_id, "units._id": unit_id },
            { $set: { "units.$.shop_unit": !shop_unit } }
        );

        if (!updatedDoc) {
            return NextResponse.json({ error: "Document or unit not found" }, { status: 404 });
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
