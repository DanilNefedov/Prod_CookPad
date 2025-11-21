import connectDB from "@/app/lib/mongoose";
import Category from "@/app/models/category";
import { NextResponse } from "next/server";




export async function POST(req: Request) {
    try {
        const data = await req.json();

        if (!Array.isArray(data) || data.length === 0) {
            return NextResponse.json(
                { message: "Invalid request data" },
                { status: 400 }
            );
        }

        await connectDB();

        const results = [];

        for (const rawSlug of data) {
            const slug = rawSlug.trim().toLowerCase();
            if (!slug) continue;

            const doc = await Category.findOneAndUpdate(
                { slug },
                {
                    $inc: { popularity: 1 },
                    $setOnInsert: {
                        name: rawSlug,
                        slug: slug,
                    },
                },
                { new: true, upsert: true }
            );

            results.push(doc._id);
        }

        return NextResponse.json(results);

    } catch (error) {
        console.error(error);
        return NextResponse.json(
            { message: "An internal error occurred" },
            { status: 500 }
        );
    }
}

