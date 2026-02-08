import { NextResponse } from "next/server";
import { uploadFileToCloudinary } from "./services";
import { PostRecipeMediaSchema } from "./schema";




export async function POST(req: Request) {
    try {
        const formData = await req.formData();

        const raw = {
            file: formData.get('file'),
            user_id: formData.get('user_id'),
            recipe_id: formData.get('recipe_id'),
            media_id: formData.get('media_id'),
        };

        const parsed = PostRecipeMediaSchema.safeParse(raw);
        console.log(parsed)
        if (!parsed.success) {
            return NextResponse.json(
                {message: 'Invalid request data',
                    data:parsed
                },
                { status: 400 }
            );
        }

        const { file, user_id, recipe_id, media_id } = parsed.data;

        const public_id = await uploadFileToCloudinary(file, user_id, recipe_id, media_id);
        return NextResponse.json(public_id);
    } catch (error) {
        console.error(error);
        return NextResponse.json(
            { message: "Internal Server Error" },
            { status: 500 }
        );
    }
}


