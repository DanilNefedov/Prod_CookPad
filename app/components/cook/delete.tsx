import { Button } from "@mui/material";
import ClearIcon from '@mui/icons-material/Clear';
import { useRouter } from 'next/navigation'
import { useAppDispatch, useAppSelector } from "@/state/hook";
import { deleteCookHistory } from "@/state/slices/cook-history";
import { deleteHeaderCook } from "@/app/(main)/cook/[recipe_id]/styles";



export function DeleteButton({recipe_id}:{recipe_id:string}) {
    const cookHistoryStore = useAppSelector(state => state.cookHistory)
    const dispatch = useAppDispatch()
    const router = useRouter();



    function handleDeleteRecipe(id:string | null) {
        if(id !== '' && id !== null){
            const data = {
                connection_id: cookHistoryStore.connection_id,
                recipe_id:id
            }
            dispatch(deleteCookHistory({connection_id:cookHistoryStore.connection_id, recipe_id}))
            console.log(cookHistoryStore)
            if(cookHistoryStore.history_links.length <= 1){
                router.push('/home');
            }
                
            
            if(recipe_id === id && cookHistoryStore.history_links.length > 1){
                const link = cookHistoryStore.history_links.find(el => el.recipe_id !== id);
                router.push(`${link?.recipe_id}`);
            }
        }
    }


    return (
        <Button onClick={() => handleDeleteRecipe(recipe_id)} sx={deleteHeaderCook}>
            <ClearIcon sx={{ color: '#8E94A4' }}></ClearIcon>
        </Button>
    )
}