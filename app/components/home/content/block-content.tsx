'use client'

import { useEffect } from "react";
import { useNavigationState } from "../context-navigation";
import { useAppDispatch, useAppSelector } from "@/state/hook";
import { fetchRecipes } from "@/state/slices/recipe-slice";
import { CardContentBlock } from "./card-content-block";



export function BlockContent() {
  const dispatch = useAppDispatch()
  const recipeStore = useAppSelector(state => state.recipe)
  const userStore = useAppSelector(state => state.user)
  const { nav } = useNavigationState()
  const id = userStore?.user?.connection_id

  useEffect(() => {
    async function fetchData() {
      const url = `api/recipe?connection_id=${id}`

      if (id !== '') {
        dispatch(fetchRecipes(url))
      }
    }

    fetchData();
  }, [id]);

  console.log(recipeStore)
  const filteredRecipes = recipeStore.recipes.filter(recipe => recipe.sorting.includes(nav));

  return (
    (!recipeStore.status ?
      nav === 'all' ?
        recipeStore.recipes.map(({ recipe_id, media, name, time, recipe_type, description, favorite }) => (
          <CardContentBlock key={recipe_id}
            props={{recipe_id, media, name, time, recipe_type, description, favorite, id}}
          ></CardContentBlock>
        )) : filteredRecipes.map(({ recipe_id, media, name, time, recipe_type, description, favorite }) => (
          <CardContentBlock key={recipe_id}
            props={{recipe_id, media, name, time, recipe_type, description, favorite, id}}
          ></CardContentBlock>
        )
        )
      :
      <></>

    )
  );
};


