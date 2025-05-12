import { theme } from "@/config/ThemeMUI/theme";


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