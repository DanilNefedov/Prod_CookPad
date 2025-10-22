import { mainBtnsCreation } from "@/app/(main)/(main-list)/list/styles";
import { useAppDispatch, useAppSelector } from "@/state/hook";
import { checkNewListIngredient, selectFilledNewIngredients } from "@/state/selectors/new-ingr-list";
import { newIngredient } from "@/state/slices/list-form";
import { createNewIngredients } from "@/state/slices/list-slice";
import { Box, Button } from "@mui/material";







export function MainButtons(){
    const showWarning = useAppSelector(checkNewListIngredient);
    const filledIngredients = useAppSelector(selectFilledNewIngredients);
    const connection_id = useAppSelector((state) => state.user.user.connection_id);

    const dispatch = useAppDispatch()


    function handleNewIngredient(){
        dispatch(newIngredient())
    }

    function handleSave(){
        dispatch(createNewIngredients({connection_id, data:filledIngredients}))    
    }


    return(
        <Box sx={mainBtnsCreation}>
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