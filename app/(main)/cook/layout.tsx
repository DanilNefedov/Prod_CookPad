import { Box } from "@mui/material";
import { mainBoxCook, } from "./styles";
import { AlertsProvider } from "@/app/components/ui-helpers/AlertsProvider";
import { CookHeaderController } from "@/app/components/cook/CookHeaderController";
import React, { use } from "react";
import { auth } from "@/config/auth/auth";



export default function RootLayout({ children }: Readonly<{ children: React.ReactNode; }>)  {
    const session = use(auth())

    console.log(session?.user.connection_id)


    return (
        <AlertsProvider sliceKeys={['cookHistory', 'cook', 'recipe', 'list', 'listRecipe']}> 
            
            <Box sx={mainBoxCook}>
                <CookHeaderController></CookHeaderController>
                {children}
            </Box>

        </AlertsProvider>

    )
}