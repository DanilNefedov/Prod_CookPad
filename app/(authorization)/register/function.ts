"use server"

import { signIn } from "@/config/auth/auth"
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
import { storage } from "@/firebase";
import { RegisterFormData, RegisterResult, UploadFileParams } from "../types";




export async function uploadFile({ connection_id, image }: UploadFileParams): Promise<string> {
    try {
       
        const blob = image;
        
        const storageRef = ref(storage, `avatar/${connection_id}/${connection_id}`);//folder -> folder -> file
        const uploadTask = uploadBytesResumable(storageRef, blob);
        
        
        
        return new Promise((resolve, reject) => {
            uploadTask.on(
                'state_changed',
                () => { //snapshot
                    // const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                    // console.log('Upload is ' + progress + '% done');
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



export async function handleRegister(formData: RegisterFormData): Promise<RegisterResult> {
    "use server"
    try {
        const { email, image, name, password, connection_id} = formData

        const newUserData = {
            name,
            email,
            password,
            provider: 'credentials',
            connection_id,
            popular_config: [],
            img: image,
        }

        const responseUser = await fetch(`${process.env.APP_MAIN_URL}/api/user/credentials`, {
            method: "POST",
            headers: { 
                "Content-Type": "application/json" 
            },
            body: JSON.stringify(newUserData),
        })

        if (responseUser.status === 409) {
            return { error: { email: true } };
        }

        if (!responseUser.ok) {
            return { error: { post: true } };
        }

        const responseHistory = await fetch(`${process.env.APP_MAIN_URL}/api/cook/history`, {
            method: "POST",
            headers: { 
                "Content-Type": "application/json" 
            },
            body: JSON.stringify({
                connection_id:connection_id,
                history_links:[]
            }),
        })

        if (!responseHistory.ok) {
            console.log('history error')
            return { error: { server: true } };
        }
       
        return { error:null };
    } catch (e) {
        console.log(e)
        return { error: { server: true } };
    }
}


export async function registerAndSignIn(_prevState: RegisterResult, formData: RegisterFormData): Promise<RegisterResult> {
    'use server'
    const { email, password } = formData

    const result = await handleRegister(formData);  
    if (result.error) return result;

    console.log({ result, email, password })
    await signIn("credentials", {
        email,
        password,
        redirectTo: "/home",
    });

    return { error: null };
}