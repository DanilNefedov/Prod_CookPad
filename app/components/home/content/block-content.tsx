'use client'

import { useEffect } from "react";
import { useNavigationState } from "../context-navigation";
import { useAppDispatch, useAppSelector } from "@/state/hook";
import { fetchRecipes } from "@/state/slices/recipe-slice";
import { CardContentBlock } from "./card-content-block";
import { useFetchOnDependency } from "@/app/hooks/useReduxGet";
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
  const recipeStore = useAppSelector(state => state.recipe)
  const userStore = useAppSelector(state => state.user)
  const { nav } = useNavigationState()
  const id = userStore?.user?.connection_id

  useEffect(() => {
    async function fetchData() {
      const url = `api/recipe?connection_id=${id}&page=${recipeStore.page + 1}`

      if (id !== '' && recipeStore.recipes.length === 0) {
        dispatch(fetchRecipes(url))
      }
    }

    fetchData();
  }, [id]);

  const filteredRecipes = recipeStore.recipes.filter(recipe => recipe.sorting.includes(nav));

  return (
    <>
      {recipeStore.recipes.length > 0 ? (
        (nav === 'all' ? recipeStore.recipes : filteredRecipes).map(({ recipe_id, media, name, time, recipe_type, description, favorite }) => (
          <CardContentBlock
            key={recipe_id}
            props={{ recipe_id, media, name, time, recipe_type, description, favorite, id }}
          />
        ))
      ) : (
        <></>
      )}


      {
        nav === 'all' ?
          <Box sx={{ width: '100%', display: 'flex' }}>
            <Button variant="contained" color='darkButton'
              disabled={Number.isNaN(recipeStore.page)}
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
                dispatch(fetchRecipes(`api/recipe?connection_id=${id}&page=${recipeStore.page + 1}`))
              }}
            >More</Button>
          </Box>
          :
          <></>
      }
    </>

  );
};


