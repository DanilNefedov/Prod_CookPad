import { MainContent } from "@/app/components/home/content/main-content"
import { NavigationProvider } from "@/app/components/home/context-navigation"
import Header from "@/app/components/home/header/header"
import { auth, signOut } from "@/config/auth/auth"
import { redirect } from "next/navigation"

export default async function Main() {
    
    return (
      <NavigationProvider>
        <Header></Header>
        <MainContent></MainContent>        
      </NavigationProvider>
    )
}