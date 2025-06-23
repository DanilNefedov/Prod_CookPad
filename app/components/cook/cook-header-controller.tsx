'use client'


import { useAppDispatch, useAppSelector } from "@/state/hook";
import { deleteCookHistory, fetchHistoryCook } from "@/state/slices/cook-history";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { AdaptiveHeader } from "./adaptive-header";
import { HeaderCook } from "./header-cook";
import { Box, useMediaQuery } from "@mui/material";
import { theme } from "@/config/ThemeMUI/theme";
import { headerCook, scrollBox } from "@/app/(main)/cook/[recipe_id]/styles";
import { NameLinksT } from "@/app/types/types";

export interface HeaderProps {
    isDeleting:boolean,
    cookHistoryStore: NameLinksT[];
    recipe_id: string;
    open: boolean;
    toggleDrawer: (v: boolean) => () => void;
    handleDeleteRecipe: (id: string) => void;
}

export function CookHeaderController() {
    const cookHistoryStore = useAppSelector(state => state.cookHistory.history_links);
    const userStore = useAppSelector(state => state.user);
    const dispatch = useAppDispatch();
    const router = useRouter();
    const pathName = usePathname();
    const searchParams = useSearchParams();
    const recipe_id = pathName.split("/")[2];
    const recipeName = searchParams.get("name") ?? '';
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));

    const [isDeleting, setIsDeleting] = useState(false);
    const [open, setOpen] = useState(false);

    const toggleDrawer = (newOpen: boolean) => () => setOpen(newOpen);

    useEffect(() => {
        if (userStore.user.connection_id !== '') {
            dispatch(fetchHistoryCook({ connection_id: userStore.user.connection_id, recipe_id }));
        }
    }, [userStore.user.connection_id, dispatch, recipeName, recipe_id]);

    useEffect(() => {
        if (!isDeleting) return;

        const updatedLinks = cookHistoryStore;

        if (updatedLinks.length === 0) {
            router.push('/home');
        } else if (!updatedLinks.some(el => el.recipe_id === recipe_id)) {
            const currentIndex = updatedLinks.findIndex(el => el.recipe_id === recipe_id);
            const nextRecipe = updatedLinks[currentIndex + 1] || updatedLinks[currentIndex - 1] || updatedLinks[0];
            if (nextRecipe) {
                router.push(`/cook/${nextRecipe.recipe_id}`);
            }
        }

        setIsDeleting(false);
    }, [cookHistoryStore, recipe_id]);

    const handleDeleteRecipe = (recipe_id: string) => {
        setIsDeleting(true);
        dispatch(deleteCookHistory({
            connection_id: userStore.user.connection_id,
            recipe_id,
        }));
    };

    const sharedProps = {
        cookHistoryStore,
        recipe_id,
        isDeleting,
        handleDeleteRecipe,
        open,
        toggleDrawer,
    };


    return (
        isMobile ? 
        <AdaptiveHeader {...sharedProps} />
        :
        <Box sx={ headerCook}>
            <Box component="ul" sx={[scrollBox, {display: 'flex',listStyle: 'none',p:'0 5px' }]}>
                <HeaderCook {...sharedProps} />
            </Box>
        </Box>
        
    )
}
