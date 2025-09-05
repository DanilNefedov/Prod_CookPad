import { theme } from "@/config/ThemeMUI/theme";
import { Theme } from "@mui/material";
import { height, SxProps, SystemStyleObject } from "@mui/system";






export const pageCard: (theme: Theme) => SxProps<Theme> = (theme) => ({
    overflow: "inherit",
    boxShadow: "none",
    position: "relative",
    gap: "90px",
    height: "maxContent",
    flexDirection: "row",
    flexGrow: 1,

    [theme.breakpoints.down(1030)]: {
        gap: "60px",
    },
    [theme.breakpoints.down("md")]: {
        justifyContent: "space-between",
    },
    [theme.breakpoints.down(769)]: {
        flexDirection: "column",
    },
    [theme.breakpoints.down("sm")]: {
        backgroundColor:'background.default',
        borderRadius:'0'
    },
});

export const mainCardContent = {
    position: 'relative',
    overflow: 'initial',
    boxShadow: 'none',
    m: '0 auto',
    backgroundSize: 'cover',
    backgroundColor: 'background.paper',
    borderRadius: '20px',
    alignSelf: "center",
    height: 'calc(100dvh - 45px)',
    // width: 'calc((100vh - 40px) * (9 / 16))',
    width: 'calc((100dvh - 40px) * (9 / 16))',
    py: '20px',

    [theme.breakpoints.down(769)]: {
        p: '0',
        m: '0 auto',
        maxWidth: '100%'
    },

   
}

export const viewContentContainer = {
    width: "100%",
    height:'100%',
    // aspectRatio: "9 / 16",
    backgroundColor: "background.default",
    borderRadius: '20px 20px 0 20px',
    position: 'relative',
    [theme.breakpoints.down(769)]: {
        borderRadius: '20px 20px 20px 20px'
    },
    [theme.breakpoints.down("sm")]: {
        backgroundColor:'background.paper',
        borderRadius:'0'
    },
}

export const containerNameDescription = (theme: Theme, expanded: boolean): SystemStyleObject<Theme> => ({
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
    },
    [theme.breakpoints.down("sm")]: {
        borderRadius:'0'
    },
})

export const descriptionRecipe = {
    cursor: 'pointer',
    fontSize: '14px',
    pb: '15px',
    flexShrink: 0,
    display: 'block',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    transition: "0.3s"
}

export const boxProgress = { 
    margin: '0 auto', 
    width: '100%', 
    height: '100%', 
    display: "inline-flex", 
    justifyContent: 'center', 
    overflow: "none" 
}

export const boxMediaSwiper = { 
    width: '100%', 
    height: '100%', 
    borderRadius: '20px 20px 0 20px' 
}

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


export const mainBtnsPopular = {
    backgroundColor: 'background.default',
    borderRadius: '50%',
    width: '45px',
    height: '45px',
    border: `1px solid ${theme.palette.text.disabled}`,
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

export const mainArrowIcon = {
    [theme.breakpoints.down('md')]: { 
        width: "19px", 
        height: '19px' 
    } 
};

export const mainContainerInfoComments = (theme: Theme, openInfo: boolean, openComment: boolean): SystemStyleObject<Theme> => ({
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
    [theme.breakpoints.down(1250)]: { 
        maxWidth: '42%' 
    },
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
    },
    [theme.breakpoints.down('sm')]: {
        width:'100%',
        maxWidth:'100%',
        backgroundColor: "background.paper",
    }
})

