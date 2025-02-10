export const runtime = "nodejs";



import connectDB from "@/app/lib/mongoose";
import CookHistory from "@/app/models/cook-history";
import { NextResponse } from "next/server";







export async function POST(req: Request) {
    try {
        await connectDB();

        const data = await req.json();

        const newHistory = new CookHistory(data);
        await newHistory.save();

        return NextResponse.json({
            status: 201,
            message: "Document created successfully",
            data: newHistory
        });

    } catch (error) {
        return NextResponse.json({
            status: 500,
            message: "Internal Server Error",
            error: error
        });
    }
}




export async function GET(request: Request) {
    try {
        await connectDB();

        const { searchParams } = new URL(request.url)
        const connection_id = searchParams.get('connection_id') as string
        console.log(connection_id, 'connection_idconnection_idconnection_idconnection_id')
        const cook = await CookHistory.findOne({connection_id }).select('-_id connection_id history_links')


        if (!cook) {
            return NextResponse.json({
                status: 404,
                body: { message: 'History Cook not found' },
            });
        }
        console.log(cook, '3333333333333333333333333333333')
        return NextResponse.json(cook)

    } catch (error) {
        return NextResponse.json({
            status: 500,
            body: { message: 'Internal Server Error', error: error },
        });
    }
}




export async function PATCH(request: Request) {
    try {
        await connectDB();

        const data = await request.json();
        const { connection_id, history_links } = data;

        console.log(history_links, 'history_linkshistory_linkshistory_linkshistory_linkshistory_links')
        const filter = {
            connection_id,
            'history_links.recipe_id': { $ne: history_links.recipe_id }
        };

        const update = {
            $push: {
                history_links: history_links,
            },
        };

        const updatedCook = await CookHistory.updateOne(filter, update);

        if (updatedCook.matchedCount > 0 && updatedCook.modifiedCount > 0) {
            return NextResponse.json({
                status: 201,
                message: 'Recipe link added successfully',
            });
        } else {
            return NextResponse.json({
                status: 200,
                message: 'Recipe link already exists, no changes made',
            });
        }
    } catch (error) {
        return NextResponse.json({
            status: 500,
            body: { message: 'Internal Server Error', error: error },
        });
    }
}
