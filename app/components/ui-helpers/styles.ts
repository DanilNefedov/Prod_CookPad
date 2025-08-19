import { LoadingContainer } from "@/app/types";
import { theme } from "@/config/ThemeMUI/theme";
import { SxProps, Theme } from "@mui/material";





export const emptyInfo = (params:LoadingContainer): SxProps<Theme> => (theme) => ({
    position:params.position,
    top: 'calc(50% - 12px)',
    right:params.right,
    zIndex: 10,
    [theme.breakpoints.down('md')]: {
        fontSize: params.mobileText,
    },
});

export const loadingContainer = (position:string): SxProps<Theme> => (theme) =>({
    position: position,
    transform: position === 'static' ? 'none' : 'translate(-50%, -50%)',
    top: '50%',
    left: '50%',
    zIndex: 10,
    display: 'flex',
    justifyContent: 'center',
})







export const containerErrorInfo = {
    p: '10px 20px',
    borderRadius: "20px",
    border: `2px solid ${theme.palette.error.main}`,
    bgcolor: 'rgba(255,114,105, 0.15)',
    maxWidth: "600px",
    width: '100%',
    m: 'auto auto',
    maxHeight: '200px',
    height: 'fit-content',
    [theme.breakpoints.down("md")]: {
        maxWidth: "280px",
        p: '5px 10px',
    }
}



export const refreshErrorBtn = {
    bgcolor: 'background.default',
    minWidth: '0',
    color: 'text.primary',
    textTransform: 'initial',
    display: 'flex',
    alignItems: 'center',
    m: '20px auto 0',
    p: ' 7px 20px',
    borderRadius: '10px',
    transition: "0.3s",
    lineHeight: "20px",
    '@media (hover: hover) and (pointer: fine)': {
        '&:hover': {
            bgcolor: 'primary.main'
        },
    },


}

export const errorPageHeader = {
    textAlign: 'center',
    fontSize: "25px",
    [theme.breakpoints.down("md")]: {
        fontSize: '18px'
    }
}

export const errorPageSubtitle = {
    textAlign: "center",
    fontSize: '18px',
    p: '10px 0',
    [theme.breakpoints.down("md")]: {
        fontSize: '16px',
        p: '7px 0',
    }
}

export const errorPageIconRefresh = { 
    width: "16px", 
    height: '16px', 
    ml: '7px' 
}