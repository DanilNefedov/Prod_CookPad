export const runtime = "nodejs";


import connectDB from "@/app/lib/mongoose";
import User from "@/app/models/user";
import { NextResponse } from "next/server"


export async function POST(req: Request) {
  try {
    await connectDB(); 

    const data = await req.json();

    if (!data || !data.email || !data.connection_id) {
      return NextResponse.json(
        { message: 'User data required' },
        { status: 400 }
      );
    }
    console.log(data, '8888888888888888888888')
    await User.create(data);

    return NextResponse.json(
      { message: 'User created successfully' },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json(
      { message: 'An internal error occurred' },
      { status: 500 }
    );
  }
}


export async function GET(request: Request) {
  try {
    await connectDB();
    
    const { searchParams } = new URL(request.url);
    const connection_id = searchParams.get('connection_id');

    if (!connection_id) {
      return NextResponse.json(
        { message: 'connection_id is required' }, 
        { status: 400 }
      );
    }

    const user = await User.findOne({ connection_id }).select('-_id -__v -createdAt -updatedAt');

    if (!user) {
      return NextResponse.json(
        { message: 'User not found' }, 
        { status: 404 }
      );
    }

    return NextResponse.json(user);

  } catch (error) {
    return NextResponse.json(
      { message: 'An internal error occurred' }, 
      { status: 500 }
    );
  }
}
