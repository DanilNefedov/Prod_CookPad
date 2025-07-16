import { createTheme } from '@mui/material';
import { buttons } from './buttons/buttons';
import { iconButtons } from './buttons/icon-buttons';
import { inputLabel, inputs, outlinedInput } from './inputs/inputs';
import { list, listItem } from './lists/lists';
import { baseline } from './baseline/baseline';
import { typography } from './text/typography';
import { chip } from './chip/chip';
// import { circularProgress } from './loaders/circular';
// import { container } from './blocks/container';





export const theme = createTheme({
  palette: {
    primary: {
      main: '#FF7269',
      contrastText: '#FFFFFF',
      dark: '#A5514F',
    },
    secondary: {
      main: '#353842',
    },
    text: {
      primary: '#FFFFFF',
      disabled: '#8E94A4',
      lightGray:'#B7BED3'
    },
    background: {
      paper: '#353842',
      default: '#1F2128',
    },
    supportBackground: {
      light: '#585B66',
      dark: '#15161B'
    },
    error: {
      main: '#FF7269',
      light: "#ffc2b3",
      contrastText: '#FFFFFF',
      dark: '#A5514F',
    },
    common:{
      cardBlack7:'rgba(31,33,40, 0.7)',
      black46:'rgba(0, 0, 0, 0.46)' ,
    }
  },
  shape: {
    borderRadius: 20,
  },
  components: {
    MuiButton: buttons,
    MuiIconButton: iconButtons,
    MuiTextField: inputs,
    MuiOutlinedInput: outlinedInput,
    MuiInputLabel: inputLabel,
    MuiList: list,
    MuiListItem: listItem,
    MuiTypography: typography,
    MuiChip:chip,
    // MuiContainer: container,
    // MuiCircularProgress:circularProgress,
    MuiLink: {
      styleOverrides: {
        root: {
          transition:'0.2s',
          textDecoration: 'none',
        },
      },
    },
    MuiCssBaseline: baseline
  },
});