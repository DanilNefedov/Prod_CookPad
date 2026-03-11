import connectDB from "@/app/lib/mongoose";
import { NextResponse } from "next/server";
import { PatchShopUnitSchema } from "./schema";
import { extractUpdatedShopUnit, toggleRecipeUnitShop } from "./services";








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

        const { ingredient_id, connection_id, _id, unit_id, shop_unit } = parsed.data;

        await connectDB();

        const updatedDocument = await toggleRecipeUnitShop({
            ingredient_id,
            connection_id,
            _id,
            unit_id,
            shop_unit,
        });

        const { updatedUnit, error } = extractUpdatedShopUnit(
            updatedDocument,
            ingredient_id,
            unit_id
        );

        if (error) {
            return NextResponse.json(
                {
                    message:
                        error === "UPDATED_DOC_INVALID"
                            ? "Updated document not found or has incorrect structure"
                            : "Ingredient not found or has no units",
                },
                { status: 404 }
            );
        }

        return NextResponse.json({
            ingredient_id,
            connection_id,
            _id,
            unit_id,
            shop_unit: updatedUnit?.shop_unit
        });
        

    }catch(error){
        console.error(error);
        return NextResponse.json(
            { error: "An internal error occurred" },
            { status: 500 }
        );
    }
}
