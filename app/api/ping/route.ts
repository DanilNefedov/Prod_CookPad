import { NextResponse } from 'next/server';


export async function GET() {
  console.log('Ping Ping Ping Ping Ping')

  return NextResponse.json({ status: 'ok' });
}