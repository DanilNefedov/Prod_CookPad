import connectDB from "@/app/lib/mongoose";
import { NextResponse } from "next/server";
import { PatchCookAmountSchema } from "./schema";
import { updateCookAmount } from "./services";





export async function PATCH(request: Request) {
    try{
        const body = await request.json();

        const parsed = PatchCookAmountSchema.safeParse(body);

        if (!parsed.success) {
            return NextResponse.json(
                { message: 'Invalid request data' },
                { status: 400 }
            );
        }

        const { name, connection_id, _id, amount } = parsed.data;

        await connectDB();

        const updatedDoc = await updateCookAmount({ name, connection_id, _id, amount });

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

