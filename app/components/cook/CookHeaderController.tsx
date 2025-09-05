'use client'


import { useAppDispatch, useAppSelector } from "@/state/hook";
import { deleteCookHistory, fetchHistoryCook } from "@/state/slices/cook-history";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { AdaptiveHeader } from "./AdaptiveHeader";
import { HeaderCook } from "./HeaderCook";
import { Box, useMediaQuery } from "@mui/material";
import { theme } from "@/config/ThemeMUI/theme";
import { headerCookContainer, scrollBox, } from "@/app/(main)/cook/styles";
import { HistoryLinks } from "@/app/(main)/cook/types";
import { SkeletonList } from "./SkeletonList";

export interface HeaderProps {
    cookHistoryStore: HistoryLinks[];
    recipe_id: string;
    open: boolean;
    toggleDrawer: (v: boolean) => () => void;
    handleDeleteRecipe: (recipeId: string) => void;
}
 
export function CookHeaderController() {
    const cookHistoryStore = useAppSelector(state => state.cookHistory.history_links);
    const cookHistoryStatus = useAppSelector(state => state.cookHistory.operations.fetchHistoryCook.loading);
    const user_id = useAppSelector(state => state.user.user.connection_id);
    const dispatch = useAppDispatch();
    const router = useRouter();
    const pathName = usePathname();
    const searchParams = useSearchParams();
    const recipe_id = pathName.split("/")[2];
    const recipeName = searchParams.get("name") ?? '';

    const [open, setOpen] = useState(false);

    const toggleDrawer = (newOpen: boolean) => () => setOpen(newOpen);

    useEffect(() => {
        if(!user_id) return 
        const alreadyFetched = cookHistoryStore.some(item => item.recipe_id === recipe_id);
        if (!alreadyFetched) {
            dispatch(fetchHistoryCook({ connection_id: user_id, recipe_id }));
        }
    }, [user_id, dispatch, recipeName, recipe_id]);


    const handleDeleteRecipe = (recipeId: string) => {
        const index = cookHistoryStore.findIndex(el => el.recipe_id === recipeId);

        if (cookHistoryStore.length <= 1) {
            router.push('/home');
        }

        else if (recipeId === recipe_id) {
            const nextIndex = index === 0 ? 1 : 0;
            const nextRecipe = cookHistoryStore[nextIndex];

            if (nextRecipe) {
                router.push(`/cook/${nextRecipe.recipe_id}`);
            } else {     
                router.push('/home'); //protection against unforeseen events
            }
        }
        
        dispatch(deleteCookHistory({
            connection_id: user_id,
            recipe_id:recipeId,
        }));
    };

    const sharedProps = {
        cookHistoryStore,
        recipe_id,
        handleDeleteRecipe,
        open,
        toggleDrawer,
    };


    return (

        <>
            <AdaptiveHeader {...sharedProps} />
            
            <Box sx={[headerCookContainer, {display: { xs: 'none', md: 'flex' }}]}>
                {
                    cookHistoryStatus ? 
                    <SkeletonList></SkeletonList> 
                    :
                    <Box component="ul" sx={scrollBox}>
                        <HeaderCook {...sharedProps} />
                    </Box>
                }
            </Box>
        </>

    )
}
