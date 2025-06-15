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
import { EmptyInfo } from "../../ux-helpers/empty-info";
import Link from "next/link";


export function BlockContent() {
  
  const dispatch = useAppDispatch();
  const recipes = useAppSelector(state => state.recipe.recipes);
  const page = useAppSelector(state => state.recipe.page);
  const id = useAppSelector(state => state.user?.user?.connection_id);
  const { nav } = useNavigationState()
  // const [status, setStatus] = useState<boolean>(recipes.length === 0 ? true : false)
  const status = useAppSelector(state => state.recipe.operations.fetchRecipes.loading)
  const [statusMore, setStatusMore] = useState<boolean>(false)



  useEffect(() => {
      if (id !== '' && recipes.length === 0 && page === 1) {
        // setStatus(true)
        dispatch(fetchRecipes({ id, page}))
        // .finally(() => {
          // setStatus(false)
        // });
      }
  }, [id, dispatch, page, recipes.length]); 
  

  const filteredRecipes = recipes.filter(recipe => recipe.sorting.includes(nav.toLowerCase()));

  // if(!status && recipes.length === 0) return (<><EmptyInfo ></EmptyInfo> <Link href={'/new-recipe'}>Create new one</Link></>)

  return (
    <>
      {
        status && recipes.length === 0 ?
          <UXLoading></UXLoading>
        :
        !status && recipes.length === 0 ? 
        <>
          <EmptyInfo></EmptyInfo> 
          <Button component={Link} href="/new-recipe"
             
            sx={[styleLink, {
              bgcolor:'background.default',
              position: 'absolute',
              top: '65%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              transition:"0.3s",
              '@media (hover: hover) and (pointer: fine)': {
                  '&:hover': {
                    backgroundColor: 'primary.main',
                    color:'text.primary'
                  },
              },
            }]}
          >
            Create a new
          </Button>
        </>
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
        nav === 'all' && !status && recipes.length !== 0 ?
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


