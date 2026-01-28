import { NextResponse } from "next/server";
import { uploadFileToCloudinary } from "./services";




export async function POST(req: Request) {
    try {
        const formData = await req.formData();
        const fileRaw = formData.get("file");
        if (!(fileRaw instanceof File)) {
            return NextResponse.json({ message: "File is missing or invalid" }, { status: 400 });
        }

        const file = fileRaw;
        const id = formData.get("id") as string;
        const idRecipe = formData.get("idRecipe") as string;
        const media_id = formData.get("media_id") as string;

        if (!file || !id || !idRecipe || !media_id) {
            return NextResponse.json(
                { message: "Invalid request data" }, 
                { status: 400 }
            );
        }

        const public_id = await uploadFileToCloudinary(file, id, idRecipe, media_id);
        return NextResponse.json(public_id);
    } catch (error) {
        console.error(error);
        return NextResponse.json(
            { message: "Internal Server Error" }, 
            { status: 500 }
        );
    }
}
