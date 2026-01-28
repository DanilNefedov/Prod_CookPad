import connectDB from "@/app/lib/mongoose";
import CookHistory from "@/app/models/cook-history";
import { NextResponse } from "next/server";
import { addRecipeToCookHistory, getCookHistoryWithRecipe } from "./services";






export async function POST(req: Request) {
    try {
        await connectDB();

        const data = await req.json();

        const newHistory = new CookHistory(data);
        await newHistory.save();

        return NextResponse.json({ data: newHistory });

    } catch (error) {
        console.error(error)
        return NextResponse.json(
            { message: 'Internal Server Error' },
            { status: 500 }
        );
    }
}


export async function GET(request: Request) {
    try {
        await connectDB();

        const { searchParams } = new URL(request.url);
        const connection_id = searchParams.get('connection_id');
        const recipe_id = searchParams.get('recipe_id');

        if (!connection_id || !recipe_id) {
            return NextResponse.json(
                { message: 'Invalid request data' },
                { status: 400 }
            );
        }

        const result = await getCookHistoryWithRecipe(
            connection_id,
            recipe_id
        );

        if (!result) {
            return NextResponse.json(
                { message: 'History Cook not found' },
                { status: 404 }
            );
        }

        return NextResponse.json(result);

    } catch (error) {
        console.error(error);
        return NextResponse.json(
            { error: "An internal error occurred" },
            { status: 500 }
        );
    }
}


export async function PATCH(request: Request) {
    try {
        await connectDB();

        const { connection_id, history_links } = await request.json();

        if (!connection_id || !history_links?.recipe_id) {
            return NextResponse.json(
                { message: 'Invalid request data' },
                { status: 400 }
            );
        }

        const result = await addRecipeToCookHistory(
            connection_id,
            history_links
        );

        switch (result.status) {
            case 'NOT_FOUND':
                return NextResponse.json(
                    { message: 'Cook history not found' },
                    { status: 404 }
                );

            case 'ALREADY_EXISTS':
                return NextResponse.json(
                    { message: 'Recipe link already exists' },
                    { status: 200 }
                );

            case 'ADDED':
                return NextResponse.json(
                    { message: 'Recipe link added successfully' },
                    { status: 200 }
                );
        }

    } catch (error) {
        console.error(error);
        return NextResponse.json(
            { error: 'An internal error occurred' },
            { status: 500 }
        );
    }
}