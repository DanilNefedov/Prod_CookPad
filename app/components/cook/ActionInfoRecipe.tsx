import { actionBtns, actionInfoBox, containerInfo, containerTime, descriptionInstruction, nameRecipe } from "@/app/(main)/cook/styles";
import { betweenCenter, columnSpaceBetween, favoriteBtnActive, favoriteBtnDesactive, textMaxWidth } from "@/app/styles";
import { Box, Button, IconButton, Typography } from "@mui/material";
import FavoriteIcon from '@mui/icons-material/Favorite';
import { useAppDispatch, useAppSelector } from "@/state/hook";
import { setFavoriteRecipe } from "@/state/slices/recipe-slice";
import { memo, useState } from "react";
import { SkeletonInfo } from "./SkeletonInfo";
import { newListRecipe } from "@/state/slices/list-recipe-slice";
import Name from "./edit/Name";



interface Props {
    recipe_id:string
}



const ActionInfoRecipe = memo(({recipe_id}:Props ) => {
    const favoriteStatus = useAppSelector(state => state.recipe.operations.setFavoriteRecipe.loading)
    const recipeStatus = useAppSelector(state => state.cook.operations.fetchCook.loading)
    const cookRecipe = useAppSelector(state => state.cook.recipes[recipe_id])
    const user_id = useAppSelector(state => state.user.user.connection_id)
    const isListLoading = useAppSelector((state) => state.listRecipe.operations.newListRecipe.loading)
    const dispatch = useAppDispatch()
    const [isEditing, setIsEditing] = useState(false);


    const handleFavorite = ({ recipe_id }: { recipe_id: string | undefined }): void => {
        if(favoriteStatus) return

        if (recipe_id !== '' && recipe_id) {
            if (cookRecipe) {
                const data = { recipe_id, favorite: cookRecipe.favorite }
                dispatch(setFavoriteRecipe(data))
            }
        }
    }

    function addToList() {
        if (isListLoading) return

        if (user_id !== '' && recipe_id) {
            dispatch(newListRecipe({ connection_id: user_id, recipe_id: recipe_id }))
        }
    }


    function handleEdit(){
        setIsEditing(prev => !prev);
    }


    return(
        <Box sx={[columnSpaceBetween, actionInfoBox]}>
            <Box sx={containerInfo}>

                {/* <Typography variant="h2" sx={[textMaxWidth, nameRecipe]}>
                    <SkeletonInfo loading={recipeStatus}>{cookRecipe?.name}</SkeletonInfo>
                </Typography> */}
                <Name recipe_id={recipe_id} isEditing={isEditing}></Name>
            
                <Typography variant="body1" sx={{display:'flex'}}>
                    Type: <SkeletonInfo loading={recipeStatus}>{cookRecipe?.recipe_type}</SkeletonInfo>
                </Typography>
            
                <Box sx={containerTime}>

                    <Typography sx={{display:'flex', flexGrow:1}}>
                        Time: <SkeletonInfo loading={recipeStatus}>{cookRecipe?.time.hours}h : {cookRecipe?.time.minutes}m</SkeletonInfo>
                    </Typography>

                </Box>
                <Typography sx={[descriptionInstruction, {display:'flex'}]} variant="body1">
                    Description: <SkeletonInfo loading={recipeStatus}>{cookRecipe?.description}</SkeletonInfo>
                </Typography>
                
            </Box>


            <Box sx={betweenCenter}>
                <Button color="grayButton" sx={actionBtns} onClick={addToList}>To List</Button>
                <Button color={isEditing ? 'blackRedBtn' :"grayButton"} sx={actionBtns} onClick={handleEdit}>{isEditing ? 'Accept' : 'Edit'}</Button>
                <IconButton sx={{ padding: '0', mr:'20px' }} aria-label="add to favorites" onClick={() => handleFavorite({ recipe_id: cookRecipe?.recipe_id })}>
                    <FavoriteIcon sx={cookRecipe?.favorite ? favoriteBtnActive : favoriteBtnDesactive} />
                </IconButton>
            </Box>

        </Box>
        
    )
})


ActionInfoRecipe.displayName = "ActionInfoRecipe"

export default ActionInfoRecipe