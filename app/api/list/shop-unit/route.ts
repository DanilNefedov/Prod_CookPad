import connectDB from "@/app/lib/mongoose";
import { NextResponse } from "next/server";
import { PatchShopUnitSchema } from "./schema";
import { toggleShopUnit } from "./services";







export async function PATCH(request: Request) {
    try {
        const body = await request.json();

        const parsed = PatchShopUnitSchema.safeParse(body);

        if (!parsed.success) {
            return NextResponse.json(
                { message: 'Invalid request data' }, 
                { status: 400 }
            );
        }

        const { ingredient_id, unit_id, shop_unit } = parsed.data;

        await connectDB();

        const updatedDoc = await toggleShopUnit({ ingredient_id, unit_id, shop_unit });

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
