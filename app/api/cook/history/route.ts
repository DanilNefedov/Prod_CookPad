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

        return NextResponse.json({data: newHistory});

    } catch (error) {
        console.error(error)
        return NextResponse.json(
            { message: 'Internal Server Error' },
            { status: 500 }
        );
    }
}

interface linkT {
    recipe_id:string
    recipe_name:string
    _id:string
}


export async function GET(request: Request) {
    try {
        await connectDB();

        const { searchParams } = new URL(request.url)
        const connection_id = searchParams.get('connection_id')
        const recipe_id = searchParams.get('recipe_id')

        if (!connection_id || !recipe_id) {
            return NextResponse.json(
                { message: 'Invalid request data' },
                { status: 400 }
            );
        }
        
        const cook = await CookHistory.findOne({connection_id }).select('-_id connection_id history_links.recipe_id history_links.recipe_name')

        if (!cook) {
            return NextResponse.json(
                { message: 'History Cook not found' }, 
                { status: 404 }
            );
            
        }

        const exists = cook.history_links.some((link: linkT) => link.recipe_id === recipe_id);

        if(!exists){
            const dataCook = await Recipe.findOne({ recipe_id, connection_id })
            .select('-_id name recipe_id')
            .lean();

            return NextResponse.json({cook, newCook:dataCook})
        }
        

        return NextResponse.json({cook, newCook:null})

    } catch (error) {
        console.error(error)
        return NextResponse.json(
            { error: "An internal error occurred" },
            { status: 500 }
        );
    }
}




export async function PATCH(request: Request) {
    try {
        await connectDB();

        const data = await request.json();
        const { connection_id, history_links } = data;

        if (!connection_id || !history_links) {
            return NextResponse.json(
                { message: 'Invalid request data' },
                { status: 400 }
            );
        }

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
            return NextResponse.json(
                { message: 'Recipe link added successfully' },
                { status: 200 } 
            );
        } else {
            return NextResponse.json(
                { message: 'Recipe link already exists, no changes made' },
                { status: 200 } 
            );
        }

        
    } catch (error) {
        console.error(error)
        return NextResponse.json(
            { error: "An internal error occurred" },
            { status: 500 }
        );
    }
}
