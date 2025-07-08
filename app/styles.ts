import { theme } from "@/config/ThemeMUI/theme";
import { SxProps, Theme } from "@mui/material";




export const centerFlexBlock = {
    display:'flex', 
    alignItems:'center', 
    justifyContent:'center'
}

export const columnSpaceBetween = {
    display: 'flex', 
    flexDirection: 'column', 
    justifyContent: 'space-between', 
}

export const avatarSize = { 
    width: 45, 
    height: 45,
    [theme.breakpoints.down("md")]: {
        width:35,
        height: 35,
    },
}

export const textMaxWidth = {
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
}