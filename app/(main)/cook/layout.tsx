import { HeaderCook } from "@/app/components/cook/header-cook";
import { Box } from "@mui/material";
import { headerCook, mainBoxCook, scrollBox } from "./[recipe_id]/styles";
import { AdaptiveHeader } from "@/app/components/cook/adaptive-header";
import { AlertsProvider } from "@/app/components/ux-helpers/alerts-provider";


export default function RootLayout({ children, }: Readonly<{ children: React.ReactNode; }>) {

    return (
        <AlertsProvider sliceKeys={['cookHistory', 'cook', 'recipe', 'list']}> 
            <Box sx={mainBoxCook}>
                <Box sx={{ ...headerCook, display: { xs: "none", md: "block" } }}>
                    <Box sx={scrollBox}>
                        <HeaderCook />
                    </Box>
                </Box>

                <Box sx={{
                    display: { xs: "block", md: "none" },
                    backgroundColor: 'transparent'
                }}>
                    <AdaptiveHeader></AdaptiveHeader>
                </Box>
                {children}
            </Box>
        </AlertsProvider>



    )
}