import { containerInfo, containerTime, descriptionInstruction, nameRecipe } from "@/app/(main)/cook/styles";
import { favoriteBtnActive, favoriteBtnDesactive, textMaxWidth } from "@/app/styles";
import { Box, IconButton, Typography } from "@mui/material";
import FavoriteIcon from '@mui/icons-material/Favorite';
import { useAppDispatch, useAppSelector } from "@/state/hook";
import { setFavoriteRecipe } from "@/state/slices/recipe-slice";
import { memo } from "react";
import { SkeletonInfo } from "./SkeletonInfo";



interface Props {
    recipe_id:string
}



const ActionInfoRecipe = memo(({recipe_id}:Props ) => {
    const favoriteStatus = useAppSelector(state => state.recipe.operations.setFavoriteRecipe.loading)
    const recipeStatus = useAppSelector(state => state.cook.operations.fetchCook.loading)
    const cookRecipe = useAppSelector(state => state.cook.recipes[recipe_id])
    // const findCook = cookStore.find(el => el.recipe_id === recipe_id)
    const dispatch = useAppDispatch()


    const handleFavorite = ({ recipe_id }: { recipe_id: string | undefined }): void => {
        if(favoriteStatus) return

        if (recipe_id !== '' && recipe_id) {
            if (cookRecipe) {
                const data = { recipe_id, favorite: cookRecipe.favorite }
                dispatch(setFavoriteRecipe(data))
            }
        }
    }


    return(
        <Box sx={containerInfo}>

            <Typography variant="h2" sx={[textMaxWidth, nameRecipe]}>
                <SkeletonInfo loading={recipeStatus}>{cookRecipe?.name}</SkeletonInfo>
            </Typography>
        
            <Typography variant="body1" sx={{display:'flex'}}>
                Type: <SkeletonInfo loading={recipeStatus}>{cookRecipe?.recipe_type}</SkeletonInfo>
            </Typography>
           
            <Box sx={containerTime}>

                <Typography sx={{display:'flex', flexGrow:1}}>
                    Time: <SkeletonInfo loading={recipeStatus}>{cookRecipe?.time.hours}h : {cookRecipe?.time.minutes}m</SkeletonInfo>
                </Typography>
                
                
                <IconButton sx={{ padding: '0' }} aria-label="add to favorites" onClick={() => handleFavorite({ recipe_id: cookRecipe?.recipe_id })}>
                    <FavoriteIcon sx={cookRecipe?.favorite ? favoriteBtnActive : favoriteBtnDesactive} />
                </IconButton>

            </Box>
            <Typography sx={[descriptionInstruction, {display:'flex'}]} variant="body1">
                Description: <SkeletonInfo loading={recipeStatus}>{cookRecipe?.description}</SkeletonInfo>
            </Typography>
            
        </Box>
    )
})


ActionInfoRecipe.displayName = "ActionInfoRecipe"

export default ActionInfoRecipe