'use client'

import { btnsCookHeader, deleteHeaderCook, } from "@/app/(main)/cook/[recipe_id]/styles";
import { Box, Button, } from "@mui/material";
import Link from "next/link";
import { NameLinksT } from "@/app/types/types";
import ClearIcon from '@mui/icons-material/Clear';



interface AdaptiveHeaderProps {
    isDeleting:boolean,
    cookHistoryStore: NameLinksT[];
    recipe_id: string;
    open: boolean;
    toggleDrawer: (v: boolean) => () => void;
    handleDeleteRecipe: (id: string) => void;
}


export function HeaderCook({cookHistoryStore, recipe_id, open, toggleDrawer, handleDeleteRecipe, isDeleting}: AdaptiveHeaderProps)  {

    
    return (
        (cookHistoryStore.map(el => (
            <Box component={'li'} key={el.recipe_id} sx={{ display: 'flex', alignItems: 'center', justifyContent:'center', mb:'15px', gap:'5px'}}>
                <Button
                    component={Link}
                    variant="contained"
                    href={`/cook/${el.recipe_id}`}
                    sx={[ btnsCookHeader, {
                        color: recipe_id === el.recipe_id ? 'text.primary' : 'text.secondary',
                        backgroundColor: recipe_id === el.recipe_id ? 'primary' : 'secondary.main',
                        
                    }]}
                    disabled={isDeleting}
                >
                    {el.recipe_name}
                </Button>

                <Button 
                    onClick={() => handleDeleteRecipe(recipe_id)} 
                    sx={deleteHeaderCook} 
                    disabled={isDeleting} 
                >
                    <ClearIcon sx={{ color: '#8E94A4', width:"100%", height:'100%' }} />
                </Button>
                
            </Box>
        )))
    );
}


// HeaderCook.displayName = 'HeaderCook'
