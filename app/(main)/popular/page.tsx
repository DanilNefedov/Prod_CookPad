import { MainPopular } from "@/app/components/popular/main-popular";
import { theme } from "@/config/ThemeMUI/theme";
import { Card } from "@mui/material";



export default function Popular() {


    return(
        <Card sx={{ overflow:"inherit", 
            boxShadow:'none',
            position:'relative' ,
            gap:"90px",
            height: "maxContent",
            display: "flex",
            flexDirection: "row",
            flexGrow: 1,
            alignItems: "center",
            justifyContent: "center",
            [theme.breakpoints.down(1030)]: { gap:"60px", },
            [theme.breakpoints.down('md')]: {
                justifyContent: "space-between",
            },
            [theme.breakpoints.down(769)]: {
                flexDirection:'column'            
            }}}>
                <MainPopular></MainPopular>
            
        </Card>
        

    )
}