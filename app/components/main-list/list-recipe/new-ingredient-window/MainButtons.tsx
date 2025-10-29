import { mainBtnsCreation } from "@/app/(main)/(main-list)/list/styles";
import { useAppDispatch, useAppSelector } from "@/state/hook";
import { checkNewListIngredient, selectFilledNewIngredients } from "@/state/selectors/list-recipe";
import { newIngredient } from "@/state/slices/list-recipe-form";
import { creationIngredients } from "@/state/slices/list-recipe-slice";
import { Box, Button } from "@mui/material";



interface Props {
    recipeId:string
}



export function MainButtons({recipeId}: Props){
    const showWarning = useAppSelector((state) => checkNewListIngredient(state, recipeId));
    const filledIngredients = useAppSelector((state) => selectFilledNewIngredients(state, recipeId));
    const connection_id = useAppSelector((state) => state.user.user.connection_id);

    const dispatch = useAppDispatch()


    function handleNewIngredient(){
        dispatch(newIngredient({recipeId}))
    }

    function handleSave(){
        console.log(recipeId, filledIngredients)
        dispatch(creationIngredients({
            connection_id,
            recipe_id:recipeId,
            ingredients:filledIngredients
        }))    
    }


    return(
        <Box sx={[mainBtnsCreation, {mt:'10px'}]}>
            <Button 
                color="blackRedBtn" 
                onClick={handleNewIngredient}
                sx={{mb:'20px'}}
            >Add ingredient</Button>

            <Button 
                disabled={showWarning}
                color="blackRedBtn" 
                onClick={handleSave}
                sx={{mb:'20px'}}
            >Save</Button>
        </Box>
    )
}