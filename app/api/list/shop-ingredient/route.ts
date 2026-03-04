import connectDB from "@/app/lib/mongoose";
import { NextResponse } from "next/server";
import { PatchShopIngredientSchema } from "./schema";
import { toggleShopIngredient } from "./services";








export async function PATCH(request: Request) {
    try {
        const body = await request.json();

        const parsed = PatchShopIngredientSchema.safeParse(body);

        if (!parsed.success) {
            return NextResponse.json(
                { message: 'Invalid request data' }, 
                { status: 400 }
            );
        }

        const { _id, shop_ingr } = parsed.data;

        await connectDB();

        const updatedDoc = await toggleShopIngredient({ _id, shop_ingr });

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
