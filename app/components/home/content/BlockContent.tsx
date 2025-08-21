'use client'

import { useEffect, useState, } from "react";
import { useAppDispatch, useAppSelector } from "@/state/hook";
import { fetchRecipes } from "@/state/slices/recipe-slice";
import { CardContentBlock } from "./CardContentBlock";
import { Box, Button } from "@mui/material";
import { UXLoading } from "../../ui-helpers/UXLoading";
import { EmptyInfo } from "../../ui-helpers/EmptyInfo";
import Link from "next/link";
import { useNavigationState } from "@/config/home-navigation/ContextNavigation";
import { linkEmptyPage, moreButtonContainer } from "@/app/(main)/home/styles";
import { moreButton } from "@/app/styles";


export function BlockContent() {
  
  const dispatch = useAppDispatch();
  const recipes = useAppSelector(state => state.recipe.recipes);
  const page = useAppSelector(state => state.recipe.page);
  const id = useAppSelector(state => state.user?.user?.connection_id);
  const { nav } = useNavigationState()
  const status = useAppSelector(state => state.recipe.operations.fetchRecipes.loading)
  const [statusMore, setStatusMore] = useState<boolean>(false)



  useEffect(() => {
      if (id !== '' && recipes.length === 0 && page === 1) {
        dispatch(fetchRecipes({ id, page}))
      }
  }, [id, dispatch, page, recipes.length]); 
  

  const filteredRecipes = recipes.filter(recipe => recipe.sorting.includes(nav.toLowerCase()));
 

  return (
    <>
      {status && recipes.length === 0 && (
        <UXLoading />
      )}
      {!status && recipes.length === 0 && (
        <>
          <EmptyInfo />
          <Button
            component={Link}
            href="/new-recipe"
            color="blackBtn"
            sx={linkEmptyPage}
          >
            Create a new
          </Button>
        </>
      )}
     
      {recipes.length > 0 && (
        (nav === 'all' ? recipes : filteredRecipes).map(({ recipe_id }) => (
          <CardContentBlock key={recipe_id} props={{ recipe_id, id }} />
        ))
      )}

      {statusMore && nav === 'all' && (
        <Box sx={{ width: '100%' }}>
          <UXLoading position="static" />
        </Box>
      )}


      {!statusMore && nav === 'all' && !status && recipes.length !== 0 && (
        <Box sx={moreButtonContainer}>
          <Button
            color="blackRedBtn"
            disabled={page === null}
            sx={moreButton}
            onClick={() => {
              if (page === null) return;
              setStatusMore(true);
              dispatch(fetchRecipes({ id, page }))
                .finally(() => {
                  setStatusMore(false);
                });
            }}
          >
            More
          </Button>
        </Box>
      )}
    </>
  );
};


