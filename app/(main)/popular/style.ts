import { theme } from "@/config/ThemeMUI/theme";
import { Theme } from "@mui/material";
import { SystemStyleObject } from "@mui/system";


export const mainCardContent = (theme: Theme, openInfo: boolean): SystemStyleObject<Theme> => ({
    position: 'relative',
    overflow: 'initial',
    boxShadow: 'none',
    m: '0 auto',
    backgroundSize: 'cover',
    backgroundColor: '#353842',
    borderRadius: '20px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: "center",
    height: 'calc(100dvh)',
    width: 'calc((100vh - 40px) * (9 / 16))',
    py: '20px',
    [theme.breakpoints.down(1030)]: {
      pr: openInfo ? '30px' : '0'
    },
    [theme.breakpoints.down(769)]: {
      p: '0',
      m: '0 auto',
      maxWidth: '100%'
    }
});


export const viewContentContainer = {
    width: "100%",
    aspectRatio: "9 / 16",
    backgroundColor: "background.default",
    borderRadius: '20px 20px 0 20px',
    position: 'relative',
    [theme.breakpoints.down(769)]: {
        borderRadius: '20px 20px 20px 20px'
    }
}


export const mobileNameDescriptionContainer = (theme: Theme, expanded: boolean): SystemStyleObject<Theme> => ({
    display: 'none',
    position: 'absolute',
    zIndex: expanded ? "150" : "99",
    bottom: "0",
    left: '0px',
    width: '100%',
    p: "0 65px 0 15px",
    background: expanded ? `linear-gradient(
        180deg,
        hsl(0 0% 6% / 0.02) 0%,  
        hsl(0 0% 0% / 0.34) 20%,
        hsl(0 0% 0% / 0.54) 40%,
        hsl(0 0% 0% / 0.69) 60%,
        hsl(0 0% 0% / 0.8) 80%,
        hsl(0 0% 0% / 0.9) 100%
    )`: 'none',
    borderRadius: '0px 0 0px 20px',
    [theme.breakpoints.down(769)]: {
        display: 'block'
    }
})



export const mainBtnsPopular = {
    backgroundColor: 'rgba(12,13,16, 0.5)',
    borderRadius: '50%',
    width: '45px',
    height: '45px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    border: '1px solid #777777',
    cursor: 'pointer',
    transition: 'transform 0.15s',
    transformOrigin: 'center center',

    '@media (hover: hover) and (pointer: fine)': {
        '&:hover': {
            transform: 'scale(1.1)',
        },
    },

    [theme.breakpoints.down('md')]: {
        width: '35px',
        height: '35px',
    },

    '& svg': {
        width: '60%', 
        height: '60%',
        transition: 'transform 0.15s',
    },
};


export const nameRecipe = {
    flexShrink: 0, 
    textOverflow: 'ellipsis', 
    pb: '5px', 
    lineHeight: 'none', 
    mb: '0', 
    whiteSpace: 'nowrap', 
    overflow: 'hidden',
    fontSize: '16px',
    fontWeight:'bold',
}


export const descriptionRecipe = (theme: Theme, expanded: boolean): SystemStyleObject<Theme> => ({
    cursor: 'pointer',
    fontSize: '14px',
    pb: '15px',
    flexShrink: 0,
    display: 'block',
    wordBreak: expanded ? 'break-word' : 'break-all',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: expanded ? 'normal' : 'nowrap',
    transition: "0.3s"
})


export const containerActiveInfo = {
    position: "absolute",
    bottom: '0',
    right: '-79px',
    zIndex: 2,
    display: 'flex',
    flexDirection: 'column-reverse',
    alignItems: 'center',
    gap: '20px',
    [theme.breakpoints.down('md')]: {
        width: '65px',
        height: '265px',
        right: '-64px',
    },
    [theme.breakpoints.down(769)]: {
        right: "0",
        zIndex: 100
    }
}

