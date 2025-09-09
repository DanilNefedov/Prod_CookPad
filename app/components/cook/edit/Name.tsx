import { Box, TextField, Typography } from "@mui/material";
import { SkeletonInfo } from "../SkeletonInfo";
import { textMaxWidth } from "@/app/styles";
import { editNameBox, editNameInput, nameRecipe } from "@/app/(main)/cook/styles";
import { useAppDispatch, useAppSelector } from "@/state/hook";
import { ChangeEvent, memo } from "react";
import { changeName } from "@/state/slices/cook-slice";



interface Props {
    recipe_id:string
    isEditing:boolean
}



const Name = memo(({recipe_id, isEditing}:Props) => {
    const recipeStatus = useAppSelector(state => state.cook.operations.fetchCook.loading)
    const recipeName = useAppSelector(state => state.cook.recipes[recipe_id]?.name)
    const modifiedName = useAppSelector(state => state.cook.modified.name)
    const dispatch = useAppDispatch()

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
    
        if (value.length > 150) {
            return; 
        }

        dispatch(changeName({recipe_id, name:value}))
    };

    // console.log(recipeName, modifiedName)
    console.log('Name')
    return(
        isEditing ? (
            <Box sx={editNameBox}>
                <TextField
                    variant="outlined"
                    value={modifiedName === '' ? recipeName : modifiedName}
                    onChange={handleChange}
                    size="small"
                    sx={[textMaxWidth, editNameInput]}
                />
            </Box>
            
        ) : (
            <Typography variant="h2" sx={[textMaxWidth, nameRecipe]}>
                <SkeletonInfo loading={recipeStatus}>{recipeName}</SkeletonInfo>
            </Typography>
        )
    )
}, (prevProps, nextProps) => {
    return prevProps.isEditing === nextProps.isEditing && 
    prevProps.recipe_id === nextProps.recipe_id 
})

Name.displayName = "Name"

export default Name