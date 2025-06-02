'use client'

import { btnsCookHeader, } from "@/app/(main)/cook/[recipe_id]/styles";
import { btnMain } from "@/app/main-styles";
import { useAppDispatch, useAppSelector } from "@/state/hook";
import { Box, Button } from "@mui/material";
import Link from "next/link";
import { DeleteButton } from "./delete";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import {  useEffect, useState } from "react";
import { fetchHistoryCook, } from "@/state/slices/cook-history";



// export const HeaderCook = memo(() => {

export function HeaderCook() {
    
    const cookHistoryStore = useAppSelector(state => state.cookHistory.history_links);
    const userStore = useAppSelector(state => state.user);
    const dispatch = useAppDispatch();
    const router = useRouter();
    const pathName = usePathname();
    const segments = pathName.split("/");
    const recipe_id = segments[2];
    const searchParams = useSearchParams();
    const recipeName = searchParams.get("name") ?? '';

    const [isDeleting, setIsDeleting] = useState(false);

    useEffect(() => {
        if (userStore.user.connection_id !== '') {
            dispatch(fetchHistoryCook({ connection_id: userStore.user.connection_id, recipe_id}));
        }
    }, [userStore.user.connection_id, dispatch, recipeName, recipe_id]);

    useEffect(() => {
        if (!isDeleting) return; 

        const updatedLinks = cookHistoryStore;

        if (updatedLinks.length === 0) {
            router.push('/home'); 
        } else if (!updatedLinks.some(el => el.recipe_id === recipe_id)) {
            const currentIndex = updatedLinks.findIndex(el => el.recipe_id === recipe_id);
            let nextRecipe = null;

            if (currentIndex !== -1) {
                nextRecipe = updatedLinks[currentIndex + 1] || updatedLinks[currentIndex - 1];
            } else {
                nextRecipe = updatedLinks[0]; 
            }

            if (nextRecipe) {
                router.push(`/cook/${nextRecipe.recipe_id}`);
            }
        }

        setIsDeleting(false);
    }, [cookHistoryStore, recipe_id, router, cookHistoryStore.length]);

    console.log('HeaderCook')
    
    return (
        (cookHistoryStore.map(el => (
            <Box key={el.recipe_id} sx={{ display: 'flex', alignItems: 'center' }}>
                <Button
                    component={Link}
                    variant="contained"
                    href={`/cook/${el.recipe_id}`}
                    sx={{
                        ...btnMain, ...btnsCookHeader,
                        color: recipe_id === el.recipe_id ? 'text.primary' : 'text.secondary',
                        backgroundColor: recipe_id === el.recipe_id ? 'primary' : 'secondary.main'
                    }}
                    disabled={isDeleting}
                >
                    {el.recipe_name}
                </Button>

                <DeleteButton
                    recipe_id={el.recipe_id}
                    isDeleting={isDeleting}
                    setIsDeleting={setIsDeleting}
                />
            </Box>
        )))
    );
}


// HeaderCook.displayName = 'HeaderCook'
