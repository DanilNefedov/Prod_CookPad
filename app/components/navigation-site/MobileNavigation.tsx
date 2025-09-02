'use client'


import { containerNavigation } from "@/app/(main)/home/styles";
import { Box, Container } from "@mui/material";
import { AboutUser } from "./UserInfo";



export function MobileNavigation() {


    return(
        <Box sx={{
            height:'100%', 
            maxHeight:'45px', 
            bgcolor:'background.default', 
            width:'100%',
            display: { xs: 'block', sm: 'none' }
        }}>
            <Container disableGutters sx={[containerNavigation]}>
                <Box>
                    <AboutUser></AboutUser>
                </Box>

            </Container>
        </Box>
    )
}