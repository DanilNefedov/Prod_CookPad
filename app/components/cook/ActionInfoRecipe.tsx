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
import Type from "./edit/Type";
import Description from "./edit/Description";



interface Props {
    recipe_id:string
    isEditing:boolean
    handleEdit:() => void
}



const ActionInfoRecipe = memo(({recipe_id, isEditing, handleEdit}:Props ) => {
    const favoriteStatus = useAppSelector(state => state.recipe.operations.setFavoriteRecipe.loading)
    // const recipeStatus = useAppSelector(state => state.cook.operations.fetchCook.loading)
    const favoriteRecipe = useAppSelector(state => state.cook.recipes[recipe_id]?.favorite)
    const user_id = useAppSelector(state => state.user.user.connection_id)
    const isListLoading = useAppSelector((state) => state.listRecipe.operations.newListRecipe.loading)
    const dispatch = useAppDispatch()


    const handleFavorite = ({ recipe_id }: { recipe_id: string | undefined }): void => {
        if(favoriteStatus) return

        if (recipe_id !== '' && recipe_id) {
            const data = { recipe_id, favorite: favoriteRecipe }
            dispatch(setFavoriteRecipe(data))
        }
    }

    function addToList() {
        if (isListLoading) return

        if (user_id !== '' && recipe_id) {
            dispatch(newListRecipe({ connection_id: user_id, recipe_id: recipe_id }))
        }
    }

    console.log('ActionInfoRecipe')
    return(
        <Box sx={[columnSpaceBetween, actionInfoBox]}>
            <Box sx={containerInfo}>

                <Name recipe_id={recipe_id} isEditing={isEditing}></Name>
            
                <Type recipe_id={recipe_id} isEditing={isEditing}></Type>
            
                <Box sx={containerTime}>

                    <Typography sx={{display:'flex', flexGrow:1}}>
                        {/* Time: <SkeletonInfo loading={recipeStatus}>{cookRecipe?.time.hours}h : {cookRecipe?.time.minutes}m</SkeletonInfo> */}
                    </Typography>

                </Box>
                
                <Description recipe_id={recipe_id} isEditing={isEditing}></Description>
                
            </Box>


            <Box sx={betweenCenter}>
                <Button color="grayButton" sx={actionBtns} onClick={addToList}>To List</Button>
                <Button color={isEditing ? 'blackRedBtn' :"grayButton"} sx={actionBtns} onClick={handleEdit}>{isEditing ? 'Accept' : 'Edit'}</Button>
                <IconButton sx={{ padding: '0', mr:'20px' }} aria-label="add to favorites" onClick={() => handleFavorite({ recipe_id })}>
                    <FavoriteIcon sx={favoriteRecipe ? favoriteBtnActive : favoriteBtnDesactive} />
                </IconButton>
            </Box>

        </Box>
        
    )
}, (prevProps, nextProps) => {
    return prevProps.isEditing === nextProps.isEditing && 
    prevProps.recipe_id === nextProps.recipe_id 
})


ActionInfoRecipe.displayName = "ActionInfoRecipe"

export default ActionInfoRecipe