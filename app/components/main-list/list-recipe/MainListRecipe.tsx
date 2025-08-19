'use client'

import { useAppDispatch, useAppSelector } from "@/state/hook";
import { deleteListRecipe, ingredientsListRecipe, preLoaderMain } from "@/state/slices/list-recipe-slice";
import { Accordion, AccordionSummary, Box, Button, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ContentAccordion from "./ContentAccordion";
import { UXLoading } from "../../ui-helpers/UXLoading";
import { EmptyInfo } from "../../ui-helpers/EmptyInfo";
import DeleteIcon from '@mui/icons-material/Delete';
import { accordion, accordionMediaBox, accordionName, accordionSumm, 
    containerAccordion, deleteRecipeBtn, deleteRecipeIcon, mainContainerList } from "@/app/(main)/(main-list)/list-recipe/styles";
import { textMaxWidth } from "@/app/styles";
import { moreButton } from "@/app/(main)/(main-list)/list/styles";




export function MainListRecipe() {
    const dispatch = useAppDispatch()
    const listRecipeStore = useAppSelector(state => state.listRecipe.recipes)
    const pageListRecipe = useAppSelector(state => state.listRecipe.page)
    const isPreloadingLoading = useAppSelector(state => state.listRecipe.operations.preLoaderMain.loading);    
    const isPreloadingError = useAppSelector(state => state.listRecipe.operations.preLoaderMain.error)
    const connection_id = useAppSelector(state => state.user.user.connection_id)

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
        const findThisRecipe = listRecipeStore ? listRecipeStore[_id] : undefined;

        if (findThisRecipe && findThisRecipe.ingredient_ids.length <= 0) {
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
        <Box sx={mainContainerList}>
            {
                !isPreloadingError && isPreloadingLoading && Object.keys(listRecipeStore).length === 0 ?
                    <UXLoading ></UXLoading>//color:'#1F2128'
                    :
                    !isPreloadingLoading && Object.keys(listRecipeStore).length === 0 ?
                        <EmptyInfo></EmptyInfo>
                        :
                        Object.values(listRecipeStore).map(el => (

                            <Box key={el._id} sx={containerAccordion}>
                                <Accordion
                                    expanded={expandedIds.includes(el._id)}
                                    onChange={() => handleToggle(el._id)}
                                    slotProps={{ heading: { component: 'div' } }}
                                    // square={false}  

                                    sx={accordion}>
                                    <AccordionSummary
                                        component="div"
                                        onClick={() => getDataRecipe(el._id)}
                                        expandIcon={<ExpandMoreIcon sx={{ color: 'text.primary' }} />}
                                        aria-controls={`panel1-content${el._id}`}
                                        id={`panel1-header${el._id}`}
                                        sx={accordionSumm}
                                    >
                                        {el.recipe_media.type === 'image' ?
                                            <Box
                                                component='img'
                                                alt={el.recipe_name}
                                                sx={accordionMediaBox}
                                                src={el.recipe_media.url as string}
                                                loading="lazy"
                                            />
                                            :
                                            <Box
                                                component='video'
                                                sx={accordionMediaBox}
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

                                        <Typography sx={[accordionName, textMaxWidth]}>{el.recipe_name}</Typography>

                                    </AccordionSummary>

                                    
                                    <ContentAccordion props={{ _id: el._id, status: loadingRecipeIds.includes(el._id) && el.ingredient_ids.length === 0 }} />

                                

                                    {expandedIds.includes(el._id) ?
                                        <Button
                                            onClick={() => handleDeleteRecipe(el._id)}
                                            sx={deleteRecipeBtn}
                                        >
                                            <DeleteIcon sx={deleteRecipeIcon}></DeleteIcon>
                                        </Button>
                                        :
                                        null
                                    }
                                </Accordion>


                            </Box>

                        ))
            }

            {
                !isPreloadingLoading && Object.keys(listRecipeStore).length > 0 ? 
                <Button
                    disabled={pageListRecipe === null ? true : false}
                    color='blackRedBtn'
                    sx={moreButton}
                    onClick={() => handleMore()}
                >More</Button>
                :
                isPreloadingLoading && Object.keys(listRecipeStore).length > 0 ?
                <UXLoading position={'static'}></UXLoading>
                :
                <></>
            }

        </Box>
    )

}