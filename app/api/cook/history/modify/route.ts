import connectDB from "@/app/lib/mongoose";
import { NextResponse } from "next/server";
import { PatchHistoryRecipeNameSchema } from "./schema";
import { updateHistoryRecipeName } from "./services";








export async function PATCH(request: Request) {
    try {
        const body = await request.json();

        const parsed = PatchHistoryRecipeNameSchema.safeParse(body);

        if (!parsed.success) {
            return NextResponse.json(
                { message: 'Invalid request data' },
                { status: 400 }
            );
        }

        const { user_id, recipe_id, name } = parsed.data;

        await connectDB();

        const result = await updateHistoryRecipeName({user_id, recipe_id, name});

        if(!result) {
            return NextResponse.json({ message: "No matching user or recipe found" }, { status: 404 });
        }

        return NextResponse.json({recipe_id, name});

    } catch (error) {
        console.error(error);
        return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
    }
}