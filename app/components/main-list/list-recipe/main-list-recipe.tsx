'use client'

import { useAppDispatch, useAppSelector } from "@/state/hook";
import { ingredientsListRecipe, preLoaderMain } from "@/state/slices/list-recipe-slice";
import { Accordion, AccordionSummary, Box, Typography } from "@mui/material";
import { useEffect } from "react";
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { ContentAccordion } from "./content-accordion";





export function MainListRecipe() {
    const dispatch = useAppDispatch()
    const listRecipeStore = useAppSelector(state => state.listRecipe)
    const userStore = useAppSelector(state => state.user)
    const connection_id = userStore.user.connection_id

    useEffect(() => {
        if (connection_id !== '') {
            dispatch(preLoaderMain({ connection_id, page: listRecipeStore.page + 1 }))
        }
    }, [connection_id])


    function getDataRecipe(recipe_id: string) {
        const findThisRecipe = listRecipeStore.recipes.find(el => el.recipe_id === recipe_id);
        if (findThisRecipe && findThisRecipe.ingredients_list?.length <= 0) {
            if (connection_id !== '') {
                dispatch(ingredientsListRecipe({ connection_id, recipe_id }));
            }
        }
    }


    return (
        <Box sx={{height:'100%', }}>
            {listRecipeStore?.recipes.map(el => (
                <Accordion 
                    // square={false}  
                    key={el.recipe_id} 
                    sx={{ 
                    backgroundColor: 'background.default', 
                    height:'auto', 
                    overflow:'none',
                    mb: '5px',
                    '&:first-of-type': { borderTopLeftRadius: '10px', borderTopRightRadius: '10px' },
                    '&:last-of-type': { borderBottomLeftRadius: '10px', borderBottomRightRadius: '10px' },
                    '&.Mui-expanded': {m: '5px 0 ',},
                    '& .MuiButtonBase-root.MuiAccordionSummary-root':{p:'0'},
                    p:'15px',
                    '& .MuiAccordionSummary-content.Mui-expanded':{
                        m:'0 0 20px 0'
                    }
                    
                }}>
                    <AccordionSummary
                        onClick={() => getDataRecipe(el.recipe_id)}
                        expandIcon={<ExpandMoreIcon sx={{ color: 'text.primary' }} />}
                        aria-controls={`panel1-content${el.recipe_id}`}
                        id={`panel1-header${el.recipe_id}`}
                        sx={{ 
                            '& .MuiAccordionSummary-content': { 
                                alignItems: 'center',
                                m:'0',
                                maxWidth:'97%'
                            },
                        
                        }}
                    >

                        {el.recipe_media.type === 'image' ?
                            <Box
                                component='img'
                                alt={el.recipe_name}
                                sx={{ height: '60px', width:'60px', objectFit: 'cover', borderRadius: '50%' }}
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
                            maxWidth:"65%",
                            overflow: 'hidden',
                            whiteSpace: 'nowrap',
                            textOverflow: 'ellipsis'
                        }}>{el.recipe_name}</Typography>


                    </AccordionSummary>

                    <ContentAccordion props={{ ingredients_list: el.ingredients_list, connection_id, recipe_id: el.recipe_id }}></ContentAccordion>
                </Accordion>
            ))}

        </Box>
    )

}