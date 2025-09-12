



import { Box } from "@mui/material";
import { mainBoxCook, } from "./styles";
import { AlertsProvider } from "@/app/components/ui-helpers/AlertsProvider";
import { CookHeaderController } from "@/app/components/cook/CookHeaderController";


export default function RootLayout({ children, }: Readonly<{ children: React.ReactNode; }>) {

    return (
        <AlertsProvider sliceKeys={['cookHistory', 'cook', 'recipe', 'list', 'listRecipe']}> 
            
            <Box sx={mainBoxCook}>
                <CookHeaderController></CookHeaderController>
                {children}
            </Box>

        </AlertsProvider>

    )
}