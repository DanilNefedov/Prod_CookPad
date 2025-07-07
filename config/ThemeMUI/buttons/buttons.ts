import { Components, Theme } from "@mui/material";




const buttons: Components<Theme>['MuiButton'] = {
    defaultProps: {
        disableElevation: true,
        variant: 'contained',
        size: 'medium',
    },
    styleOverrides: {
        root: {
            borderRadius: 15,
            textTransform: 'none',
            fontWeight: 'normal',
            fontSize:'14px',
            padding: '8px 16px',
            minWidth: '0',
            height:"auto",
            maxHeight:'35px',
        },
    },
    variants: [
        {
            props: { color: 'grayButton' },
            style: ({ theme }) => ({
                backgroundColor: theme.palette.secondary.main,
                color: theme.palette.text.primary,
                '@media (hover: hover) and (pointer: fine)': {
                    '&:hover': {
                        backgroundColor: theme.palette.primary.main,
                    },
                }
                
            }),
        },
        {
            props: { color: 'blackRedBtn' },
            style: ({ theme }) => ({
                backgroundColor: theme.palette.primary.dark,
                color: theme.palette.text.primary,
                '@media (hover: hover) and (pointer: fine)': {
                    '&:hover': {
                        backgroundColor: theme.palette.primary.main,
                    },
                },
                
                '&.Mui-disabled': {
                    backgroundColor: theme.palette.primary.dark, 
                    color: theme.palette.common.black46,
                    opacity: 0.4,
                    cursor: 'not-allowed',
                },
            }),
        },
        {
            props: { color: 'blackBtn' },
            style: ({ theme }) => ({
                backgroundColor: theme.palette.background.default,
                color: theme.palette.text.primary,
                '@media (hover: hover) and (pointer: fine)': {
                    '&:hover': {
                        backgroundColor: theme.palette.primary.main,
                    },
                }
                
            }),
        },
        
    ],
};


export { buttons };