import connectDB from "@/app/lib/mongoose";
import ListIngredients from "@/app/models/list";
import { NextResponse } from "next/server";





export async function PATCH(request: Request) {
    try{
        const { name, connection_id, _id, amount } = await request.json();

        if (!connection_id || !name || !amount || !_id ) {
            return NextResponse.json(
                { message: 'Invalid request data' },
                { status: 400 }
            );
        }

        await connectDB();

        const updatedDoc = await ListIngredients.findOneAndUpdate(
            {
                connection_id, 
                name, 
                "units._id": _id 
            },
            {
                $set: {
                    "units.$.amount": amount 
                }
            },
            { new: true } 
        );

        if (!updatedDoc) {
            return NextResponse.json({ error: 'Document not found' }, { status: 404 });
        }

        return NextResponse.json({}, { status: 200 });

    }catch(error){
        console.error(error)
        return NextResponse.json(
            { error: "An internal error occurred" },
            { status: 500 }
        );
    }
}

