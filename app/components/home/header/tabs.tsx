'use client';

import { useAppSelector } from '@/state/hook';
import { Tab, Tabs } from '@mui/material';
import NextLink from 'next/link';
import { useState } from 'react';
import { useNavigationState } from '../context-navigation';

// interface RenderedNavigationItem {
//   _id: string | null;
//   typeNav: string | null;
// }

interface TabsRendererProps {
  styleLink: object;
}

export default function TabsRenderer({ styleLink }: TabsRendererProps) {
  const [value, setValue] = useState(0);

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  function capitalizeFirstLetter(str:string) {
    return str.charAt(0).toUpperCase() + str.slice(1);
  }


  const recipeStore = useAppSelector(state => state.recipe);
  const renderedNavigation = recipeStore.recipes.map((el) => ({
    sorting: el.sorting, 
    _id: el.recipe_id,
  }));

  const { handlerNavigation } = useNavigationState();

  const uniqueTabs: string[] = [];
  const tabs = renderedNavigation
  .flatMap((el) => 
    el.sorting
      .filter((sortingItem) => sortingItem && !uniqueTabs.includes(sortingItem.toLowerCase())) 
      .map((sortingItem) => {
        uniqueTabs.push(sortingItem.toLowerCase()); 
        return (
          <Tab
            key={sortingItem}
            label={capitalizeFirstLetter(sortingItem)}
            sx={styleLink}
            component={NextLink}
            href="#"
            onClick={() => handlerNavigation(sortingItem)}
          />
        );
      })
  );


  return (
    <Tabs
      value={value}
      onChange={handleChange}
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
        onClick={() => handlerNavigation('all')}
      />
      
      {tabs}
    </Tabs>
  );
}
