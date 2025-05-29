'use client';

import { useAppSelector } from '@/state/hook';
import { Tab, Tabs } from '@mui/material';
import NextLink from 'next/link';
import { useEffect, useMemo } from 'react';
import { useNavigationState } from '../context-navigation';


interface TabsRendererProps {
  styleLink: object;
}
export default function TabsRenderer({ styleLink }: TabsRendererProps) {
  const recipeStore = useAppSelector(state => state.recipe);
  const renderedNavigation = recipeStore.recipes.map((el) => ({
    sorting: el.sorting,
    _id: el.recipe_id,
  }));

  const { handlerNavigation, nav } = useNavigationState();

  const uniqueTabs: string[] = [];

  const tabObjects = renderedNavigation
    .flatMap((el) =>
      el.sorting
        .filter((sortingItem) => sortingItem && !uniqueTabs.includes(sortingItem.toLowerCase()))
        .map((sortingItem) => {
          uniqueTabs.push(sortingItem.toLowerCase());
          return {
            key: sortingItem.toLowerCase(),
            label: capitalizeFirstLetter(sortingItem),
          };
        })
    )
    .sort((a, b) => a.label.localeCompare(b.label));

  const tabKeys = ['all', ...uniqueTabs];

  const safeNav = useMemo(() => {
    return tabKeys.includes(nav) ? nav : 'all';
  }, [nav, tabKeys]);

  useEffect(() => {
    if (!tabKeys.includes(nav)) {
      handlerNavigation('all');
    }
  }, [nav, tabKeys.join(','), handlerNavigation]);



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