export const btnOpenInfoMobile = {
    display: 'none',
    position: "absolute",
    // backgroundColor: 'red',
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

export const commentModileArrow = {
    width: "35px",
    height: "35px",
    transition: 'transform 0.3s ease-in-out',
}

export const countComments = {
    textAlign:'center', 
    p:'7px 0', 
    fontSize:'14px', 
    color:"text.disabled"
}

export const mainCommentContainer = {
    width: '100%',
    flexGrow: '1',
    overflow: 'auto',
    height: "100%",
    borderWidth: "1px 0 0 0",
    borderStyle: 'solid',
    borderColor: 'text.disabled'
}

export const containerInfiniteScroll = {
    overflow: 'auto', 
    scrollbarColor: `${theme.palette.background.paper} ${theme.palette.background.default}`, 
    pr: '5px', pb: "0",
    height: "100%",

    '& .containerProgress':{
        margin: '0 auto', 
        width: '100%', 
        display: "inline-flex", 
        justifyContent: 'center', 
        overflow: "none" 
    },

    '& .emptyComments':{
        color: 'text.disabled', 
        fontSize: "14px"
    }

}

export const containerInputComments = { 
    position: 'relative', 
    marginTop: "10px"
} 

export const inputComment = {
    bgcolor: 'background.paper',
    width: '100%',
    overflow: 'hidden',
    borderRadius: '10px',

    '& .MuiInputBase-root': {
        p: '9px 52px 9px 7px',
        "&:after": {
            border: "transparent"
        },
        [theme.breakpoints.down('md')]: {
            fontSize: '15px'
        }
    },
    
    [theme.breakpoints.down('sm')]: {
        
        backgroundColor: "background.default",
    }
}

export const sendCommentBtn = { 
    position: 'absolute', 
    right: '15px', 
    top: 'calc(50% - 19px)', 
    minWidth: '0',
    padding: '0',
    width: '35px',
    height: '38px',
    bgcolor:'transparent'
}

export const commentsWrapper = { 
    mb: '10px', 
    p: 0, 
    display: 'block',

}

export const containerCommentItem = {
    bgcolor: 'background.paper',
    borderRadius: '10px',
    alignItems: "flex-start",
    p: '8px 16px',
    width: "100%",
    display: 'flex',
    flexWrap: "wrap",
    border: '1px solid transparent',

    '&:last-child': {
        mb: '0'
    },
    [theme.breakpoints.down('md')]: {
        p: '4px 8px'
    },

    [theme.breakpoints.down('sm')]: {
        bgcolor:'background.default'
    }
}

export const avatarContainer = {
    minWidth:"0", 
    pr:'10px',

    [theme.breakpoints.down('md')]:{
        pr: '7px'
    }
}

export const avatar = {
    [theme.breakpoints.down('md')]:{
        width:'30px', 
        height:"30px"
    }
}

export const textComment = {
    m: "0",
    width: '65%',
    '& .MuiTypography-root ': {
        color: 'text.primary',
        [theme.breakpoints.down('md')]: {
            lineHeight: "initial"
        }
    },
    '& .MuiTypography-body1': {
        mb: '5px',
        textOverflow: "ellipsis",
        whiteSpace: 'nowrap',
        overflow: "hidden",
        [theme.breakpoints.down('md')]: { 
            mb: '5px' 
        }
    }
}

export const containerSecondBlockComm = {
    width: '100%',
    justifyContent: 'space-between',
    display: 'flex',
    mt: '7px',
    [theme.breakpoints.down('md')]: { 
        mt: '4px' 
    }
}

export const replyComm ={
    p: '0',
    fontSize: "14px",
    textTransform: 'initial',
    minWidth: "0",
    backgroundColor: "transparent", 

    '@media (hover: hover) and (pointer: fine)': {
        '&:hover': { 
            backgroundColor: "transparent", 
            color: 'text.primary' 
        },
    },

    [theme.breakpoints.down('md')]: { 
        fontSize: '12px' 
    }
}

export const commentTime = {
    fontSize: '14px',
    color: 'text.disabled',
    alignSelf: 'flex-start',
    [theme.breakpoints.down('md')]: { 
        fontSize: '12px' 
    }
}


export const likeComm = {
    p: '0',
    fontSize: "14px",
    textTransform: 'initial',
    minWidth: "0",
    color: 'text.disabled',
    bgcolor:'transparent',
    alignItems: 'center',  

    '@media (hover: hover) and (pointer: fine)': {
        '&:hover': { 
            backgroundColor: "transparent", 
            color: 'primary.main' 
        },
    },
    [theme.breakpoints.down('md')]: { 
        fontSize: '12px' 
    }
}

export const likeIcon = {
    fontSize: "16px",
    m: '0 0 3px 3px'
}

export const replyBox = {
    display:'flex', 
    alignItems:'center',
    width:'100%',
    
    '& .line':{
        height:'1px', 
        backgroundColor:'text.disabled',
        flex:1
    },

    '& .leftLine':{
        maxWidth:'10%', 
    },

    '& .rightLine':{
        width:'40%', 
    }
}

export const repliesOpen = (theme: Theme, count: boolean, openReply: boolean): SystemStyleObject<Theme> => ({
    whiteSpace: 'nowrap',
    m: '0 20px',
    p: '0',
    fontSize: "14px",
    textTransform: 'initial',
    cursor: count ? 'pointer' : 'initial', // > 0
    minWidth: "0",
    color: openReply ? 'primary.main' : 'text.disabled',
    bgcolor:'transparent',

    '@media (hover: hover) and (pointer: fine)': {
        '&:hover': { 
            backgroundColor: "transparent", 
            color: count ? 'text.primary' : 'text.secondary' 
        }, 
    },
    [theme.breakpoints.down('md')]: { 
        fontSize: '12px' 
    }
})


export const iconReplyBtn = {
    transition: 'transform 0.2s ease', 
    width:'20px',
    height:'20px'
}

export const moreHideBox = {
    maxWidth: "50%", 
    justifyContent: 'center',
    m: '0 auto', 
    display: "flex" 
}

export const moreHideBtns = {
    p: '0',
    fontSize: "14px",
    textTransform: 'initial',
    minWidth: "0",
    color: 'text.disabled',
    bgcolor:'transparent',

    '@media (hover: hover) and (pointer: fine)': {
        '&:hover': { 
            backgroundColor: "transparent", 
            color: 'text.primary' 
        },
    },

    '&.Mui-disabled':{
        bgcolor:'transparent',
    }
}

export const mainNameRecipe = {
    flexShrink: 0, 
    textOverflow: 'ellipsis', 
    pb: '10px', 
    lineHeight: 'none', 
    mb: '0', 
    fontSize:'22px',
    whiteSpace: 'nowrap', 
    overflow: 'hidden',
    [theme.breakpoints.down('md')]: { 
        fontSize: '20px', 
        pb: '5px' 
    },
    [theme.breakpoints.down(769)]: {
        display: "none"
    }
}

export const mainDescriptionRecipe = {
    flexShrink: 0, 
    fontSize: "16px", 
    display: 'block', 
    color:'text.disabled',
    pb: '20px', 
    wordBreak: 'break-all',
    [theme.breakpoints.down('md')]: { 
        fontSize: '14px', 
        pb: '10px' 
    },
    [theme.breakpoints.down(769)]: {
        display: "none"
    }
}

export const statsRecipe = {
    backgroundColor: 'background.default',
    backdropFilter: 'blur(3px)',
    height: '320px',
    borderRadius: '0px 15px 15px 0px',
    alignItems: 'center',
    p: '20px 7px',
    width: '80px',
    [theme.breakpoints.down('md')]: {
        width: '65px',
    },
    [theme.breakpoints.down(769)]: {
        bgcolor: 'transparent',
        backdropFilter: 'none',
        borderRadius: '10px 0 10px 0px'
    }
}

export const authorAvatar = { 
    [theme.breakpoints.down('md')]: { 
        width: '35px', 
        height: "35px" 
    } 
}

export const authorName = {
    m: '10px 0',
    width: "70px",
    textAlign: 'center',
    [theme.breakpoints.down('md')]: {
        fontSize: "14px",
        m: '5px 0'
    }
}

export const containerBtnsStats = {
    alignItems: 'center',
    flexDirection:'column',
    justifyContent:'end',
    p:'0 8px',
    flex:'1',
    gap:'12px',
    '&.MuiCardActions-root>:not(style)~:not(style)': {
        ml: 0,
    }
}

export const statsBtn = {
    width:'auto',
    height:'auto',
    color: 'text.primary',
    p: '0',
    
}

export const loaderReplyBox = {
    width:'100%', 
    height:'100%',
    mt:'5px'
}

export const replyContainer = {
    bgcolor: 'background.paper',
    borderRadius: '10px',
    m: '10px 0 ',
    ml: "auto",
    flexWrap: "wrap",
    border: '1px solid transparent',
    maxWidth: "90%",
    lignItems: "flex-start",
    p: '5px 7px',

    '&:last-child': {
        mb: '0px'
    },
    [theme.breakpoints.down('md')]: { 
        p: '4px 8px' 
    },
    [theme.breakpoints.down('sm')]: {
        bgcolor:'background.default'
    }

}

export const avatarTextReplyBox = {
    display:'flex', 
    alignItems:'center', 
    width:'100%', 
    p:'0px'
}

export const avatarReplyBox = {
    minWidth:"0", 
    mr:"10px"
}

export const avatarReply = {
    width: "35px",
    height: '35px',
    [theme.breakpoints.down('md')]: {
        width: "30px", 
        height: '30px' 
    }
}

export const fullTextReply = {
    m: "0",
    '& .MuiTypography-root ': {
        maxWidth: '513px',
        color: 'text.primary',
        fontSize: '15px',
    },
    '& .MuiTypography-body1': {
        mb: '5px',
    }
}

export const containerPrimaryReplyText = {
    display: 'flex',
    alignItems: 'center',
    overflow: 'hidden',
    gap: '4px',
    minWidth: 0
}

export const arrowBetweenNames = { 
    flexShrink: 0, 
    [theme.breakpoints.down('md')]:{
        width:"20px", 
        height:'20px'
    } 
}

export const replyBtnBoxInReply = {
    width: '100%', 
    justifyContent: 'space-between', 
    display: 'flex', 
    mt: '7px'
}

export const nameRecipeMobile = {
    flexShrink: 0,
    pb: '5px',
    lineHeight: 'none',
    mb: '0',
    fontSize: '16px',
    fontWeight: 'bold',
}

export const containerSlideMediaSwiper = {
    width: '100%',
    height: '100%',
    borderRadius: '20px 20px 0 20px',
    position: 'relative',

    [theme.breakpoints.down(769)]: {
        borderRadius: '20px 20px 20px 20px'
    }
}

export const mediaSwiperElement = {
    height: '100%',
    objectFit: 'cover',
    width: '100%',
    borderRadius: '20px 20px 0 20px',
    transition: 'opacity 0.3s ease',

    [theme.breakpoints.down(769)]: {
        borderRadius: '20px 20px 20px 20px'
    },

    [theme.breakpoints.down('sm')]: {
        borderRadius: '0'
    }
}

export const swiperProgressBox = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    zIndex: 10,
}

export const containerAvatarComment = {
    width: '100%',
    p: '7px 0',
    [theme.breakpoints.down('md')]: { 
        p: '4px 0' 
    }
}