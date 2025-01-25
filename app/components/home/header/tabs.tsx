'use client';

import { useAppSelector } from '@/state/hook';
import { Tab, Tabs } from '@mui/material';
import NextLink from 'next/link';
import { useState } from 'react';
import { useNavigationState } from '../context-navigation';

interface RenderedNavigationItem {
  _id: string | null;
  typeNav: string | null;
}

interface TabsRendererProps {
  styleLink: object;
}

export default function TabsRenderer({ styleLink }: TabsRendererProps) {
  const [value, setValue] = useState(0);

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };


  const recipeStore = useAppSelector(state => state.recipe);
  const renderedNavigation = recipeStore.recipes.map((el) => ({
    typeNav: el.recipe_type,
    _id: el.recipe_id,
  }));

  const { handlerNavigation } = useNavigationState()

  const uniqueTypeNavs: string[] = [];
  const tabs = renderedNavigation
    .filter((el: RenderedNavigationItem) => el.typeNav !== null)
    .map((el: RenderedNavigationItem) => {
      const typeNavLower = el.typeNav!.toLowerCase();
      if (!uniqueTypeNavs.includes(typeNavLower)) {
        uniqueTypeNavs.push(typeNavLower);
        return (
          <Tab
          key={el._id}
          label={el.typeNav}
          sx={styleLink}
          component={NextLink}
          href="#"
          onClick={(e) => handlerNavigation(el.typeNav)}
          />
        );
      }
      return null;
    });

  return (
    <Tabs
    value={value}
    onChange={handleChange}
    variant="scrollable"
    scrollButtons
    allowScrollButtonsMobile
    aria-label="scrollable force tabs"
    sx={{
      minHeight: '0', '.MuiTabScrollButton-root': {
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
        onClick={(e) => handlerNavigation('all')}
       />
      <Tab
        key="favorite"
        label="Favorite"
        sx={styleLink}
        component={NextLink}
        href="#"
        onClick={(e) => handlerNavigation('favorite')}
      />
      {tabs}
    </Tabs>
  );
}
