import connectDB from "@/app/lib/mongoose";
import CookHistory from "@/app/models/cook-history";
import { NextResponse } from "next/server";




export async function PATCH(request: Request) {
    try {
        await connectDB();

        const data = await request.json();
        const { connection_id, recipe_id } = data;

        if (!connection_id || !recipe_id) {
            return NextResponse.json({ message: "Missing required fields" }, { status: 400 });
        }

        const filter = { connection_id };
        const update = {
            $pull: { history_links: { recipe_id } },
        };

        const result = await CookHistory.updateOne(filter, update);

        if (result.modifiedCount === 0) {
            return NextResponse.json({ message: "Recipe not found or already removed" }, { status: 404 });
        }

        return NextResponse.json({ message: "Recipe removed successfully" }, { status: 200 });

    } catch (error) {
        console.error(error);
        return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
    }
}