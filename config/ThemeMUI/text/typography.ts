import { Components, Theme } from "@mui/material";




const typography: Components<Theme>['MuiTypography'] = {
    styleOverrides: {
        root: ({ theme }) => ({
            fontSize: '16px',
            [theme.breakpoints.down("md")]: {
                fontSize: '14px',
            },
        }),
    },
    
};


export { typography };