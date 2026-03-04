import connectDB from "@/app/lib/mongoose";
import { NextResponse } from "next/server";
import { PatchUnitRemovalSchema } from "./schema";
import { removeUnitFromIngredient } from "./services";





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

        const { ingredient_id, unit_id } = parsed.data;

        await connectDB();

        const updatedDoc = await removeUnitFromIngredient({ ingredient_id, unit_id });

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
