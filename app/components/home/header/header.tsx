import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import TabsRenderer from './tabs';
import { theme } from '@/config/ThemeMUI/theme';



  export const styleLink = {
    textTransform: 'initial',
    // fontSize:'16px',
    padding: '4px 12px',
    minHeight: '0',
    minWidth: '0',
    mr: '15px',
    borderRadius: '10px',

    [theme.breakpoints.down("md")]: {
      fontSize:'12px'
    },
  }



export default function Header() {
  // const renderedNavigation = [
  //   { typeNav: 'Breakfast', _id: '1' },
  //   { typeNav: 'Lunch', _id: '2' },
  //   { typeNav: 'Dinner', _id: '3' },
  // ];

  return (
    <AppBar
      component="nav"
      position="static"
      color="transparent"
      sx={{
        boxShadow: 'none',
        m: '10px 0',
        borderRadius: '20px',
        backgroundColor: 'background.default',
        padding: '10px 10px',

         [theme.breakpoints.down("md")]: {
          padding: '5px 5px',
          borderRadius: '10px',
        },
      }}
    >
      <Toolbar
        sx={{
          justifyContent: 'space-between',
          // mr: '25px',
          '&.MuiToolbar-root': {
            paddingLeft: 0,
            paddingRight: 0,
            minHeight: 0,
          },
        }}
      >
        <Box
          sx={{
            width: '100%',
            bgcolor: 'transparent',
            minHeight: '0',
          }}
        >
          <TabsRenderer
            // renderedNavigation={renderedNavigation}
            styleLink={styleLink}
          />
        </Box>

      </Toolbar>
    </AppBar>
  );
}
