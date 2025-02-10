import { Button } from "@mui/material";
import ClearIcon from '@mui/icons-material/Clear';
import { useRouter } from 'next/navigation'
import { useAppDispatch, useAppSelector } from "@/state/hook";
import { deleteCookHistory } from "@/state/slices/cook-history";
import { deleteHeaderCook } from "@/app/(main)/cook/[recipe_id]/styles";


interface PropsData { 
    recipe_id: string, 
    activePage:string 
}


export function DeleteButton({props}: {props:PropsData}) {
    const cookHistoryStore = useAppSelector(state => state.cookHistory)
    const dispatch = useAppDispatch()
    const router = useRouter();
    const {recipe_id, activePage} = props
    // const activePage = pathname.split('/').pop();


    function handleDeleteRecipe(recipe_id: string) {
        if(recipe_id !== ''){
            
            dispatch(deleteCookHistory({connection_id:cookHistoryStore.connection_id, recipe_id}))
            
            if(cookHistoryStore.history_links.length <= 1){
                router.push('/home');
            }
                
            
            if(recipe_id === activePage && cookHistoryStore.history_links.length > 1){
                const currentIndex = cookHistoryStore.history_links.findIndex(el => el.recipe_id === recipe_id);

                const nextRecipe = cookHistoryStore.history_links[currentIndex + 1]
                    || cookHistoryStore.history_links[currentIndex - 1]; 

                if (nextRecipe) {
                    router.push(`${nextRecipe.recipe_id}`);
                }
                
            }
        }
    }


    return (
        <Button onClick={() => handleDeleteRecipe(recipe_id)} sx={deleteHeaderCook}>
            <ClearIcon sx={{ color: '#8E94A4' }}></ClearIcon>
        </Button>
    )
}