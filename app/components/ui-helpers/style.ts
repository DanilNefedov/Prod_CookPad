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

export const loadingProgress = (color:string): SxProps<Theme>  => (theme) => ({
    // width: '35px !important',
    // height: '35px !important',
    // color: color || 'secondary',
    // [theme.breakpoints.down(750)]: {
    //     width: '28px !important',
    //     height: '28px !important'
    // }
                
})






export const containerErrorInfo = {
    p: '10px 20px',
    borderRadius: "20px",
    border: "2px solid #FF7269",
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