'use client';

import { TabObject } from '@/app/(main)/home/types';
import { useNavigationState } from '@/config/home-navigation/context-navigation';
import { useAppSelector } from '@/state/hook';
import { Tab, Tabs } from '@mui/material';
import NextLink from 'next/link';
import { useEffect, useMemo } from 'react';


interface Props {
  styleLink: Record<string, any>;
}



export default function TabsRenderer({ styleLink }: Props) {
  const recipeStore = useAppSelector((state) => state.recipe);
  const renderedNavigation = recipeStore.recipes.map((recipe) => ({
    sorting: recipe.sorting,
    _id: recipe.recipe_id,
  })); 

  const { handlerNavigation, nav } = useNavigationState();

  const tabObjects: TabObject[] = useMemo(() => {
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
        sx={styleLink}
        component={NextLink}
        href="#"
        value="all"
        onClick={() => handlerNavigation('all')}
      />

      {tabObjects.map(({ key, label }) => (
        <Tab
          key={key}
          label={label}
          sx={styleLink}
          component={NextLink}
          href="#"
          value={key}
          onClick={() => handlerNavigation(key)}
        />
      ))}
    </Tabs>
  );
}