export const containerSwichBtns = {
    display: 'flex',
    flexDirection: 'column',
    gap: '20px',
    width: "50px",
    [theme.breakpoints.down('md')]: {
        width: "35px"
    },
    [theme.breakpoints.down(769)]: {
        display: "none"
    }
}




export const mainContainerInfoComments = (theme: Theme, openInfo: boolean, openComment:boolean): SystemStyleObject<Theme> => ({
    backgroundColor: "background.default",
    display: 'flex',
    flexDirection: 'column',
    borderRadius: '20px',
    p: '10px 20px',
    width: "100%",
    maxWidth: '450px',
    maxHeight: 'calc(100dvh - 40px)',
    minHeight: 'calc(100dvh - 40px)',
    position: "relative",
    transition: '0.3s',
    height: "100%",
    [theme.breakpoints.down(1250)]: { maxWidth: '42%' },
    [theme.breakpoints.down(1030)]: {
        width: '300px',
        minWidth: '300px',
        marginRight: openInfo ? '0' : "calc(-275px - 50px)"
    },
    [theme.breakpoints.down('md')]: {
        width: '300px',
        minWidth: '300px',
        marginRight: openInfo ? '0' : "calc(-265px - 50px)"
    },
    [theme.breakpoints.down(769)]: {
        mr: '0',
        width: 'calc((100vh - 40px) * (9 / 16))',
        maxWidth: 'calc(100% + 2px)',
        bottom: openComment ? '0%' : "-100%",
        p: '20px ',
        position: 'absolute',
        zIndex: '400',
        borderRadius: '20px 20px 0 0',
        maxHeight: '60%',
        minHeight: '60%',
        height: '100%',
    }
})


export const btnOpenInfoMobile = {
    display: 'none',
    position: "absolute",
    backgroundColor: 'red',
    width: "40px",
    height: '40px',
    top: '75px',
    left: "-40px",
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: '10px 0 0 10px',
    bgcolor: 'background.default',
    [theme.breakpoints.down(1030)]: { display: 'flex' },
    [theme.breakpoints.down(769)]: {
        display: 'none'
    }
}


export const mainNameRecipe = {
    flexShrink: 0, textOverflow: 'ellipsis', pb: '10px', lineHeight: 'none', mb: '0', whiteSpace: 'nowrap', overflow: 'hidden',
    [theme.breakpoints.down('md')]: { fontSize: '20px', pb: '5px' },
    [theme.breakpoints.down(769)]: {
        display: "none"
    }
}


export const mainDescriptionRecipe = {
    flexShrink: 0, fontSize: "16px", display: 'block', pb: '20px', wordBreak: 'break-all',
    [theme.breakpoints.down('md')]: { fontSize: '14px', pb: '10px' },
    [theme.breakpoints.down(769)]: {
        display: "none"
    }
}



export const containerSlideMediaSwiper = {
    width:'100%', 
    height:'100%', 
    borderRadius: '20px 20px 0 20px',
    [theme.breakpoints.down(769)]: {
        borderRadius: '20px 20px 20px 20px'
    }
}


export const mediaSwiperElement = {
    height: '100%',
    objectFit: 'cover',
    width:'100%',
    borderRadius: '20px 20px 0 20px',
    [theme.breakpoints.down(769)]: {
        borderRadius: '20px 20px 20px 20px'
    }
}


export const mainCommentContainer = { 
    width: '100%', 
    display: 'flex', 
    flexDirection: 'column', 
    justifyContent: 'space-between', 
    flexGrow: '1', 
    overflow: 'auto',
    height: "100%",
    borderWidth:"1px 0 0 0",
    borderStyle:'solid',
    borderColor:'text.disabled'
}


export const inputComment = {
    bgcolor: 'background.paper',
    width: '100%',
    overflow: 'hidden',
    '& .MuiInputBase-root': {
        p: '9px 52px 9px 7px',
        "&:after": {
            border: "transparent"
        },
        [theme.breakpoints.down('md')]:{
            fontSize:'15px'
        }
    },
    borderRadius: '10px',
    
}



