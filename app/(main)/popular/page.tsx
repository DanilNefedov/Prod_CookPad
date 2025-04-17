import { MainPopular } from "@/app/components/popular/main-popular";
import { theme } from "@/config/ThemeMUI/theme";
import { Box, Card } from "@mui/material";





export default function Popular() {

    return(
        <Card sx={{ 
            // width: 'calc(100% - 2px)', 
            overflow:"inherit", 
            // backgroundColor: "background.default", 
            boxShadow:'none',
            // display: 'flex', 
            // m: '0 auto', 
            // height:'calc(100% - 40px)', 
            // maxWidth:'1400px', 
            position:'relative' ,
            // justifyContent:'space-between',
            gap:"90px",


            height: "maxContent",
            display: "flex",
        
            flexDirection: "row",
            // -webkit-box-flex: 1;
            flexGrow: 1,
            // -webkit-box-align: end;
            alignItems: "end",
            // -webkit-box-pack: center;
            justifyContent: "center",
            }}>
            
            <MainPopular></MainPopular>
        </Card>

    )
}