import { Button } from "@mui/material";
import ClearIcon from '@mui/icons-material/Clear';
import { useAppDispatch, useAppSelector } from "@/state/hook";
import { deleteCookHistory } from "@/state/slices/cook-history";
import { deleteHeaderCook } from "@/app/(main)/cook/[recipe_id]/styles";
import { Dispatch, SetStateAction, } from "react";


interface PropsData { 
    recipe_id: string, 
    isDeleting?:boolean, 
    setIsDeleting?:Dispatch<SetStateAction<boolean>>,
}


// export const DeleteButton = memo(({ recipe_id, isDeleting, setIsDeleting }: PropsData) => {
export function DeleteButton ({ recipe_id, isDeleting, setIsDeleting }: PropsData){
    const connectionId = useAppSelector(state => state.user.user.connection_id);
    const dispatch = useAppDispatch();
    

    function handleDeleteRecipe(recipe_id: string) {
        if (!recipe_id) return;

        if(setIsDeleting){
            setIsDeleting(true); 
        }

        dispatch(deleteCookHistory({ connection_id: connectionId, recipe_id }));
    }
    console.log('DeleteButton')
    return (
        <Button 
            onClick={() => handleDeleteRecipe(recipe_id)} 
            sx={deleteHeaderCook} 
            disabled={isDeleting} 
        >
            <ClearIcon sx={{ color: '#8E94A4', width:"100%", height:'100%' }} />
        </Button>
    );
}



// DeleteButton.displayName = "DeleteButton"
