import { Components, Theme } from "@mui/material";




const chip: Components<Theme>['MuiChip'] = {
    styleOverrides: {
        root: ({ theme }) => ({
            fontSize: '14px',
            
        }),
    },
    variants: [
        {
            props: { color: 'darkRed' },
            style: ({ theme }) => ({
                backgroundColor: theme.palette.primary.dark,
                color: theme.palette.text.primary,
                '@media (hover: hover) and (pointer: fine)': {
                    '&:hover': {
                        backgroundColor: theme.palette.primary.main,
                    },
                },
                '& .MuiChip-deleteIcon': {
                    color:'rgb(255 255 255 / 56%);',

                    '@media (hover: hover) and (pointer: fine)': {
                        '&:hover': {
                            color: theme.palette.text.primary,
                        },
                    },
                },
                
            }),
        },
        {
            props: { color: 'darkBg' },
            style: ({ theme }) => ({
                backgroundColor: theme.palette.background.default,
                color: theme.palette.text.primary,
                '@media (hover: hover) and (pointer: fine)': {
                    '&:hover': {
                        backgroundColor: theme.palette.primary.main,
                    },
                },
                '& .MuiChip-deleteIcon': {
                    opacity:'0.6',

                    '@media (hover: hover) and (pointer: fine)': {
                        '&:hover': {
                            opacity:'1',
                            color: theme.palette.text.primary,
                        },
                    },
                },
                
            }),
        },
        {
            props: { color: 'secondary' },
            style: ({ theme }) => ({
                '@media (hover: hover) and (pointer: fine)': {
                    '&:hover': {
                        backgroundColor: theme.palette.primary.main,
                    },
                },
                '& .MuiChip-deleteIcon': {
                    opacity:'0.6',

                    '@media (hover: hover) and (pointer: fine)': {
                        '&:hover': {
                            opacity:'1',
                            color: theme.palette.text.primary,
                        },
                    },
                },
                
            }),
        },
    ]
};


export { chip };