'use client'

import { Box, Chip, ListItem, styled, SwipeableDrawer } from "@mui/material"
import { useRef } from "react";
import { theme } from "@/config/ThemeMUI/theme";
import { grey } from "@mui/material/colors";
import Link from "next/link";
import { HeaderProps } from "./cook-header-controller";



const Puller = styled('div')(({ theme }) => ({
    width: 30,
    height: 6,
    backgroundColor: grey[300],
    borderRadius: 3,
    position: 'absolute',
    top: 8,
    left: 'calc(50% - 15px)',
    ...theme.applyStyles('dark', {
        backgroundColor: grey[900],
    }),
}));



export function AdaptiveHeader({cookHistoryStore, recipe_id, open, toggleDrawer, handleDeleteRecipe, isDeleting,}: HeaderProps) {
    const boxRef = useRef<HTMLUListElement | null>(null)
    // const drawerContentRef = useRef<HTMLUListElement | null>(null);
    const iOS = typeof navigator !== 'undefined' && /iPad|iPhone|iPod/.test(navigator.userAgent);





    // useEffect(() => {
    //     const drawerContent = drawerContentRef.current;
    //     if (!drawerContent) return;

    //     let startY = 0;

    //     const onTouchStart = (e: TouchEvent) => {
    //         startY = e.touches[0].clientY;
    //     };

    //     const onTouchMove = (e: TouchEvent) => {
    //         const currentY = e.touches[0].clientY;
    //         const deltaY = currentY - startY;

    //         if (drawerContent.scrollTop === 0 && deltaY > 0) {
    //         e.preventDefault();
    //         }
    //     };

    //     drawerContent.addEventListener('touchstart', onTouchStart, { passive: false });
    //     drawerContent.addEventListener('touchmove', onTouchMove, { passive: false });

    //     return () => {
    //         drawerContent.removeEventListener('touchstart', onTouchStart);
    //         drawerContent.removeEventListener('touchmove', onTouchMove);
    //     };
    // }, [open]); 

    return (
        <Box ref={boxRef} sx={{
            position: 'relative',
            width: 'fit-content',
            overscrollBehavior: "contain",
            overflow:'auto',
            m: '0 auto',
            '& .PrivateSwipeArea-root': {
                width: 'calc(100% - 60px)',
                right: '0',
                left: 'initial',
                overscrollBehavior: "contain",
                overflow:'auto',
                [theme.breakpoints.down(500)]: {
                    width: 'calc(100% - 45px)',
                },
                background: 'linear-gradient(to right, rgba(21,22,26, 0.02), rgba(21,22,26, 0.6), rgba(21,22,26, 0.02))',
                borderBottomLeftRadius: "50% 100%",
                borderBottomRightRadius: " 50% 100%",

            },
            '.MuiDrawer-root > .MuiPaper-root': {
                zIndex: '2500'
            },
            [theme.breakpoints.down('md')]: {
                mt: '20px',
            },
        }}>


            <Box
                onClick={toggleDrawer(true)}
                sx={{
                    position: 'fixed',
                    top: '15px',
                    left: '50%',
                    width: 45,
                    height: 6,
                    zIndex: 1200,
                    display: 'flex',
                    alignItems: 'flex-end',
                    justifyContent: 'center',
                    pointerEvents: 'none',

                }}
            >
                <Puller sx={{ pointerEvents: 'auto', top: '0' }} />
            </Box>

            <SwipeableDrawer
                disableBackdropTransition={!iOS} 
                disableDiscovery={iOS} 
                container={() => boxRef.current}
                anchor={'top'}
                open={open}
                onClose={toggleDrawer(false)}
                onOpen={toggleDrawer(true)}
                sx={{
                    '& .MuiDrawer-paper': {
                        transform: 'translateY(-50%)',
                        top: '0',
                        width: '100%',
                        margin: '0 auto',
                        borderRadius: '0 0 24px 24px',
                    }
                }}
                swipeAreaWidth={35}

            >
                <Box component={'ul'}
                    sx={{
                        p: '15px 15px',
                        display: 'flex',
                        flexWrap: 'wrap',
                        justifyContent: 'center',
                        gap: '15px'
                    }}>
                    {cookHistoryStore.map((data) => (
                        <ListItem key={data.recipe_id}
                            sx={{
                                p: '0',
                                maxWidth: '160px',
                                [theme.breakpoints.down(365)]: {
                                    maxWidth: '100%'
                                },
                            }}
                        >
                            <Chip
                                component={Link}
                                href={`/cook/${data.recipe_id}`}
                                sx={[  {
                                    color: recipe_id === data.recipe_id ? 'text.primary' : 'text.secondary',
                                    backgroundColor: recipe_id === data.recipe_id ? 'primary.main' : 'background.default',
                                    width: '100%',
                                    justifyContent: 'space-between',
                                    '& .MuiChip-deleteIcon': {
                                        color: recipe_id === data.recipe_id ? '#fff' : 'rgba(255, 255, 255, 0.26)',
                                    },
                                }]}
                                disabled={isDeleting}
                                label={data.recipe_name}
                                onDelete={(e) => {
                                    e.preventDefault();
                                    e.stopPropagation();
                                    handleDeleteRecipe(data.recipe_id);
                                }}
                            />
                        </ListItem>

                    ))}
                </Box>

            </SwipeableDrawer>

        </Box>

    )
}