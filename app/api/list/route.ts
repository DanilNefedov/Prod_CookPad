import connectDB from "@/app/lib/mongoose";
import ListIngredients from "@/app/models/list";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const connection_id = searchParams.get("connection_id");

        if (!connection_id) {
            return NextResponse.json({
                status: 400,
                message: "The input data is incorrect",
            });
        }

        await connectDB();

        const result = await ListIngredients.find({ connection_id })
            .select("-createdAt -updatedAt -__v")  
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
