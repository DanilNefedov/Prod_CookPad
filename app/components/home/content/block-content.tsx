'use client'

import { useEffect, useState, } from "react";
import { useNavigationState } from "../context-navigation";
import { useAppDispatch, useAppSelector } from "@/state/hook";
import { fetchRecipes } from "@/state/slices/recipe-slice";
import { CardContentBlock } from "./card-content-block";
import { Box, Button } from "@mui/material";
import { styleLink } from "../header/header";
import { theme } from "@/config/ThemeMUI/theme";
import { UXLoading } from "../../ux-helpers/loading";


export function BlockContent() {
  
  const dispatch = useAppDispatch();
  const recipes = useAppSelector(state => state.recipe.recipes);
  const page = useAppSelector(state => state.recipe.page);
  const id = useAppSelector(state => state.user?.user?.connection_id);
  const { nav } = useNavigationState()
  const [status, setStatus] = useState<boolean>(recipes.length === 0 ? true : false)
  const [statusMore, setStatusMore] = useState<boolean>(false)



  useEffect(() => {
      if (id !== '' && recipes.length === 0 && page === 1) {
        setStatus(true)
        dispatch(fetchRecipes({ id, page})).finally(() => {
          setStatus(false)
        });
      }
  }, [id, dispatch, page, recipes.length]); 
  

  const filteredRecipes = recipes.filter(recipe => recipe.sorting.includes(nav.toLowerCase()));

  return (
    <>
      {
        status && recipes.length === 0 ?
          <UXLoading></UXLoading>
        :
        (nav === 'all' ? recipes : filteredRecipes).map(({ recipe_id, }) => (
          <CardContentBlock
            key={recipe_id}
            props={{ recipe_id, id}}
          />
        ))
      }


      {
        
        statusMore && nav === 'all' ?
        <Box sx={{width:'100%'}}>
          <UXLoading position="static"></UXLoading>
        </Box>  
        :
        nav === 'all' && !status ?
          <Box sx={{ width: '100%', display: 'flex' }}>
            <Button variant="contained" color='darkButton'
              disabled={page === null ? true : false}
              sx={{ ...styleLink, width: '150px', height: '32.5px', m: '20px auto',
                [theme.breakpoints.down("md")]: {
                  mt:'7px',
                  mb:'7px',
                  width:'90px'
                },
                [theme.breakpoints.down(500)]: {
                  height:'28px'
                }
               }}
              onClick={() => {
                if(page === null) return
                setStatusMore(true)
                dispatch(fetchRecipes({ id, page: page})).finally(() => {
                  setStatusMore(false)
                });
              }}
            >More</Button>
          </Box>
          :
          <></>
      }
    </>
  );
};


