import { Components, Theme } from '@mui/material'





const iconButtons: Components<Theme>['MuiIconButton'] = {
    defaultProps: {
        color: 'default', 
    },
    styleOverrides: {
        root: {
            padding:'0',
            width:'24px',
            height:'24px',
            transition:'all 0.2s',
        },
    },
    variants: [
        {
            props: { color: 'grayRed' },
            style: ({ theme }) => ({
                color: theme.palette.text.disabled,
                '@media (hover: hover) and (pointer: fine)': {
                    '&:hover': {
                        color: theme.palette.primary.main,
                    },
                }
            }),
        },
        {
            props: { color: 'redGray' },
            style: ({ theme }) => ({
                color: theme.palette.primary.main,
                '@media (hover: hover) and (pointer: fine)': {
                    '&:hover': {
                        color: theme.palette.primary.light,
                    },
                }
            }),
        },
        {
            props: { color: 'white' },
            style: ({ theme }) => ({
                color: theme.palette.text.primary,
            }),
        },
    ],
}


export { iconButtons }