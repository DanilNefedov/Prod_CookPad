import connectDB from "@/app/lib/mongoose";
import CookHistory from "@/app/models/cook-history";
import { NextResponse } from "next/server";








export async function PATCH(request: Request) {
    try {
        await connectDB();

        const data = await request.json();
        const { user_id, recipe_id, name } = data;

        if (!user_id || !recipe_id || !name ) {
            return NextResponse.json({ message: "Missing required fields" }, { status: 400 });
        }

        const result = await CookHistory.updateOne(
            { connection_id: user_id },
            { $set: { "history_links.$[elem].recipe_name": name } },
            { arrayFilters: [{ "elem.recipe_id": recipe_id }] }
        );

        if (result.matchedCount === 0) {
            return NextResponse.json({ message: "No matching user or recipe found" }, { status: 404 });
        }

    

        return NextResponse.json({recipe_id, name});

    } catch (error) {
        console.error(error);
        return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
    }
}