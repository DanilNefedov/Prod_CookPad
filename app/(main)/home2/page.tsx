import { auth, signOut } from "@/config/auth/auth"
import { redirect } from "next/navigation"

export default async function Main() {
    // const session = await auth()
    // if(!session) return redirect("/login")

    return (
        <div className="">Home2
        
        
        <form
              action={async () => {
                "use server"
                await signOut()
              }}
            >
              <button type="submit">Signin with Google</button>
            </form>
        </div>
    )
}