import connectDB from "@/app/lib/mongoose";
import User from "@/app/models/user";
import { NextResponse } from "next/server";
import { hash } from "bcryptjs";








export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const email = searchParams.get('email');
        const provider = searchParams.get('provider');

        if (!email || !provider || provider !== 'credentials') {
            return NextResponse.json(
                { message: 'Invalid request data' }, 
                { status: 400 }
            );
        }
        
        await connectDB();

        const user = await User.findOne({
            email,
            provider: 'credentials',
        }).select('-__v -createdAt -updatedAt');


        return NextResponse.json({ user: user || null }, { status: 200 });

    } catch (error) {
        console.error(error);
        return NextResponse.json(
            { error: "An internal error occurred" },
            { status: 500 }
        );
    }
}







export async function POST(req: Request) {
    try {
        const data = await req.json();
        
        if (!data.email || !data.provider || data.provider !== 'credentials' || !data.password) {
            return NextResponse.json(
                { message: 'Invalid request data' }, 
                { status: 400 }
            );
        } 
        
        
        await connectDB();

        const existingUser = await User.findOne({ email: data.email, provider: data.provider });

        if (existingUser) {
            return NextResponse.json(
                { message: 'User with this email already exists' },
                { status: 409 }
            );
        }

        const hashedPassword = await hash(data.password, 10);

        const pushNewUser = {
            name:data.name,
            email:data.email,
            password:hashedPassword,
            provider: data.provider,
            connection_id:data.connection_id,
            popular_config: data.popular_config,
            img: data.img,
        }

        const newUser = await User.create(pushNewUser)
        return NextResponse.json(newUser, { status: 200 });

    } catch (error) {
        console.error(error);
        return NextResponse.json(
            { error: "An internal error occurred" },
            { status: 500 }
        );
    }
}
