import { Box } from "@mui/material";
import { mainBoxCook, } from "./[recipe_id]/styles";
import { AlertsProvider } from "@/app/components/ux-helpers/alerts-provider";
import { CookHeaderController } from "@/app/components/cook/cook-header-controller";


export default function RootLayout({ children, }: Readonly<{ children: React.ReactNode; }>) {

    return (
        <AlertsProvider sliceKeys={['cookHistory', 'cook', 'recipe', 'list']}> 
            <Box sx={mainBoxCook}>
                
                <CookHeaderController></CookHeaderController>
                
                {children}
            </Box>
        </AlertsProvider>

    )
}