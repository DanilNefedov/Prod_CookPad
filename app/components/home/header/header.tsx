'use client'



import NextLink from 'next/link'
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
// import { AddRecipe } from './addSection';
import { useAppSelector } from '@/app/Redux/hook';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Button from '@mui/material/Button'
import { Container, Tab } from '@mui/material';
import Tabs, { tabsClasses } from '@mui/material/Tabs';
import { useNavigationState } from '../context-navigation';
import Link from 'next/link';



  export const styleLink = {
    textTransform: 'initial',
    // fontSize:'16px',
    padding: '4px 12px',
    minHeight: '0',
    minWidth: '0',
    mr: '15px',
    color: 'text.primary',
    borderRadius: '10px',
  }

export function Header() {
  const pathName = usePathname();
  const recipeStore = useAppSelector(state => state.recipe);
  const renderedNavigation = recipeStore.recipes.map((el) => ({
    typeNav: el.recipe_type,
    _id: el.recipe_id,
  }));
  const { handlerNavigation } = useNavigationState()


  const styleLink = {
    fontWeight:'400', 
    textTransform:'initial', 
    color:'text.secondary',
    ':hover': {
        bgcolor: 'primary.main',
        color:'text.primary'
    },
    lineHeight:'inherit',
    backgroundColor:'background.paper',
}


  // useEffect(() => {
  //   if (pathName === '/home') {
  //     console.log(recipeStore);
  //   }
  // }, [pathName]);

  // console.log(renderedNavigation)


  const [value, setValue] = useState(0);

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };
  interface RenderedNavigationItem {
    _id: string | null;
    typeNav: string | null;
  }

  const uniqueTypeNavs: string[] = [];
  const tabs = renderedNavigation
    .filter((el: RenderedNavigationItem) => el.typeNav !== null)
    .map((el: RenderedNavigationItem) => {
      const typeNavLower = el.typeNav!.toLowerCase();
      if (!uniqueTypeNavs.includes(typeNavLower)) {
        uniqueTypeNavs.push(typeNavLower);
        return (
          <Tab
            component={NextLink}
            key={el._id}
            href="#"
            label={el.typeNav}
            sx={styleLink}
            onClick={(e) => handlerNavigation(el.typeNav)}
          />
        );
      }
      return null;
    });

  return (
    <>
      <AppBar component="nav" position='static' color='transparent' sx={{ boxShadow: 'none', m: '10px 0', borderRadius: '20px', backgroundColor: 'background.default', padding: '10px 10px' }}>
        {/* <Container maxWidth='xl'> */}
        <Toolbar sx={{
          justifyContent: 'space-between', mr: '25px', '&.MuiToolbar-root': {
            paddingLeft: 0,
            paddingRight: 0,
            minHeight: 0,
          },
        }}>
          <Box sx={{
            // flexGrow: 1,
            maxWidth: '85%',
            bgcolor: 'transparetn',
            minHeight: '0'
          }}>
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
              <Tab sx={styleLink} label="All" onClick={(e) => handlerNavigation('all')} />
              <Tab sx={styleLink} label="Favorite" onClick={(e) => handlerNavigation('favorite')} />
              {tabs}

            </Tabs>
          </Box>
          <Box sx={{ display: { xs: 'none', sm: 'block' }, flexGrow: '0' }}>
            {/* <AddRecipe></AddRecipe> */}
            <Button variant="contained" sx={styleLink} component={Link} href='/new-recipe'>
                New Recipe
            </Button> 
          </Box>
        </Toolbar>

        {/* </Container> */}

      </AppBar>

    </>
  );
}