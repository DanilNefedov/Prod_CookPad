import { createTheme, outlinedInputClasses } from '@mui/material';



declare module '@mui/material/Button' {
  interface ButtonPropsColorOverrides {
    darkButton: true;
  }
  interface ButtonPropsColorOverrides {
    grayButton: true;
  }
  interface ButtonPropsColorOverrides {
    blackRedBtn: true;
  }

  
}


// Augment the palette to include an ochre color
declare module '@mui/material/styles' {
  interface Palette {
    ochre: Palette['primary'];
    // greyBtn: Palette['primary'];
  }

  interface PaletteOptions {
    ochre?: PaletteOptions['primary'];
    // greyBtn?: PaletteOptions['primary'];
  }


  
  interface PaletteOptions{
    grayButton?:PaletteOptions['primary']
  }
  interface PaletteOptions{
    darkButton?:PaletteOptions['primary']
  }
  interface PaletteOptions{
    blackRedBtn?:PaletteOptions['primary']
  }
  
}

// Update the Button's color options to include an ochre option
declare module '@mui/material/Button' {
  interface ButtonPropsColorOverrides {
    ochre: true;
  }
}





export const theme = createTheme({
  palette: {
    primary: {
      main: '#FF7269',
      light: "#ffc2b3",
      contrastText: '#FFFFFF',
      dark:'#A5514F',
    },
    secondary: {
      main: '#353842',
      dark: "#252830",
    },
    text: {
      primary: '#FFFFFF',
      secondary: "#8E94A4",//BDBDBD
      disabled: '#8E94A4'
    },
    background: {
      paper: '#353842',
      default: '#1F2128',
    },
    error:{
      main:'#FF7269',
      light: "#ffc2b3",
      contrastText: '#FFFFFF',
      dark:'#A5514F',
    },
    // greyBtn:{
    //   main:'#fff',
    //   light:'#B24F49',
    //   dark:'#1F2128',
    //   contrastText:'#fff'
    // },
    ochre: {
      main: '#1F2128',
      light: '#E9DB5D',
      dark: '#A29415',
      contrastText: '#8E94A4',
    },
    darkButton:{
      main: '#A5514F',
      light: "#ffc2b3",
      contrastText: '#FFFFFF',
      dark:'#FF7269',
    },
    blackRedBtn:{
      main:'#1F2128',
      dark: "#FF7269",
    },
    grayButton:{
      main: '#696d78',
      light: "#ffc2b3",
      contrastText: '#FFFFFF',
      dark:'#FF7269',
    }
  },
 
  shape: {
    borderRadius: 20,
  },
  components: {
    
    MuiContainer: {
      defaultProps: {
        color: 'red'
      }
    },
    MuiCardContent:{
      styleOverrides: {
        root: {
          '&:last-child': {
            paddingBottom: '9px'
          }
        }
      }
    },
    MuiLink: {
      styleOverrides: {
        root: {
          textDecoration: 'none',
        },
      },
    },
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          scrollbarColor: "#1F2128 #353842",
          "&::-webkit-scrollbar, & *::-webkit-scrollbar": {
            backgroundColor: "#353842",
            borderRadius: '10px'
          },
          "&::-webkit-scrollbar-thumb, & *::-webkit-scrollbar-thumb": {
            borderRadius: 8,
            backgroundColor: "#1F2128",
            minHeight: 24,
            border: "3px solid #353842",
          },
          "&::-webkit-scrollbar-thumb:focus, & *::-webkit-scrollbar-thumb:focus": {
            backgroundColor: "#959595",
          },
          "&::-webkit-scrollbar-thumb:active, & *::-webkit-scrollbar-thumb:active": {
            backgroundColor: "#959595",
          },
          "&::-webkit-scrollbar-thumb:hover, & *::-webkit-scrollbar-thumb:hover": {
            backgroundColor: "#959595",
          },
          "&::-webkit-scrollbar-corner, & *::-webkit-scrollbar-corner": {
            backgroundColor: "#353842",
          },
          
        },
      },
    },
    
    // MuiPaper: {
    //   styleOverrides: {
    //     root: {
    //       '&.MuiMenu-paper': {
    //         backgroundColor: '#1F2128',
    //       }
    //     }
    //   },
    // },
    

  },

  // typography:{
  //   fontSize:'18p'
  // }
});