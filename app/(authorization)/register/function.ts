"use server"

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { hash } from "bcryptjs";
import { v4 as uuidv4 } from 'uuid';
import { signIn } from "@/config/auth/auth"
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
import { storage } from "@/firebase";



type State = {
    error: {
        name?: true;
        email?: true;
        post?:true;
        password?: true;
        avatar?: true;
        server?: true;
    } | null;
};



interface DataType {
    connection_id:string,
    image: File
}

async function uploadFile(data: DataType): Promise<string> {
    const { connection_id, image } = data;

    try {
        const blob = image;
        
        const storageRef = ref(storage, `avatar/${connection_id}/${connection_id}`);//folder -> folder -> file
        const uploadTask = uploadBytesResumable(storageRef, blob);
        
        
        
        return new Promise((resolve, reject) => {
            uploadTask.on(
                'state_changed',
                (snapshot) => {
                    const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                    console.log('Upload is ' + progress + '% done');
                },
                (error) => {
                    console.error('Upload failed:', error);
                    reject(new Error(`Upload failed: ${error.message || 'Unknown error'}`));
                },
                async () => {
                    try {
                        const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
                        resolve(downloadURL);
                    } catch (error) {
                        console.error('Error getting download URL:', error);
                        reject(new Error(`Failed to get download URL: ${error instanceof Error ? error.message : 'Unknown error'}`));
                    }
                }
            );
            
            setTimeout(() => {
                reject(new Error('Upload timed out. Please check your network connection.'));
            }, 60000); // 60s. timeout
        });
    } catch (error) {
        console.error('Error in uploadFile:', error);
        throw new Error(`Media upload failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
}



export async function handleRegister(prevState: State, formData: FormData): Promise<State> {
    try {
        const email = formData.get("email") as string
        const password = formData.get("password") as string
        const name = formData.get('name') as string
        const image = formData.get('image') as File | null
        const errors: State["error"] = {};

        const connection_id = uuidv4()
        let resImage 

        if (image instanceof File && image.size > 0) {
            try {
                const avatar = await uploadFile({ image, connection_id });
                resImage = avatar
            } catch (uploadError) {
                console.error("Upload error:", uploadError);
                errors.avatar = true;
            }
        }        

        if (!password || !/^(?=.*[A-Z])(?=.*\d)[A-Za-z\d]{4,8}$/.test(password)) {
            errors.password = true;
        }

        if (!name || !/^[A-Za-z0-9 ]{1,15}$/.test(name.trim())) {
            errors.name = true;
        }

        if (Object.keys(errors).length > 0) {
            return { error: errors };
        }

        const newUserData = {
            name,
            email,
            password,
            provider: 'credentials',
            connection_id,
            popular_config: [],
            img: resImage,
        }

        const res = await fetch("http://localhost:3000/api/user/credentials", {
            method: "POST",
            headers: { 
                "Content-Type": "application/json" 
            },
            body: JSON.stringify(newUserData),
        })

        console.log(res)
        if (res.status === 409) {
            return { error: { email: true } };
        }

        if (!res.ok) {
            return { error: { post: true } };
        }

        await signIn("credentials", {
            email,
            password,
            redirect: false,
        })

        return { error: null };
    } catch (e) {
        return { error: { server: true } };
    }
}