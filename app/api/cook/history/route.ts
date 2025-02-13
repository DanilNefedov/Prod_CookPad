


import connectDB from "@/app/lib/mongoose";
import CookHistory from "@/app/models/cook-history";
import Recipe from "@/app/models/recipe";
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
        const connection_id = searchParams.get('connection_id')
        const recipe_id = searchParams.get('recipe_id')
        
        const cook = await CookHistory.findOne({connection_id }).select('-_id connection_id history_links.recipe_id history_links.recipe_name')

        if (!cook) {
            return NextResponse.json({
                status: 404,
                body: { message: 'History Cook not found' },
            });
        }

        const exists = cook.history_links.some((link: any) => link.recipe_id === recipe_id);
        if(!exists){
            const dataCook = await Recipe.findOne({ recipe_id, connection_id })
            .select('-_id name recipe_id')
            .lean();

            return NextResponse.json({cook, newCook:dataCook})

        }
        

        return NextResponse.json({cook, newCook:null})

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
