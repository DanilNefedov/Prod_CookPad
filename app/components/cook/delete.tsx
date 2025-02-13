import { Button } from "@mui/material";
import ClearIcon from '@mui/icons-material/Clear';
import { useRouter } from 'next/navigation'
import { useAppDispatch, useAppSelector } from "@/state/hook";
import { deleteCookHistory } from "@/state/slices/cook-history";
import { deleteHeaderCook } from "@/app/(main)/cook/[recipe_id]/styles";
import { Dispatch, SetStateAction } from "react";


interface PropsData { 
    recipe_id: string, 
    isDeleting:boolean, 
    setIsDeleting:Dispatch<SetStateAction<boolean>>,
}


export function DeleteButton({ props }: { props: PropsData }) {
    const { recipe_id, isDeleting, setIsDeleting } = props;
    const cookHistoryStore = useAppSelector(state => state.cookHistory);
    const dispatch = useAppDispatch();

    function handleDeleteRecipe(recipe_id: string) {
        if (!recipe_id) return;

        setIsDeleting(true); 
        dispatch(deleteCookHistory({ connection_id: cookHistoryStore.connection_id, recipe_id }));
    }

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
