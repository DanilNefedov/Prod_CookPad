import { MainListRecipe } from "@/app/components/main-list/list-recipe/main-list-recipe";
import { Box } from "@mui/material";
import { pageContainer } from "./styles";






export default function ListRecipe() {

    return (
        <Box sx={pageContainer}>
            <MainListRecipe></MainListRecipe>
        </Box>
    )
}