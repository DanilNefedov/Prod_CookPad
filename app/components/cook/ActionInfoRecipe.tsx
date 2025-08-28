import { containerInfo, containerTime, descriptionInstruction, nameRecipe } from "@/app/(main)/cook/styles";
import { favoriteBtnActive, favoriteBtnDesactive, textMaxWidth } from "@/app/styles";
import { Box, IconButton, Typography } from "@mui/material";
import FavoriteIcon from '@mui/icons-material/Favorite';
import { useAppDispatch, useAppSelector } from "@/state/hook";
import { setFavoriteRecipe } from "@/state/slices/recipe-slice";
import { memo } from "react";



interface Props {
    recipe_id:string
}



const ActionInfoRecipe = memo(({recipe_id}:Props ) => {
    const favoriteStatus = useAppSelector(state => state.recipe.operations.setFavoriteRecipe.loading)
    const cookStore = useAppSelector(state => state.cook.recipes)
    const findCook = cookStore.find(el => el.recipe_id === recipe_id)
    const dispatch = useAppDispatch()


    const handleFavorite = ({ recipe_id }: { recipe_id: string | undefined }): void => {
        if(favoriteStatus) return

        if (recipe_id !== '' && recipe_id) {
            if (findCook) {
                const data = { recipe_id, favorite: findCook?.favorite }
                dispatch(setFavoriteRecipe(data))
            }
        }
    }


    return(
        <Box sx={containerInfo}>
            <Typography variant="h2" sx={[textMaxWidth, nameRecipe]}>{findCook?.name}</Typography>
            <Typography variant="body1">Type: {findCook?.recipe_type}</Typography>
            <Box sx={containerTime}>

                <Typography
                >Time: {findCook?.time.hours}h : {findCook?.time.minutes}m</Typography>
                
                <IconButton sx={{ padding: '0' }} aria-label="add to favorites" onClick={() => handleFavorite({ recipe_id: findCook?.recipe_id })}>
                    {findCook?.favorite ? <FavoriteIcon sx={favoriteBtnActive} /> : <FavoriteIcon sx={favoriteBtnDesactive} />}
                </IconButton>

            </Box>
            <Typography sx={descriptionInstruction} variant="body1">Description: {findCook?.description}</Typography>
        </Box>
    )
})


ActionInfoRecipe.displayName = "ActionInfoRecipe"

export default ActionInfoRecipe