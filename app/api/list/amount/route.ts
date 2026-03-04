import connectDB from "@/app/lib/mongoose";
import { NextResponse } from "next/server";
import { PatchAmountSchema } from "./schema";
import { updateAmount } from "./services";





export async function PATCH(request: Request) {
    try {
        const body = await request.json();

        const parsed = PatchAmountSchema.safeParse(body);

        if (!parsed.success) {
            return NextResponse.json(
                { message: 'Invalid request data' }, 
                { status: 400 }
            );
        }

        const { ingredient_id, unit_id, amount } = parsed.data;

        await connectDB();

        const updatedDoc = await updateAmount({ ingredient_id, unit_id, amount });

        if (!updatedDoc) {
            return NextResponse.json({ error: "Document or unit not found" }, { status: 404 });
        }

        return NextResponse.json({ingredient_id, unit_id, amount});

    } catch (error) {
        console.error(error);
        return NextResponse.json(
            { error: "An internal error occurred" },
            { status: 500 }
        );
    }
}

