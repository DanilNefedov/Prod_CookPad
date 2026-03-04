import connectDB from "@/app/lib/mongoose";
import { NextResponse } from "next/server";
import { processCreateIngredients } from "./services";
import { PatchCreateIngredientsSchema } from "./schema";




export async function PATCH(request: Request) {
    try {
        const body = await request.json();

        const parsed = PatchCreateIngredientsSchema.safeParse(body);

        if (!parsed.success) {
            return NextResponse.json(
                { message: 'Invalid request data' },
                { status: 400 }
            );
        }

        const { connection_id, data } = parsed.data;

        await connectDB();

        const { results, notFound } = await processCreateIngredients({ connection_id, data });

        return NextResponse.json({
            results,
            notFound,
        },
            { status: notFound.length > 0 ? 207 : 200 }
        );

    } catch (error) {
        console.error(error);
        return NextResponse.json(
            { error: "An internal error occurred" },
            { status: 500 }
        );
    }
}

