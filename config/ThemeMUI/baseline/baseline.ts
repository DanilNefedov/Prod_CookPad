import { Components, Theme } from "@mui/material";


const baseline: Components<Theme>['MuiCssBaseline'] = {
    styleOverrides: {
        '*': {
            padding: 0,
            margin: 0,
            border: 0,
            boxSizing: 'border-box',
        },
        '*::before': {
            boxSizing: 'inherit',
        },
        '*::after': {
            boxSizing: 'inherit',
        },
        ':focus': {
            outline: 'none',
        },
        ':active': {
            outline: 'none',
        },
        'a:focus': {
            outline: 'none',
        },
        'a:active': {
            outline: 'none',
        },
        'nav, footer, header, aside': {
            display: 'block',
        },
        html: {
            height: '100%',
            width: '100%',
        },
        body: {
            height: '100%',
            width: '100%',
            backgroundColor: '#1F2128',
            color: '#FFFFFF',
            fontWeight: 400,
            fontSize: '16px',
            letterSpacing: '0.8px',
            overflow: 'hidden',
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
            '@media (hover: hover) and (pointer: fine)': {
                "&::-webkit-scrollbar-thumb:hover, & *::-webkit-scrollbar-thumb:hover": {
                    backgroundColor: "#959595",
                },
            },
            "&::-webkit-scrollbar-corner, & *::-webkit-scrollbar-corner": {
                backgroundColor: "#353842",
            },
        },
        'input::-ms-clear': {
            display: 'none',
        },
        input: {
            outline: 'none !important',
        },
        button: {
            cursor: 'pointer',
            fontFamily: 'inherit',
            fontWeight: 'inherit',
            fontSize: 'inherit',
            transition:'all 0.2s'
        },
        'button::-moz-focus-inner': {
            padding: 0,
            border: 0,
            fontFamily: 'inherit',
            fontWeight: 'inherit',
            fontSize: 'inherit',
        },
        a: {
            textDecoration: 'none',
            textTransform: 'none',
            transition:'all 0.2s'
        },
        'a:visited': {
            textDecoration: 'none',
        },
        '@media (hover: hover) and (pointer: fine)': {
            'a:hover': {
                textDecoration: 'none',
            },
        },
        'ul li': {
            listStyle: 'none',
        },
        img: {
            maxWidth: '100%',
            display: 'block',
        },
        'h1, h2, h3, h4, h5, h6': {
            fontSize: 'inherit',
            fontWeight: 'inherit',
        },
        '.over': {
            overflow: 'auto',
        },
        '.non-over': {
            overflow: 'hidden',
        },
        '.wrapper': {
            display: 'flex',
            height: '100dvh',
        },
        
    },
}

export { baseline }