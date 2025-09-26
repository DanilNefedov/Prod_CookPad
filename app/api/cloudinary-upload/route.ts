import { getCloudinary } from "@/app/lib/cloudinary";
import { UploadApiResponse } from "cloudinary";
import { NextResponse } from "next/server";






export async function POST(req: Request) {

    try {
        const cloudinary = getCloudinary()

        const formData = await req.formData();

        const file = formData.get("file") as File;
        const id = formData.get("id") as string;
        const idRecipe = formData.get("idRecipe") as string;
        const media_id = formData.get("media_id") as string;

        if (!file || !id || !idRecipe || !media_id) {
            return NextResponse.json({ message: "Invalid request data" }, { status: 400 });
        }

        const folder = `recipes/${id}/${idRecipe}`;

        const arrayBuffer = await file.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);

        const uploaded = await new Promise<UploadApiResponse>((resolve, reject) => {
            const uploadStream = cloudinary.uploader.upload_stream(
                {
                    folder,
                    public_id: media_id,
                    quality_analysis: true,
                    resource_type: file.type.startsWith('video/') ? 'video' : 'image',
                },
                (error, result) => {
                    if (error) reject(error);
                    else resolve(result as UploadApiResponse);
                }
            );

            uploadStream.end(buffer);
        });

        const { public_id } = uploaded;

        
        return NextResponse.json(public_id);


    } catch (error) {
        console.error(error)
        return NextResponse.json(
            { message: 'Internal Server Error' },
            { status: 500 }
        );
    }
}