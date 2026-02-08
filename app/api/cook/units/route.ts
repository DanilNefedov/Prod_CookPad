import connectDB from "@/app/lib/mongoose"
import { NextResponse } from "next/server"
import { GetUnitsQuerySchema } from "./schema";
import { getIngredientUnits } from "./services";







export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);

        const rawQuery = {
            connection_id: searchParams.get('connection_id'),
            name: searchParams.get('name'),
            choice: searchParams.get('choice'),
        };

        const parsed = GetUnitsQuerySchema.safeParse(rawQuery);

        if (!parsed.success) {
            return NextResponse.json(
                { message: 'Invalid request data'},
                { status: 400 }
            );
        }

        await connectDB();

        const result = await getIngredientUnits(parsed.data);

        return NextResponse.json(result);
    } catch (error) {
        console.error(error)
        return NextResponse.json(
            { error: "An internal error occurred" },
            { status: 500 }
        );
    }
}

