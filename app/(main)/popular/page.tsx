import { MainPopular } from "@/app/components/popular/main-popular";
import { Box, Card } from "@mui/material";





export default function Popular() {

    return(
        <Card sx={{ width: '100%', overflow:"inherit", backgroundColor: "background.default", display: 'flex', m: '0 auto', height:'calc(100% - 40px)', maxWidth:'1400px', position:'relative' }}>
            
            <MainPopular></MainPopular>
        </Card>

    )
}