'use client'

import { Box, Chip, ListItem, styled, SwipeableDrawer } from "@mui/material"
import { useRef } from "react";
import { grey } from "@mui/material/colors";
import Link from "next/link";
import { HeaderProps } from "./cook-header-controller";
import { useAppSelector } from "@/state/hook";
import { adaptiveHeaderContainer, adaptiveLink, containerItems, drawer, headerItem, 
    labelLink, pullerContainer } from "@/app/(main)/cook/styles";
import { wrapCenter } from "@/app/styles";


const Puller = styled('div')(({ theme }) => ({
    width: 45,
    height: 8,
    backgroundColor: grey[300],
    borderRadius: 3,
    position: 'absolute',
    left: 'calc(50% - 22.5px)',
    pointerEvents: 'auto', 
    top: '0',
    ...theme.applyStyles('dark', {
        backgroundColor: grey[900],
    }),
}));


export function AdaptiveHeader({cookHistoryStore, recipe_id, open, toggleDrawer, handleDeleteRecipe}: HeaderProps) {
    const boxRef = useRef<HTMLUListElement | null>(null)
    const iOS = typeof navigator !== 'undefined' && /iPad|iPhone|iPod/.test(navigator.userAgent);
    const deletingStatus = useAppSelector(state => state.cookHistory.operations.deleteCookHistory.loading);
    


    return (
        <Box ref={boxRef} sx={adaptiveHeaderContainer}>
            <Box
                onClick={toggleDrawer(true)}
                sx={pullerContainer}
            >
                <Puller/>
            </Box>

            <SwipeableDrawer
                disableBackdropTransition={!iOS} 
                disableDiscovery={iOS} 
                container={() => boxRef.current}
                anchor={'top'}
                open={open}
                onClose={toggleDrawer(false)}
                onOpen={toggleDrawer(true)}
                sx={drawer}
                swipeAreaWidth={35}
            >
                <Box component={'ul'}
                    sx={[wrapCenter, containerItems]}>
                    {cookHistoryStore.map((el) => (
                        <ListItem 
                            key={el.recipe_id}
                            sx={headerItem}
                        >
                            <Chip
                                color={recipe_id === el.recipe_id ? "darkRed" : "darkBg"}
                                component={Link}
                                href={`/cook/${el.recipe_id}`}
                                sx={[adaptiveLink, labelLink]}
                                disabled={deletingStatus}
                                label={el.recipe_name}
                                onDelete={(e) => {
                                    e.preventDefault();
                                    e.stopPropagation();
                                    handleDeleteRecipe(el.recipe_id);
                                }}
                            />
                        </ListItem>

                    ))}
                </Box>

            </SwipeableDrawer>

        </Box>

    )
}