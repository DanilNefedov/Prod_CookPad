import { MainListRecipe } from "@/app/components/main-list/list-recipe/main-list-recipe";
import { Box } from "@mui/material";






export default function ListRecipe() {

    return (
        <Box sx={{ height: 'calc(100dvh - 80px)', overflowY: 'auto' }}>
            <MainListRecipe></MainListRecipe>
        </Box>
    )
}