export const statsRecipe = {
    backgroundColor: 'background.default',
    backdropFilter: 'blur(3px)',
    height: '320px',
    borderRadius: '0px 15px 15px 0px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    p: '20px 7px',
    width: '80px',
    [theme.breakpoints.down('md')]: {
        width:'65px',
    },
    [theme.breakpoints.down(769)]: {
        bgcolor:'transparent',
        backdropFilter:'none',
        borderRadius:'10px 0 10px 0px'
    }
}


export const authorName = {
    m: '10px 0', 
    textOverflow: 'ellipsis', 
    whiteSpace: 'nowrap', 
    overflow: 'hidden', 
    width: "70px", 
    textAlign: 'center',
    [theme.breakpoints.down('md')]: {
        fontSize: "14px",
        m: '5px 0'
    }
}


export const containerBtnsStats = {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    '&.MuiCardActions-root>:not(style)~:not(style)': {
        ml: 0,
    }
}


export const statsBtn = { 
    m: '5px 0', 
    color: 'text.primary', 
    p: '0', 
    flexDirection: 'column', 
    justifyContent: "center",
    [theme.breakpoints.down('md')]:{m: '2px 0'}
}


export const statsBtnMobileIcon = {
    [theme.breakpoints.down('md')]: { width: '20px', height: "20px" }
}


export const containerCommentItem = (theme: Theme, isActive:boolean): SystemStyleObject<Theme> => ({
    bgcolor: 'background.paper',
    borderRadius: '10px',
    alignItems:"flex-start",
    p: '8px 16px',
    width: "100%",
    display: 'flex',
    flexWrap: "wrap",
    border: '1px solid transparent',
    borderColor: isActive ? 'text.secondary' : 'transparent',
    '&:last-child': {
        mb: '0'
    },
    [theme.breakpoints.down('md')]:{
        p: '4px 8px'
    }
})


export const containerAvatarComment = {
    display:'flex', 
    justifyContent:'space-between', 
    alignItems:'center', 
    width:'100%', 
    p:'7px 0',
    [theme.breakpoints.down('md')]:{p:'4px 0'}
}



export const textComment = { 
    m:"0", 
    width:'65%',  
    '& .MuiTypography-root ': { 
        color:'text.primary', 
        fontSize:'16px', [theme.breakpoints.down('md')]:{
            fontSize:'14px',
            lineHeight:"initial"
        }
    }, 
    '& .MuiTypography-body1':{
    mb:'5px',
        textOverflow: "ellipsis",
        whiteSpace:'nowrap',
        overflow:"hidden",
        [theme.breakpoints.down('md')]:{mb:'5px'}
    } 
}



export const containerSecondBlockComm = {
    width: '100%', 
    justifyContent: 'space-between', 
    display: 'flex', 
    mt: '7px',
    [theme.breakpoints.down('md')]:{ mt: '4px'}
}



export const replyComm = (theme: Theme, isActive:boolean): SystemStyleObject<Theme> => ({
    p: '0',
    '@media (hover: hover) and (pointer: fine)': {
        '&:hover': { backgroundColor: "transparent", color: 'text.primary' },
    },
    fontSize: "14px",
    textTransform: 'initial',
    minWidth: "0",
    color: isActive ? 'primary.main' : 'text.secondary',
    [theme.breakpoints.down('md')]:{ fontSize:'12px'}
})


export const dataComm = { 
    fontSize: '14px', 
    color: 'text.disabled',
    alignSelf: 'flex-start', 
    [theme.breakpoints.down('md')]:{ fontSize:'12px'}
}


