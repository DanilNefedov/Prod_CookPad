'use client'

import { elementHeader, labelLink, links } from "@/app/(main)/cook/styles";
import { Box, Chip, } from "@mui/material";
import { HeaderProps } from "./cook-header-controller";
import { centerFlexBlock } from "@/app/styles";
import { useRouter } from 'next/navigation'
import { useAppSelector } from "@/state/hook";




export function HeaderCook({cookHistoryStore, recipe_id, handleDeleteRecipe}: HeaderProps)  {
    const router = useRouter()
    const deletingStatus = useAppSelector(state => state.cookHistory.operations.deleteCookHistory.loading);
    
    return (
        (cookHistoryStore.map(el => (
            <Box 
                component={'li'} 
                key={el.recipe_id} 
                sx={[centerFlexBlock, elementHeader]}
            >
                <Chip 
                    color={recipe_id === el.recipe_id ? "darkRed" : "secondary"}
                    label={el.recipe_name}
                    onDelete={() => {
                        handleDeleteRecipe(el.recipe_id);
                    }}
                    onClick={() => {
                        router.push(`/cook/${el.recipe_id}`)
                    }}
                    disabled={deletingStatus}
                    sx={[links, labelLink]}
                ></Chip>
            </Box>
        )))
    );
}


