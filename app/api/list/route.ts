import connectDB from "@/app/lib/mongoose";
import ListIngredients from "@/app/models/list";
import { NextResponse } from "next/server";




export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const connection_id = searchParams.get("connection_id");
        const page_list = searchParams.get("page_list");
        const page = Number(page_list);

        if (!connection_id || !page || isNaN(page) || page < 1) {
            return NextResponse.json(
                { message: 'Invalid request data' }, 
                { status: 400 }
            );
        }

        await connectDB();

        const limit = 20;
        const skip = (page - 1) * limit;

        const [result, totalCount] = await Promise.all([
            ListIngredients.find({ connection_id })
                .select("-createdAt -updatedAt -__v -connection_id")
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(limit)
                .lean(),
            ListIngredients.countDocuments({ connection_id })
        ]);

        const hasMore = skip + result.length < totalCount;
        const nextPage = hasMore ? page + 1 : NaN;


        return NextResponse.json({
            status: 200,
            data: {
                connection_id,
                list_ingr: result,
                page_list: nextPage
            },
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
        const { _id } = await request.json();

        if (!_id) {
            return NextResponse.json(
                { message: 'Invalid request data' }, 
                { status: 400 }
            );
        }

        await connectDB();

        const deletedDoc = await ListIngredients.findByIdAndDelete(_id);

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
