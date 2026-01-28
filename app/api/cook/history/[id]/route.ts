import connectDB from "@/app/lib/mongoose";
import { NextResponse } from "next/server";
import { removeRecipeFromHistory } from "./services";





export async function PATCH(request: Request) {
    try {
        await connectDB();

        const { connection_id, recipe_id } = await request.json();

        if (!connection_id || !recipe_id) {
            return NextResponse.json(
                { message: "Missing required fields" },
                { status: 400 }
            );
        }

        const result = await removeRecipeFromHistory(
            connection_id,
            recipe_id
        );

        switch (result.status) {
            case 'HISTORY_NOT_FOUND':
                return NextResponse.json(
                    { message: "Cook history not found" },
                    { status: 404 }
                );

            case 'ALREADY_REMOVED':
                return NextResponse.json(
                    { message: "Recipe already removed" },
                    { status: 200 }
                );

            case 'REMOVED':
                return NextResponse.json(
                    { message: "Recipe removed successfully" },
                    { status: 200 }
                );
        }

    } catch (error) {
        console.error(error);
        return NextResponse.json(
            { message: "Internal Server Error" },
            { status: 500 }
        );
    }
}
