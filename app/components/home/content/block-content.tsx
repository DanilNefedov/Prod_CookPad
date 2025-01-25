'use client'

import { useEffect } from "react";
import { useNavigationState } from "../context-navigation";
import { useAppSelector } from "@/state/hook";
import { fetchRecipes } from "@/state/slices/recipe-slice";
import { CardContentBlock } from "./card-content-block";
import { useFetchOnDependency } from "@/app/hooks/useReduxGet";



export function BlockContent() {
  const recipeStore = useAppSelector(state => state.recipe)
  const userStore = useAppSelector(state => state.user)
  const { nav } = useNavigationState()
  const id = userStore?.user?.connection_id
  useFetchOnDependency({ 
    url: `api/recipe?connection_id=${id}`, 
    data: null, 
    dep: [id], 
    actionName: fetchRecipes, 
  })

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


