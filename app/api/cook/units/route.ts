import { UnitsId } from "@/app/(main)/(main-list)/list/types";
import connectDB from "@/app/lib/mongoose"
import ListIngredients from "@/app/models/list"
import { NextResponse } from "next/server"







export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const connection_id = searchParams.get('connection_id');
        const name = searchParams.get('name');
        const choice = searchParams.get('choice');

        if (!connection_id || !name) {
            return NextResponse.json(
                { message: 'Invalid request data' },
                { status: 400 }
            );
        }

        await connectDB();

        const document = await ListIngredients.findOne({ connection_id, name });

        if (!document) {
            return NextResponse.json({
                unit_found: null,
                units: null
            }, { status: 200 });
        }
        

        const unitFound = document.units.some((el: UnitsId) => el.choice === choice);

        return NextResponse.json({
            unit_found: unitFound,
            units: document.units.map((unit: UnitsId) => ({
                choice: unit.choice,
                amount: unit.amount,
                _id: unit._id
            }))
        });

    } catch (error) {
        console.error(error)
         return NextResponse.json(
            { error: "An internal error occurred" },
            { status: 500 }
        );
    }
}

