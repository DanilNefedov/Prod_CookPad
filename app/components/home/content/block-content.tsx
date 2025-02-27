'use client'

import { useEffect, useMemo } from "react";
import { useNavigationState } from "../context-navigation";
import { useAppDispatch, useAppSelector } from "@/state/hook";
import { fetchRecipes } from "@/state/slices/recipe-slice";
import { CardContentBlock } from "./card-content-block";
import { Box, Button } from "@mui/material";
import { styleLink } from "../header/header";
import { theme } from "@/config/ThemeMUI/theme";

// useFetchOnDependency({ 
//   url: `api/recipe?connection_id=${id}&page=${recipeStore.page + 1}`, 
//   data: null, 
//   dep: [id], 
//   actionName: fetchRecipes, 
// })

export function BlockContent() {
  const dispatch = useAppDispatch();
  const recipes = useAppSelector(state => state.recipe.recipes);
  const page = useAppSelector(state => state.recipe.page);
  const id = useAppSelector(state => state.user?.user?.connection_id);
  const { nav } = useNavigationState()

  // useEffect(() => {
  //   async function fetchData() {
  //     const url = `api/recipe?connection_id=${id}&page=${recipeStore.page + 1}`

  //     if (id !== '' && recipeStore.recipes.length === 0) {
  //       dispatch(fetchRecipes(url))
  //     }
  //   }

  //   fetchData();
  // }, [id]);

  useEffect(() => {
    async function fetchData() {
      const url = `api/recipe?connection_id=${id}&page=${page + 1}`;
  
      if (id !== '' && recipes.length === 0) {
        dispatch(fetchRecipes(url));
      }
    }
  
    fetchData();
  }, [id, dispatch, page, recipes.length]); 
  

  const filteredRecipes = recipes.filter(recipe => recipe.sorting.includes(nav.toLowerCase()));
  
  // const filteredRecipes = useMemo(() => {
  //   return recipes.filter(recipe => recipe.sorting.includes(nav));
  // }, [recipes, nav]);


  console.log(recipes, filteredRecipes, nav)
  return (
    <>
      {recipes.length > 0 ? (
        (nav === 'all' ? recipes : filteredRecipes).map(({ recipe_id, media, name, time, recipe_type, description, favorite }) => (
          <CardContentBlock
            key={recipe_id}
            props={{ recipe_id, id}}

            // props={{ recipe_id, media, name, time, recipe_type, description, favorite, id }}
          />
        ))
      ) 
      : (
        <></>
      )}


      {
        nav === 'all' ?
          <Box sx={{ width: '100%', display: 'flex' }}>
            <Button variant="contained" color='darkButton'
              disabled={Number.isNaN(page)}
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
                console.log('22')
                dispatch(fetchRecipes(`api/recipe?connection_id=${id}&page=${page + 1}`))
              }}
            >More</Button>
          </Box>
          :
          <></>
      }
    </>

  );
};


