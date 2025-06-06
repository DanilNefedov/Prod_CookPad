"use server"

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { hash } from "bcryptjs";
import { v4 as uuidv4 } from 'uuid';
import { signIn } from "@/config/auth/auth"



type State = {
  error: string | null
}

export async function handleRegister(prevState: State, formData: FormData): Promise<State> {
    try {
        const email = formData.get("email") as string
        const password = formData.get("password") as string
        const hashedPassword = await hash(password, 10)
        const connection_id = uuidv4()

        const newUserData = {
            name: email.split('@')[0],
            email,
            password: hashedPassword,
            provider: 'credentials',
            connection_id,
            popular_config: [],
            img: '',
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
            return { error: "User already exists" }
        }

        if (!res.ok) {
            return { error: "Registration failed" }
        }

        await signIn("credentials", {
            email,
            password,
            redirect: false,
        })

        return { error: null }
    } catch (e) {
        return { error: "Internal server error" }
    }
}