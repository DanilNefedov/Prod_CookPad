import connectDB from "@/app/lib/mongoose";
import CookHistory from "@/app/models/cook-history";
import { NextResponse } from "next/server";
import { addRecipeToCookHistory, getCookHistoryWithRecipe } from "./services";
import { GetCookHistoryQuerySchema, PatchRecipeToHistorySchema, PostCookHistorySchema } from "./schema";






export async function POST(req: Request) {
    try {
        const body = await req.json();

        const parsed = PostCookHistorySchema.safeParse(body);

        if (!parsed.success) {
            return NextResponse.json(
                { message: 'Invalid request data' },
                { status: 400 }
            );
        }

        await connectDB();
        
        const newHistory = new CookHistory({
            connection_id: parsed.data.connection_id,
            history_links: [],
        });

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
        const { searchParams } = new URL(request.url);

        const queryObject = {
            connection_id: searchParams.get("connection_id"),
            recipe_id: searchParams.get("recipe_id"),
        };

        const parsed = GetCookHistoryQuerySchema.safeParse(queryObject);

        if (!parsed.success) {
            return NextResponse.json(
                { message: 'Invalid request data' },
                { status: 400 }
            );
        }

        const { connection_id, recipe_id } = parsed.data;
        
        await connectDB();

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

        const body = await request.json();

        const parsed = PatchRecipeToHistorySchema.safeParse(body);

        if (!parsed.success) {
            return NextResponse.json(
                { message: 'Invalid request data' },
                { status: 400 }
            );
        }

        const { connection_id, history_links } = parsed.data;

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