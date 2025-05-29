import connectDB from "@/app/lib/mongoose";
import User from "@/app/models/user";
import { NextResponse } from "next/server"


export async function POST(req: Request) {
  try {
    await connectDB(); 

    const data = await req.json();

    if (!data || !data.email || !data.connection_id) {
      return NextResponse.json(
        { message: 'Invalid request data' },
        { status: 400 }
      );
    }
    await User.create(data);

    return NextResponse.json(
      { message: 'User created successfully' },
      { status: 201 }
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "An internal error occurred" },
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
        { message: 'Invalid request data' }, 
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
    console.error(error);
    return NextResponse.json(
      { error: "An internal error occurred" },
      { status: 500 }
    );
  }
}
