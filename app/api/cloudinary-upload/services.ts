import { getCloudinary } from "@/app/lib/cloudinary";
import { UploadApiResponse } from "cloudinary";





export async function uploadFileToCloudinary(
    file: File,
    user_id: string,
    recipe_id: string,
    media_id: string
): Promise<string> {
    const cloudinary = getCloudinary();
    const folder = `recipes/${user_id}/${recipe_id}`;

    // Working with very large files.
    // You can use stream directly instead of a full buffer.
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const resourceType: "image" | "video" = file.type?.startsWith("video/") ? "video" : "image";

    const uploaded = await new Promise<UploadApiResponse>((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
            { folder, public_id: media_id, resource_type: resourceType, quality_analysis: true },
            (err, res) => {
                if (err) reject(err);
                else resolve(res as UploadApiResponse);
            }
        );
        stream.end(buffer);
    });

    return uploaded.public_id;
}