export const likeComm = {
    p: '0',
    '@media (hover: hover) and (pointer: fine)': {
        '&:hover': { backgroundColor: "transparent", color: 'primary.main' },
    },
    fontSize: "14px",
    textTransform: 'initial',
    minWidth: "0",
    color: 'text.secondary',
    alignItems: 'center',
    [theme.breakpoints.down('md')]:{ fontSize:'12px'}
}


export const repliesOpen = (theme: Theme, count:boolean, openReply:boolean): SystemStyleObject<Theme> => ({
    whiteSpace: 'nowrap',
    m:'0 20px',
    p: '0',
    '@media (hover: hover) and (pointer: fine)': {
        '&:hover': { backgroundColor: "transparent", color: count  ? 'text.primary' : 'text.secondary' }, // >0
    },
    fontSize: "14px",
    textTransform: 'initial',
    cursor: count  ? 'pointer' : 'initial', // > 0
    minWidth: "0",
    color: openReply ? 'primary.main' : 'text.secondary',
    [theme.breakpoints.down('md')]:{ fontSize:'12px'}
})


export const moreBtn = {
    p: '0',
    '@media (hover: hover) and (pointer: fine)': {
        '&:hover': { backgroundColor: "transparent", color: 'text.primary' },
    },
    fontSize: "14px",
    textTransform: 'initial',
    minWidth: "0",
    color: 'text.secondary',
    mr: '25px',

}


export const hideBtn = {
    p: '0',
    '@media (hover: hover) and (pointer: fine)': {
    '   &:hover': { backgroundColor: "transparent", color: 'text.primary' },
    },
   fontSize: "14px",
    textTransform: 'initial',
    minWidth: "0",
    color: 'text.secondary'
}


export const replyContainer = (theme: Theme, isActive:boolean): SystemStyleObject<Theme> => ({
    bgcolor: 'background.paper',
    borderRadius: '10px',
    m: '10px 0 ',
    ml: "auto",
    flexWrap: "wrap",
    border: '1px solid transparent',
    maxWidth: "90%",
    lignItems: "flex-start",
    borderColor: isActive ? 'text.secondary' : 'transparent',
    p:'5px 7px',
    '&:last-child': {
        mb: '0px'
    },
    [theme.breakpoints.down('md')]:{p:'4px 8px'}

})


export const avatarReply = {
    width:"35px", 
    height:'35px', 
    [theme.breakpoints.down('md')]:{width:"30px", height:'30px'}
}

export const fullTextReply = { 
    m: "0", 
    '& .MuiTypography-root ': { 
        maxWidth: '513px', 
        color: 'text.primary', 
        fontSize: '15px',
        [theme.breakpoints.down('md')]:{fontSize:"14px"}
    }, 
    '& .MuiTypography-body1':{
        mb:'5px',
    }
}


export const containerPrimaryReplyText = { 
    display: 'flex', 
    alignItems: 'center', 
    overflow: 'hidden', 
    gap: '4px', 
    minWidth: 0 
}


export const replyReplyBtn = (theme: Theme, isActive:boolean): SystemStyleObject<Theme> => ({
    p: '0',
    '@media (hover: hover) and (pointer: fine)': {
        '&:hover': { backgroundColor: "transparent", color: 'text.primary' },
    },
    fontSize: "14px",
    textTransform: 'initial',
    minWidth: "0",
    color: isActive ? 'primary.main' : 'text.secondary',
    [theme.breakpoints.down('md')]:{fontSize:"12px"}
})


export const dataReply = { 
    fontSize: '14px', 
    color: 'text.disabled', 
    alignSelf: 'flex-start', 
    [theme.breakpoints.down('md')]:{fontSize:"12px"}
}

export const likesReply = {
    p: '0',
    '@media (hover: hover) and (pointer: fine)': {
        '&:hover': { backgroundColor: "transparent", color: 'primary.main' },
    },
    fontSize: "14px",
    textTransform: 'initial',
    minWidth: "0",
    color: 'text.secondary',
    [theme.breakpoints.down('md')]:{fontSize:"12px"}
}