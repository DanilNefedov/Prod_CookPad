import connectDB from "@/app/lib/mongoose";
import User from "@/app/models/user";
import { NextResponse } from "next/server";






export async function GET(request: Request) {
    try {
        await connectDB();
        
        const { searchParams } = new URL(request.url);
        const email = searchParams.get('email');
        const provider = searchParams.get('provider');

        console.log(email, provider)
        if (!email || !provider || provider !== 'credentials') {
            return NextResponse.json(
                { message: 'Invalid request data' }, 
                { status: 400 }
            );
        }

        const user = await User.findOne({
            email,
            provider: 'credentials',
        }).select('-_id -__v -createdAt -updatedAt');

        
        return NextResponse.json({ user: user || null }, { status: 200 });

    } catch (error) {
        console.error(error);
        return NextResponse.json(
            { error: "An internal error occurred" },
            { status: 500 }
        );
    }
}
