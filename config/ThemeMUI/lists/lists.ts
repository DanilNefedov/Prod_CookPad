import { Components, Theme } from '@mui/material'



const list: Components<Theme>['MuiList'] = {
    styleOverrides: {
        root: ({ theme }) => ({
            padding: 0,
        }),
    },
};

const listItem: Components<Theme>['MuiListItem'] = {
    styleOverrides: {
        root: ({ theme }) => ({
            padding: 0,
        }),
    },
};


export { listItem, list }