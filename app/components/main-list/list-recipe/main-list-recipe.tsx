'use client'

import { useAppDispatch, useAppSelector } from "@/state/hook";
import { Box } from "@mui/material";
import { useEffect } from "react";






export function MainListRecipe() {
    const dispatch = useAppDispatch()
    const listRecipeStore = useAppSelector(state => state.listRecipe)
    const userStore = useAppSelector(state => state.user)


    useEffect(() => {
        if(userStore.user.connection_id !== ''){
            
        }
    }, [])


    console.log(listRecipeStore)
    return (
        <Box>
            {/* {listRecipeStore?.recipes.map(el => ( */}
                {/* <Accordion key={el.recipe_id} sx={{ backgroundColor: 'background.default', }}>
                    <AccordionSummary
                        onClick={() => getDataRecipe(el.recipe_id)}
                        expandIcon={<ExpandMoreIcon sx={{ color: 'text.primary' }} />}
                        aria-controls={`panel1-content${el.recipe_id}`}
                        id={`panel1-header${el.recipe_id}`}
                        sx={{ '& .MuiAccordionSummary-content': { alignItems: 'center' } }}
                    >

                        <MeidaList props={{ el }}></MeidaList>

                        <Typography sx={{ m: '0 auto', fontSize: '20px', }}>{el.recipe_name}</Typography>


                    </AccordionSummary>

                    <ContentAccordion props={{ ingredients_list: el.ingredients_list, id, recipe_id: el.recipe_id }}></ContentAccordion>
                </Accordion> */}
            {/* ))} */}

        </Box>
    )

}