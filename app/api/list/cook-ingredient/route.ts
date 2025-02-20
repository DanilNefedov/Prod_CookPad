import connectDB from "@/app/lib/mongoose";
import ListIngredients from "@/app/models/list";
import { NextResponse } from "next/server";





export async function PATCH(request: Request) {
    try {
        const dataUnit = await request.json();
        const { connection_id, name, units } = dataUnit;

        if (!connection_id || !name || !units ) {
            return NextResponse.json({ error: 'Missing or invalid required parameters' }, { status: 400 });
        }

        await connectDB();

        const document = await ListIngredients.findOne({ connection_id, name });

        if (!document) {
            return Response.json({ error: 'Document not found' }, { status: 404 });
        }

        const updatedDoc = await ListIngredients.findOneAndUpdate(
            { connection_id, name:name.trim() },
            { 
                $push: { units: units } 
            },
            { new: true } 
        );        

        return NextResponse.json({}, { status: 204 });

    } catch (error) {
        console.log(error)
        return NextResponse.json({
            status: 500,
            message: 'Failed to update document'
        });
    }
}




export async function POST(request: Request) {
    try{
        const dataUnit = await request.json();
        
        if (!dataUnit.connection_id || !dataUnit.name) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }
        
        await connectDB();

        const newIngredient = new ListIngredients(dataUnit);
        await newIngredient.save();

        return NextResponse.json({ message: 'Document created', data: newIngredient }, { status: 201 });

    }catch(error){
        console.error(error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });

    }

}