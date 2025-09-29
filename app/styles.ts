import { theme } from "@/config/ThemeMUI/theme";




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

export const columnCenter = {
    display: 'flex', 
    justifyContent: 'center', 
    flexDirection: 'column', 
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

export const skeletonSwiperCook = {
    bgcolor:'background.paper', 
    borderRadius:'10px',
    width:'100%',
    m:'0 auto'
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
}

export const favoriteBtnDesactive = { 
    color: 'text.disabled',
    transition:'all 0.2s',
    '@media (hover: hover) and (pointer: fine)': {
        '&:hover': {
            color: 'primary.main',
        },
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

export const InputForMedia = {
    clip: 'rect(0 0 0 0)',
    clipPath: 'inset(50%)',
    height: 1,
    overflow: 'hidden',
    position: 'absolute',
    bottom: 0,
    left: 0,
    whiteSpace: 'nowrap',
    width: 1,
}

export const headerSteps = { 
    textAlign: "center",
    mt: '25px', 
    mb:'10px',
    p:'0 5px',
    [theme.breakpoints.down('md')]: { 
        fontSize: '16px', 
        mt: '10px' 
    } 
}

export const cardMedia = {
    height: '100%',
    objectFit: 'cover',
    width:"100%"
}


export const userLertBox = {
    height:"100dvh",
    flexDirection:"column",
    textAlign: "center",
    px: '2',
}

export const userAlertHeader = {
    fontSize:"30px", 
    pb:'20px', 
    [theme.breakpoints.down("md")]: {
        fontSize:'25px'
    }
}

export const userAlertSubtitle = {
    fontSize:"20px", 
    maxWidth:'520px', 
    [theme.breakpoints.down("md")]: {
        fontSize:'16px',  
        maxWidth:'300px'
    }
}

export const globalErrorStack = {
    maxWidth: '270px',
    width: '100%',
    position: 'absolute',
    bottom: '20px',
    right: 'calc(50% - 135px)',
    zIndex: '99999',

    '& .MuiAlert-action':{
        padding:'0 0 0 5px',
        color: 'text.primary', 
    },

    '& .MuiButtonBase-root':{
        '@media (hover: hover) and (pointer: fine)': {
            '&:hover': {
                bgcolor: 'primary.dark',
            },
        },
    }
}

export const globalErrorAlert = { 
    bgcolor: 'error.contrast', 
    color: 'text.primary', 
    alignItems:'center',
}

export const videoBorder = {
    '& video':{
        borderRadius: '20px 20px 0 20px',

        [theme.breakpoints.down(769)]: {
            borderRadius: '20px 20px 20px 20px'
        },

        [theme.breakpoints.down('sm')]: {
            borderRadius: '0'
        }
    }
}