import connectDB from "@/app/lib/mongoose";
import ListIngredients from "@/app/models/list";
import { NextResponse } from "next/server";





export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const connection_id = searchParams.get("connection_id");

        if (!connection_id) {
            return NextResponse.json({
                message: "The input data is incorrect",
            }, { status: 400 })
        }

        await connectDB();

        const result = await ListIngredients.find({ connection_id })
            .select("-createdAt -updatedAt -__v -connection_id")  
            .sort({ createdAt: -1 })  
            .limit(15)
            .lean(); 

        return NextResponse.json({
            status: 200,
            data: {
                connection_id,
                list_ingr: result,
            },
        });

    } catch (error) {
        console.error("Error fetching ingredients:", error);

        return NextResponse.json({
            status: 500,
            message: "Internal Server Error",
            error: error instanceof Error ? error.message : error,
        });
    }
}





export async function DELETE(request: Request) {
    try {
        const { _id } = await request.json();

        if (!_id) {
            return NextResponse.json({ error: 'Missing _id parameter' }, { status: 400 });
        }

        await connectDB();

        const deletedDoc = await ListIngredients.findByIdAndDelete(_id);

        if (!deletedDoc) {
            return NextResponse.json({ error: 'Document not found' }, { status: 404 });
        }

        return NextResponse.json({}, { status: 200 });

    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: 'Failed to delete document' }, { status: 500 });
    }
}
