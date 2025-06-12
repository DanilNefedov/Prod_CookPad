'use server'

import { signIn } from "@/config/auth/auth";


export type State = {
    error: boolean;
    email: string;
    success?: boolean;
};


export async function signInCall(prevState: State, formData: FormData): Promise<State> {
    'use server'
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    try {
        const res = await signIn("credentials", {
            email,
            password,
            redirect: false,
        });

        if (!res || res.error) {
            return { error: true, email, success: false };
        }

        return { error: false, email: '', success: true };
    } catch (e) {
        console.log(e);
        return { error: true, email, success: false };
    }
}

