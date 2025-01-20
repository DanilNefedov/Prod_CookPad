'use client';

import { Tab, Tabs } from '@mui/material';
import NextLink from 'next/link';
import { useState } from 'react';

interface RenderedNavigationItem {
  _id: string | null;
  typeNav: string | null;
}

interface TabsRendererProps {
  renderedNavigation: RenderedNavigationItem[];
  styleLink: object;
}

export default function TabsRenderer({ renderedNavigation, styleLink }: TabsRendererProps) {
  const [value, setValue] = useState(0);

  const handleChange = (newValue: number, typeNav: string | null) => {
    setValue(newValue);
    console.log(`Navigated to ${typeNav}`); 
  };

  return (
    <Tabs
    value={value} 
    variant="scrollable"
    scrollButtons
    allowScrollButtonsMobile
    aria-label="scrollable force tabs"
    sx={{
      minHeight: '0',
      '.MuiTabScrollButton-root': {
        width: '25px',
      },
    }}
    >   
      <Tab
        key="all"
        label="All"
        sx={styleLink}
        component={NextLink}
        href="#"
        onClick={() => handleChange(0, 'all')}
      />
      <Tab
        key="favorite"
        label="Favorite"
        sx={styleLink}
        component={NextLink}
        href="#"
        onClick={() => handleChange(1, 'favorite')}
      />
      {renderedNavigation.map((el, index) => (
        <Tab
          key={el._id}
          label={el.typeNav}
          sx={styleLink}
          component={NextLink}
          href="#"
          onClick={() => handleChange(index + 2, el.typeNav)}
        />
      ))}
    </Tabs>
  );
}
