'use client'

import { useAppDispatch, useAppSelector } from "@/state/hook";
import { deleteListRecipe, ingredientsListRecipe, preLoaderMain } from "@/state/slices/list-recipe-slice";
import { Accordion, AccordionSummary, Box, Button, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { ContentAccordion } from "./content-accordion";
import { UXLoading } from "../../ux-helpers/loading";
import { EmptyInfo } from "../../ux-helpers/empty-info";
import DeleteIcon from '@mui/icons-material/Delete';
import { theme } from "@/config/ThemeMUI/theme";
import { styleLink } from "../../home/header/header";
// import { ErrorAlert } from "../../ux-helpers/error-alert";




export function MainListRecipe() {
    const dispatch = useAppDispatch()
    const listRecipeStore = useAppSelector(state => state.listRecipe)
    const pageListRecipe = useAppSelector(state => state.listRecipe.page)
    const statusListRecipe = useAppSelector(state => state.listRecipe.operations.preLoaderMain.loading)
    const preLoaderMainStatus = useAppSelector(state => state.listRecipe.operations.preLoaderMain)
    const userStore = useAppSelector(state => state.user)

    const connection_id = userStore.user.connection_id
    const [loadingRecipeIds, setLoadingRecipeIds] = useState<string[]>([]);
    const [expandedIds, setExpandedIds] = useState<string[]>([]);


    const handleToggle = (id: string) => {
        setExpandedIds(prev =>
            prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
        );
    };
    useEffect(() => {
        if (connection_id !== '' && pageListRecipe === 1 && pageListRecipe !== null) {
            dispatch(preLoaderMain({ connection_id, page:pageListRecipe }))
        }
    }, [connection_id, dispatch, pageListRecipe])



    function getDataRecipe(_id: string) {
        const findThisRecipe = listRecipeStore.recipes.find(el => el._id === _id);

        if (findThisRecipe && findThisRecipe.ingredients_list?.length <= 0) {
            if (connection_id !== '') {
                setLoadingRecipeIds(prev => [...prev, _id]);

                dispatch(ingredientsListRecipe({ connection_id, _id }))
                    .finally(() => {
                        setLoadingRecipeIds(prev => prev.filter(id => id !== _id));
                        
                    });
            }
        }
    }

    function handleDeleteRecipe(recipe_id: string) {
        if (connection_id !== '') {
            dispatch(deleteListRecipe({ connection_id, recipe_id }))
        }
    }


    function handleMore() {
        if (connection_id !== '' && pageListRecipe !== null) {
            dispatch(preLoaderMain({ connection_id, page:pageListRecipe }))
        }
    }

    return (
        <Box sx={{ height: '100%', position: 'relative' }}>
            {
                !preLoaderMainStatus.error && preLoaderMainStatus.loading && listRecipeStore.recipes.length === 0 ?
                    <UXLoading ></UXLoading>//color:'#1F2128'
                    :
                    !preLoaderMainStatus.loading && listRecipeStore.recipes.length === 0 ?
                        <EmptyInfo></EmptyInfo>
                        :
                        listRecipeStore?.recipes.map(el => (

                            <Box key={el._id} sx={{ display: 'flex', alignItems: 'center', mb: '5px', }}>
                                <Accordion
                                    expanded={expandedIds.includes(el._id)}
                                    onChange={() => handleToggle(el._id)}
                                    slotProps={{ heading: { component: 'div' } }}
                                    // square={false}  

                                    sx={{
                                        width: "100%",
                                        backgroundColor: 'background.default',
                                        height: 'auto',
                                        overflow: 'none',
                                        // mb: '5px',
                                        '&:first-of-type': { borderTopLeftRadius: '10px', borderTopRightRadius: '10px' },
                                        '&:last-of-type': { borderBottomLeftRadius: '10px', borderBottomRightRadius: '10px' },
                                        '&.Mui-expanded': { m: '5px 0 ', },
                                        '& .MuiButtonBase-root.MuiAccordionSummary-root': { p: '0', justifyContent:'space-between' },
                                        p: '15px',
                                        '& .MuiAccordionSummary-content.Mui-expanded': {
                                            m: '0 0 20px 0'
                                        }


                                    }}>
                                    <AccordionSummary
                                        component="div"
                                        onClick={() => getDataRecipe(el._id)}
                                        expandIcon={<ExpandMoreIcon sx={{ color: 'text.primary' }} />}
                                        aria-controls={`panel1-content${el._id}`}
                                        id={`panel1-header${el._id}`}
                                        sx={{
                                            '& .MuiAccordionSummary-content': {
                                                alignItems: 'center',
                                                m: '0',
                                                maxWidth: '97%'
                                            },

                                        }}
                                    >

                                        {el.recipe_media.type === 'image' ?
                                            <Box
                                                component='img'
                                                alt={el.recipe_name}
                                                sx={{ height: '60px', width: '60px', objectFit: 'cover', borderRadius: '50%' }}
                                                src={el.recipe_media.url as string}
                                                loading="lazy"
                                            />
                                            :
                                            <Box
                                                component='video'
                                                sx={{ height: '60px', objectFit: "cover", width: '60px', borderRadius: '50%' }}
                                                autoPlay
                                                loop
                                                muted
                                                poster={el.recipe_media.url as string}
                                            >
                                                <source
                                                    src={el.recipe_media.url as string}
                                                    type="video/mp4"
                                                />
                                            </Box>
                                        }

                                        <Typography sx={{
                                            m: '0 auto',
                                            fontSize: '18px',
                                            maxWidth: "65%",
                                            overflow: 'hidden',
                                            whiteSpace: 'nowrap',
                                            textOverflow: 'ellipsis'
                                        }}>{el.recipe_name}</Typography>


                                    </AccordionSummary>

                                    
                                    <ContentAccordion props={{ _id: el._id, status: loadingRecipeIds.includes(el._id) && el.ingredients_list.length === 0 }} />

                                

                                    {expandedIds.includes(el._id) ?
                                        <Button
                                            onClick={() => handleDeleteRecipe(el._id)}
                                            sx={{ position: 'absolute', top: '5px', right: '5px', minWidth: "0", p: '0' }}
                                        >
                                            <DeleteIcon sx={{
                                                width: '22px',
                                                height: '22px',
                                                [theme.breakpoints.down('md')]: {
                                                    width: '18px',
                                                    height: '18px',
                                                },
                                            }}></DeleteIcon>
                                        </Button>
                                        :
                                        null
                                    }
                                </Accordion>


                            </Box>

                        ))
            }

            {
                !statusListRecipe && listRecipeStore.recipes.length > 0 ? 
                <Button
                    disabled={pageListRecipe === null ? true : false}
                    sx={{
                        ...styleLink, 
                        backgroundColor:"primary.dark",
                        display:'flex',
                        alignItems:'center',
                        width: '150px', 
                        height: '32.5px', 
                        m: '20px auto',
                        color:'white',
                        '@media (hover: hover) and (pointer: fine)': {
                            "&:hover":{
                                backgroundColor:"primary.main",
                            },
                        },
                        [theme.breakpoints.down("md")]: {
                            mt: '7px',
                            mb: '7px',
                            width: '90px'
                        },
                        [theme.breakpoints.down(500)]: {
                            height: '28px'
                        }
                    }}
                    onClick={() => handleMore()}
                >More</Button>
                :
                statusListRecipe && listRecipeStore.recipes.length > 0 ?
                <UXLoading position={'static'}></UXLoading>
                :
                <></>
            }

        </Box>
    )

}