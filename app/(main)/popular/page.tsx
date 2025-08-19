import { MainPopular } from "@/app/components/popular/MainPopular";
import { theme } from "@/config/ThemeMUI/theme";
import { Card } from "@mui/material";
import { pageCard } from "./styles";
import { centerFlexBlock } from "@/app/styles";



export default function Popular() {


    return(
        <Card sx={{ ...pageCard(theme), ...centerFlexBlock }}>
            <MainPopular></MainPopular>
        </Card>
    )
}