import { theme } from "@/config/ThemeMUI/theme";
import { SxProps, Theme } from "@mui/material";




export const centerFlexBlock = {
    display:'flex', 
    alignItems:'center', 
    justifyContent:'center'
}

export const betweenCenter = {
    display:"flex",
    justifyContent:"space-between",
    alignItems:"center",
}

export const wrapCenter = {
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'center',
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

export const moreButton = {
    width:'100px',
    mb:'2px',
    [theme.breakpoints.down("md")]: {
        width: '90px',
        maxHeight:'30px',
        p:'2px 14px'
    }        
}

export const arrowFullTemplate = {
    width:'35px', 
    height:'35px', 
    backgroundColor:'common.cardBlack7',
    borderRadius:'50%',
    cursor:'pointer',
    [theme.breakpoints.down("md")]: { 
        width:'30px', 
        height:'30px',
    },
    [theme.breakpoints.down(600)]: { 
        width:'22px', 
        height:'22px',
    }           
}

export const favoriteBtnActive ={ 
    color: 'primary.main', 
    transition:'all 0.2s',
    '@media (hover: hover) and (pointer: fine)': {
        '&:hover': {
            color: 'error.light',
        },
    },
    [theme.breakpoints.down("md")]: {
        height:'20px',
        width:'20px'
    }, 
}

export const favoriteBtnDesactive = { 
    color: 'text.disabled',
    transition:'all 0.2s',
    '@media (hover: hover) and (pointer: fine)': {
        '&:hover': {
            color: 'primary.main',
        },
    },
    [theme.breakpoints.down("md")]: {
        height:'20px',
        width:'20px'
    }, 
}

export const hideScroll = {
    msOverflowStyle: "none",  
    scrollbarWidth: "none",

    '&::-webkit-scrollbar': {
        display: 'none',
        width: '0px',
        height: '0px',
    },
}

export const alertMui = {
    bgcolor: 'error.contrast', 
    color: 'text.primary', 
    '& .MuiSvgIcon-root': { 
        fill: '#fff' 
    },
    '& .MuiAlert-action':{
        alignItems: 'center',
        padding: '0',
        marginRight: 0,
    },
    '& .MuiPaper-root':{
        alignItems:'center'
    },
}

export const paperForm: SxProps<Theme> = (theme) => ({  
    display: 'flex',
    backgroundColor: 'background.default',
    flexGrow: '1',
    flexDirection: 'column',
    overflowY: 'auto',
    scrollbarColor: `${theme.palette.background.paper} ${theme.palette.background.default}`,
    [theme.breakpoints.down('md')]:{
        borderRadius:'10px'
    }
})

export const saveBtn = {
    width: '150px',
    m: '0 auto',
    [theme.breakpoints.down(500)]: {
        width: "100px",
    },
}

export const containerBtns = { 
    display: 'flex', 
    justifyContent: 'space-between', 
    mt: '20px' 
}

export const pageBtns = {
    p:'6px 16px'
}

export const nextBtn = {
    ml: 'auto', mr:'0',
}