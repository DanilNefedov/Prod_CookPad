import { Components, Theme } from '@mui/material'



const inputs: Components<Theme>['MuiTextField'] = {
    defaultProps: {
        variant: 'outlined',
        size: 'medium',
    },
}

const outlinedInput: Components<Theme>['MuiOutlinedInput'] = {
    styleOverrides: {
        root: ({ theme }) => ({
            borderRadius: 15,
            color: theme.palette.text.primary,
            backgroundColor:'transparent',

            '& .MuiOutlinedInput-notchedOutline': {
                borderColor: '#696d78',
            },

            '&:hover .MuiOutlinedInput-notchedOutline': {
                borderColor: theme.palette.text.primary,
            },

            '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                borderColor: theme.palette.text.primary,
            },

            '&.MuiInputLabel-formControl':{
                color:theme.palette.text.primary,
                opacity:'0.5'
            },

            '&.Mui-disabled': {
                opacity:'0.5'
            },
        }),
        input: {
            padding: '7px 14px',
        },
    },
}

const inputLabel: Components<Theme>['MuiInputLabel'] = {
    styleOverrides: {
        root: ({ theme }) => ({
            color: theme.palette.text.primary,
            opacity: 0.5,
            fontSize: '14px',
            fontHeight:'16px',
            transform: 'translate(16px, 9px) scale(1)',

            '&.Mui-focused, &.MuiFormLabel-filled':  {
                transform: 'translate(14px, -8px) scale(0.75)',
                color: theme.palette.text.primary,
                opacity: 1,
            },

            '&.Mui-disabled': {
                opacity: 0.4,
                color: theme.palette.text.disabled,
            },
        }),
    },
};


export { inputs, outlinedInput, inputLabel }