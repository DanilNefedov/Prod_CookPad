'use server'

import { signIn } from "@/config/auth/auth";

type State = {
    error:boolean;
    email:string 
};



export async function signInCall(prevState: State, formData: FormData): Promise<State> {
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    try{
        const res = await signIn("credentials", {
            email,
            password,
            redirectTo: "/home",
        });


        if (res === null) {
            return { error: true, email } 
        }

        return { error: false, email:'' };
    }catch(e) {
        console.log(e)
        return { error: true, email };
    }
    

    // return { error: false };
}

