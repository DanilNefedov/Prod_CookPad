import { HeaderCook } from "@/app/components/cook/header-cook";
import { Box } from "@mui/material";
import { headerCook, mainBoxCook } from "./[recipe_id]/styles";


export default function RootLayout({ children, }: Readonly<{ children: React.ReactNode; }>) {

    return (
        <Box sx={mainBoxCook}>
            <Box sx={headerCook}>
                <HeaderCook />
            </Box>
            {children}
        </Box>
       

    )
}