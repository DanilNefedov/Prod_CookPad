'use client';

import { linksBar } from '@/app/(main)/home/styles';
import { TabObject } from '@/app/(main)/home/types';
import { useNavigationState } from '@/config/home-navigation/ContextNavigation';
import { useAppSelector } from '@/state/hook';
import { Skeleton, Tab, Tabs } from '@mui/material';
import NextLink from 'next/link';
import { useEffect, useMemo } from 'react';




export default function TabsRender() {
  const recipeStore = useAppSelector((state) => state.recipe.recipes);
  const recipesStatus = useAppSelector((state) => state.recipe.operations.fetchRecipes); 
  const renderedNavigation = recipeStore.map((recipe) => ({
    sorting: recipe.sorting,
    _id: recipe.recipe_id,
  }));  

  const { handlerNavigation, nav } = useNavigationState();

  const tabObjects: TabObject[] = useMemo(() => {

    if (recipesStatus.loading) {
      return Array.from({ length: 6 }, (_, idx) => ({
        key: `skeleton-${idx}`,
        label: '',
      }));
    }

    const uniqueTabsSet = new Set<string>();

    return renderedNavigation
      .flatMap((recipe) =>
        recipe.sorting
          .filter((item) => item && !uniqueTabsSet.has(item.toLowerCase()))
          .map((item) => {
            const lower = item.toLowerCase();
            uniqueTabsSet.add(lower);

            return {
              key: lower,
              label: capitalizeFirstLetter(item),
            };
          })
      )
      .sort((a, b) => a.label.localeCompare(b.label));
  }, [renderedNavigation]);

  const tabKeys: string[] = useMemo(
    () => ['all', ...tabObjects.map((obj) => obj.key)],
    [tabObjects]
  );

  const safeNav = useMemo(() => {
    return tabKeys.includes(nav) ? nav : 'all';
  }, [nav, tabKeys]);

  useEffect(() => {
    if (!tabKeys.includes(nav)) {
      handlerNavigation('all');
    }
  }, [tabKeys, nav, handlerNavigation]);



  function capitalizeFirstLetter(str: string) {
    return str.charAt(0).toUpperCase() + str.slice(1);
  }

  return (
    <Tabs
      value={safeNav}
      variant="scrollable"
      scrollButtons
      allowScrollButtonsMobile
      aria-label="scrollable force tabs"
      sx={{
        minHeight: '0',
        '.MuiTabScrollButton-root': {
          width: '25px'
        }
      }}
    >
      <Tab
        key="all"
        label="All"
        sx={linksBar}
        component={NextLink}
        href="#"
        value="all"
        onClick={() => handlerNavigation('all')}
      />

      {tabObjects.map(({ key, label }) => {
        if (key.startsWith('skeleton')) {
          return (
            <Tab
              key={key}
              label={<Skeleton component={'a'} variant="text" sx={[linksBar, {width:'100%', mr:'0'}]} />}
              sx={[linksBar, {p:'0', width:'75px'}]}
              disabled
            />
          );
        }

        return (
          <Tab
            key={key}
            label={label}
            sx={linksBar}
            component={NextLink}
            href="#"
            value={key}
            onClick={() => handlerNavigation(key)}
          />
        );
      })}

    </Tabs>
  );
}