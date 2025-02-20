import connectDB from "@/app/lib/mongoose"
import ListIngredients from "@/app/models/list"
import { UnitsList } from "@/app/types/types"
import { NextResponse } from "next/server"







export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const connection_id = searchParams.get('connection_id');
        const name = searchParams.get('name');
        const choice = searchParams.get('choice');

        if (!connection_id || !name) {
            return NextResponse.json({ error: 'Missing required parameters' }, { status: 400 });
        }

        await connectDB();

        const document = await ListIngredients.findOne({ connection_id, name });

        if (!document) {
            return NextResponse.json({
                unit_found: null,
                units: null
            }, { status: 200 });
        }
        

        const unitFound = document.units.some((el: UnitsList) => el.choice === choice);

        return NextResponse.json({
            unit_found: unitFound,
            units: document.units.map((unit: UnitsList) => ({
                choice: unit.choice,
                amount: unit.amount,
                _id: unit._id
            }))
        });

    } catch (error) {
        return NextResponse.json({
            status: 500,
            message: 'Try again after reloading the page'
        });
    }
}

