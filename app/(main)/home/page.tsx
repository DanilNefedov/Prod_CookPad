import { auth, signOut } from "@/config/auth/auth"
import { redirect } from "next/navigation"

export default async function Main() {
    
    return (
        <div className="">Home
        
        <form
              action={async () => {
                "use server"
                await signOut({ redirectTo: '/login' })
              }}
            >
              <button type="submit">Signin with Google</button>
            </form>
        </div>
    )
}