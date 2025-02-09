'use client'

import { btnsCookHeader, scrollBox } from "@/app/(main)/cook/[recipe_id]/styles";
import { btnMain } from "@/app/main-styles";
import { useAppDispatch, useAppSelector } from "@/state/hook";
import { fetchHistoryCook } from "@/state/slices/cook-history";
import { Box, Button } from "@mui/material";
import Link from "next/link";
import { useEffect } from "react";
import { DeleteButton } from "./delete";





export function HeaderCook({ recipe_id }: { recipe_id: string }) {
    const cookHistoryStore = useAppSelector(state => state.cookHistory)
    const userStore = useAppSelector(state => state.user)
    const dispatch = useAppDispatch()



    useEffect(() => {
        if (!userStore.user.connection_id) return;
        dispatch(fetchHistoryCook({ connection_id: userStore.user.connection_id }));

    }, [recipe_id, userStore.user.connection_id])//cookHistoryStore.history_links, recipe_id


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

                        
                        <DeleteButton recipe_id={el.recipe_id}></DeleteButton>
                    </Box>

                ))
            }

        </Box>
    )
}
