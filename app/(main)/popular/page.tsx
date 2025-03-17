import { MainPopular } from "@/app/components/popular/main-popular";
import { Box, Card } from "@mui/material";





export default function Popular() {

    return(
        <Card sx={{ width: '100%', backgroundColor: "background.default", display: 'flex', m: '20px 0', height:'100%' }}>
            <Box sx={{ maxWidth: '70%', position: 'relative', width:"100%"}}>
                <MainPopular></MainPopular>
            </Box>
        </Card>

    )
}