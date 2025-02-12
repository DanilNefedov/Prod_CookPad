'use client'

import { btnsCookHeader, scrollBox } from "@/app/(main)/cook/[recipe_id]/styles";
import { btnMain } from "@/app/main-styles";
import { useAppDispatch, useAppSelector } from "@/state/hook";
import { Box, Button } from "@mui/material";
import Link from "next/link";
import { DeleteButton } from "./delete";
import { usePathname } from "next/navigation";
import { useEffect } from "react";
import { fetchHistoryCook } from "@/state/slices/cook-history";





export function HeaderCook() {
    const cookHistoryStore = useAppSelector(state => state.cookHistory)
    const userStore = useAppSelector(state => state.user)
    const dispatch = useAppDispatch()
    const pathName = usePathname()
    const segments = pathName.split("/"); 
    const recipe_id = segments[2]; 


    useEffect(() => {
        if (userStore.user.connection_id !== '' && cookHistoryStore.history_links.length <= 0) {
            dispatch(fetchHistoryCook({ connection_id: userStore.user.connection_id }));
        };
    }, [userStore.user.connection_id, cookHistoryStore.history_links.length, dispatch]);
    

    return (
        <Box sx={scrollBox}>
            {
                cookHistoryStore.history_links.map(el => (
                    <Box key={el.recipe_id} sx={{ display: 'flex', alignItems: 'center' }}>
                        <Button
                            component={Link}
                            variant="contained"
                            href={el.recipe_id}
                            // onClick={() => handleTabClick(el.recipe_id as string)} 
                            sx={{
                                ...btnMain, ...btnsCookHeader,
                                color: recipe_id === el.recipe_id ? 'text.primary' : 'text.secondary',
                                backgroundColor: recipe_id === el.recipe_id ? 'primary' : 'secondary.main'

                            }}
                        >
                            {el.recipe_name}
                        </Button>

                        
                        <DeleteButton props={{recipe_id:el.recipe_id, activePage:recipe_id}}></DeleteButton>
                    </Box>

                ))
            }

        </Box>
    )
}
