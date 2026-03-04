import connectDB from "@/app/lib/mongoose";
import { NextResponse } from "next/server";
import { DeleteListSchema, GetListQuerySchema } from "./schema";
import { getListByConnection } from "./services";
import ListIngredients from "@/app/models/list";




export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const rawQuery = {
            connection_id: searchParams.get("connection_id"),
            page_list: searchParams.get("page_list"),
        };

        const parsed = GetListQuerySchema.safeParse(rawQuery);

        if (!parsed.success) {
            return NextResponse.json(
                { message: 'Invalid request data' }, 
                { status: 400 }
            );
        }

        const { connection_id, page_list } = parsed.data;

        await connectDB();

        const result = await getListByConnection({ connection_id, page_list });

        return NextResponse.json({
            status: 200,
            data: result,
        });

    } catch (error) {
        console.error(error);

        return NextResponse.json(
            { error: "An internal error occurred" },
            { status: 500 }
        );
    }
}





export async function DELETE(request: Request) {
    try {
        const body = await request.json();

        const parsed = DeleteListSchema.safeParse(body);

        if (!parsed.success) {
            return NextResponse.json(
                { message: 'Invalid request data' }, 
                { status: 400 }
            );
        }

        const { _id } = parsed.data;

        await connectDB();

        const deletedDoc = await ListIngredients.findByIdAndDelete(_id)

        if (!deletedDoc) {
            return NextResponse.json({ error: 'Document not found' }, { status: 404 });
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