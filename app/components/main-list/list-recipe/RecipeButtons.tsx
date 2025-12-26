import { Box, Button } from "@mui/material";
import { useAppDispatch, useAppSelector } from "@/state/hook";
import { deleteListRecipe } from "@/state/slices/list-recipe-slice";
import { memo } from "react";
import { NewIngredientBtn } from "./new-ingredient-window/NewIngredientBtn";



interface Props {
    recipeId:string
}



export const RecipeButtons = memo(({recipeId}:Props) => {
    const dispatch = useAppDispatch()
    const connection_id = useAppSelector(state => state.user.user.connection_id)


    function handleDeleteRecipe(recipeId: string) {
        if (connection_id !== '') {
            dispatch(deleteListRecipe({ connection_id, recipe_id:recipeId }))
        }
    }



    return (
        <Box sx={{display:'flex', justifyContent:'center', gap:'20px', mt:'15px'}}>
            <NewIngredientBtn recipeId={recipeId}></NewIngredientBtn>
            <Button
                color="blackRedBtn"
                onClick={() => handleDeleteRecipe(recipeId)}
            >
                Delete
            </Button>
        </Box>
    )
}, (prevProps, nextProps) => {
    return prevProps.recipeId === nextProps.recipeId 
});


RecipeButtons.displayName = "RecipeButtons"