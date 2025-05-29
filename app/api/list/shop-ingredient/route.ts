import connectDB from "@/app/lib/mongoose";
import ListIngredients from "@/app/models/list";
import { NextResponse } from "next/server";








export async function PATCH(request: Request) {
    try {
        const { _id, shop_ingr } = await request.json();

        if (!_id || typeof shop_ingr !== "boolean") {
            return NextResponse.json(
                { message: 'Invalid request data' }, 
                { status: 400 }
            );
        }

        await connectDB();

        const updatedDoc = await ListIngredients.findOneAndUpdate(
            { _id },
            { $set: { shop_ingr: !shop_ingr } },
            // { new: true }//if I need to return an updated object or do something with it
        );

        if (!updatedDoc) {
            return NextResponse.json({ error: "Document or unit not found" }, { status: 404 });
        }

        return NextResponse.json({}, { status: 200  });

    } catch (error) {
        console.error(error);
        return NextResponse.json(
            { error: "An internal error occurred" },
            { status: 500 }
        );
    }
}