import { Box, Typography } from "@mui/material";
import { SkeletonInfo } from "../SkeletonInfo";
import { memo } from "react";
import { useAppDispatch, useAppSelector } from "@/state/hook";
import { editNameBox } from "@/app/(main)/cook/styles";



interface Props {
    recipe_id:string 
    isEditing:string
}


const Type = memo(({recipe_id, isEditing}:Props) => {
    const recipeStatus = useAppSelector(state => state.cook.operations.fetchCook.loading)
    const recipeType = useAppSelector(state => state.cook.recipes[recipe_id]?.recipe_type)
    const modifiedType = useAppSelector(state => state.cook.modified.recipe_type)
    const dispatch = useAppDispatch()

    const types = [
        {
            value: 'Salad',
            label: 'Salad',
        },
        {
            value: 'First course',
            label: 'First course',
        },
        {
            value: 'Snack',
            label: 'Snack',
        },
        {
            value: 'Dessert',
            label: 'Dessert',
        },
   
    ];




    return(
        isEditing ? (
            <Box sx={editNameBox}>
                
            
            </Box>
            
        ) : (
            <Typography variant="body1" sx={{display:'flex'}}>
                Type: <SkeletonInfo loading={recipeStatus}>{recipeType}</SkeletonInfo>
            </Typography>
        )
    )
}, (prevProps, nextProps) => {
    return prevProps.isEditing === nextProps.isEditing && 
    prevProps.recipe_id === nextProps.recipe_id 
})

Type.displayName = "Type"

export default Type