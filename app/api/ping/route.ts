import { NextResponse } from 'next/server';


export async function GET() {
  console.log('pingpingpingpingpingpingpingpingpingpingpingpingpingpingpingping')

  return NextResponse.json({ status: 'ok' });
}