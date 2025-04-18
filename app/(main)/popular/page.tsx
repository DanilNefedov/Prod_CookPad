import { MainPopular } from "@/app/components/popular/main-popular";
import { theme } from "@/config/ThemeMUI/theme";
import { Box, Card } from "@mui/material";





export default function Popular() {

    return(
        <Card sx={{ 
            overflow:"inherit", 
            boxShadow:'none',
            position:'relative' ,
            gap:"90px",
            height: "maxContent",
            display: "flex",
            flexDirection: "row",
            flexGrow: 1,
            alignItems: "center",
            justifyContent: "center",
            [theme.breakpoints.down(1030)]: { gap:"20px", },
            [theme.breakpoints.down('md')]: {
                justifyContent: "space-between",
                // gap:"75px",
            }
            }}>
            
            <MainPopular></MainPopular>
        </Card>

    )
}