import connectDB from "@/app/lib/mongoose";
import { NextResponse } from "next/server";
import { PatchCookIngredientSchema, PostCookIngredientSchema } from "./schema";
import { appendUnitToCookIngredient, createCookIngredient, findCookIngredient } from "./services";



export async function PATCH(request: Request) {
    try {
        const body = await request.json();

        const parsed = PatchCookIngredientSchema.safeParse(body);

        if (!parsed.success) {
            return NextResponse.json(
                { message: 'Invalid request data' },
                { status: 400 }
            );
        }

        await connectDB();

        const existing = await findCookIngredient(parsed.data);

        if (!existing) {
            return NextResponse.json(
                { error: "Document not found" },
                { status: 404 }
            );
        }

        const updatedDoc = await appendUnitToCookIngredient(parsed.data);

        if (!updatedDoc) {
            return NextResponse.json(
                { error: "Failed to update document" },
                { status: 500 }
            );
        }

        const lastUnit = updatedDoc.units[updatedDoc.units.length - 1];

        return NextResponse.json(
            {
                unit: lastUnit,
                _id: updatedDoc._id,
            },
            { status: 200 }
        );
    } catch (error) {
        console.error(error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}


export async function POST(request: Request) {
    try {
        const body = await request.json();

        const parsed = PostCookIngredientSchema.safeParse(body);

        if (!parsed.success) {
            return NextResponse.json(
                { message: 'Invalid request data' },
                { status: 400 }
            )
        }

        await connectDB();

        const created = await createCookIngredient(parsed.data);

        return NextResponse.json(created, { status: 201 });

    } catch (error) {
        console.error(error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}
