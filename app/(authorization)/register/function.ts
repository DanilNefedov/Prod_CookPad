"use server"

import { signIn } from "@/config/auth/auth"
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
import { storage } from "@/firebase";


type State = {
    error: {
        server?: boolean;
        email?: boolean;
        post?: boolean;
    } | null
};



interface DataType {
    connection_id:string,
    image: File
}

export async function uploadFile(data: DataType): Promise<string> {
    const { connection_id, image } = data;

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

interface ServerFormData {
    email:string,
    password:string,
    name:string,
    image: string, 
    connection_id:string
};

export async function handleRegister(formData: ServerFormData): Promise<State>{
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

        const res = await fetch(`${process.env.APP_MAIN_URL}/api/user/credentials`, {
            method: "POST",
            headers: { 
                "Content-Type": "application/json" 
            },
            body: JSON.stringify(newUserData),
        })

        if (res.status === 409) {
            return { error: { email: true } };
        }

        if (!res.ok) {
            return { error: { post: true } };
        }

        return { error:null };
    } catch (e) {
        console.log(e)
        return { error: { server: true } };
    }
}


export async function registerAndSignIn(prevState: State, formData: ServerFormData): Promise<State> {
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