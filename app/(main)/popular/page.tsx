import { MainPopular } from "@/app/components/popular/main-popular";
import { Box, Card } from "@mui/material";





export default function Popular() {

    return(
        <Card sx={{ width: '100%', backgroundColor: "background.default", display: 'flex', m: '20px auto', height:'100%', maxWidth:'1400px' }}>
            
            <MainPopular></MainPopular>
        </Card>

    )
}