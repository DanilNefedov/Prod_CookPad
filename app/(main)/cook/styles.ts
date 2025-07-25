import { theme } from "@/config/ThemeMUI/theme";
import { styled, SxProps, Theme } from "@mui/material"



export const mainBoxCook = {
    display: 'flex',
    height: 'calc(100dvh - 20px)',
    m: '10px 0',
    
    [theme.breakpoints.down("md")]: {
        flexDirection:'column',
        overflow:'auto',
        scrollbarWidth: 'none', 
        '&::-webkit-scrollbar': {
            display: 'none', 
        },
    }
}


//-------- header --------//

export const headerCookContainer = {
    bgcolor: 'background.default',
    display: 'flex',
    height: '100%',
    borderRadius: '15px',
    maxWidth:'200px',
    width: '100%',
    padding:'15px 0',
    overflow: "hidden",
}

export const scrollBox = {
    overflow: 'auto',
    display: 'flex',
    flexDirection: 'column',
    width: '100%',
    height:'100%',
    msOverflowStyle: "none",  
    scrollbarWidth: "none",

    '&::-webkit-scrollbar': {
        display: 'none',
        width: '0px',
        height: '0px',
    },
}

export const elementHeader = {
    mb:'15px', 
    gap:'5px'
}

export const links = {
    cursor:'pointer',
    width:'80%',
    padding: '0 5px',
    borderRadius: '10px',
    height:'35px',
}

export const labelLink = {
    '& .MuiChip-label':{
        width:'100%',
        textAlign:'center',
        whiteSpace: 'nowrap',
        overflow: 'hidden',
        textOverflow: 'ellipsis',
    }
}

export const adaptiveLink = {
    width: '100%',
    justifyContent: 'space-between',
    p:'0 5px',
    borderRadius:'10px',
    height:'33px',
}

export const adaptiveHeaderContainer ={
    position: 'relative',
    width: 'fit-content',
    overscrollBehavior: "contain",
    overflow:'auto',
    m: '0 auto',
    '& .PrivateSwipeArea-root': {
        width: 'calc(100% - 60px)',
        right: '0',
        left: 'initial',
        overscrollBehavior: "contain",
        overflow:'auto',
        [theme.breakpoints.down(500)]: {
            width: 'calc(100% - 45px)',
        },
        background: 'linear-gradient(to right, rgba(21,22,26, 0.02), rgba(21,22,26, 0.6), rgba(21,22,26, 0.02))',
        borderBottomLeftRadius: "50% 100%",
        borderBottomRightRadius: " 50% 100%",

    },
    '.MuiDrawer-root > .MuiPaper-root': {
        zIndex: '2500'
    },
    [theme.breakpoints.down('md')]: {
        mt: '20px',
    },
}

export const pullerContainer = {
    position: 'fixed',
    top: '15px',
    left: '50%',
    width: 45,
    height: 6,
    zIndex: 1200,
    display: 'flex',
    alignItems: 'flex-end',
    justifyContent: 'center',
    pointerEvents: 'none',
}

export const drawer = {
    '& .MuiDrawer-paper': {
        transform: 'translateY(-50%)',
        top: '0',
        width: '100%',
        margin: '0 auto',
        borderRadius: '0 0 24px 24px',
    }
}

export const containerItems = {
    p: '15px 15px',
    gap: '15px'
}

export const headerItem = {
    p: '0',
    maxWidth: '160px',
    [theme.breakpoints.down(365)]: {
        maxWidth: '100%'
    },
}

//-------- header --------//











//-------- main content --------//

export const containerContent = {
    width:'calc(100% - 200px)',
    m:'0',
    borderRadius:'20px',
    backgroundColor:'background.default',
    ml:"20px",
    p:'10px',
    
    [theme.breakpoints.down("md")]: {
        width:'100%',
        ml:"0px",
        mt:'20px',
        flexGrow: 1,
        msOverflowStyle: "none",  
        scrollbarWidth: "none",

        '&::-webkit-scrollbar': {
            display: 'none',
            width: '0px',
            height: '0px',
        },
    }
}

export const scrollContainer = {
    scrollbarColor: "#353842 #1F2128",
    height: '100%', 
    overflow: 'auto', 
    [theme.breakpoints.down("md")]: {
        p: '5px 0',
        overflow: 'hidden',
        position:'relative'
    }
}

export const containerSwiperInfo = {
    display: 'flex', 
    height: 'auto', 
    justifyContent: 'center', 
    gap: '10px',
    '& .swiper':{
        marginLeft: 0,
        marginRight: 0,
        m:'0 auto'
    },
    [theme.breakpoints.between(900, 1100)]: {
      display: 'block',
    },
    [theme.breakpoints.down(700)]: {
        display: 'block',
        gap: '0'
    }
}

export const skeletonMedia = {
    objectFit: "cover", 
    width:'100%', 
    height:'100%', 
    maxWidth: "465px", 
    aspectRatio:" 4 / 5"
}

export const mediaContainer = {
    width:'100%',
    height:'100%',
    aspectRatio:'4/5',
    maxWidth:'465px'
}

export const containerInfo = {
    maxWidth: "464px", 
    width: '100%', 
    pr: '20px', 
    [theme.breakpoints.between(900, 1100)]: {
      maxWidth: "100%",
    },
    [theme.breakpoints.down("md")]: {
        maxWidth: "100%",
        pr: '5px',
        mt: '20px'
    },
}

export const nameRecipe = {
    textAlign:"center",
    fontSize:'2rem',
    [theme.breakpoints.down("md")]: {
        fontSize: '18px'
    },
}



export const containerTime = { 
    display: 'flex', 
    justifyContent: 'space-between',
    alignItems:'center',
    m: '10px 0' 
}



export const descriptionInstruction = {
    wordWrap: "break-word", 
    wordBreak: 'break-all', 
}

export const containerIngr = {
    maxWidth: '938px', 
    m: '0 auto', 
    p: "0 20px", 
    [theme.breakpoints.down(700)]: {
        p: "0"
    },
}

export const secondHeader = {
    textAlign:'center',
    fontSize: '1.4rem',
    mt: '35px',
    [theme.breakpoints.down("md")]: {
        mt: '20px',
        fontSize: '18px',
    },
}

export const swiperContainer = { 
    p: '0', 
    position: 'relative',
    '& .swiper': { 
        position: 'static', 
        m: '0 15px' 
    }, 
}

export const instruction = {
    mt: '5px', 
}

export const ingredinetsArrow = { 
    fontSize: 35, 
    [theme.breakpoints.down("md")]: { 
        fontSize: 30 
    } 
}

export const avatarIngr = {
    width: '40px', 
    height: '40px', 
    borderRadius: '50%', 
    minWidth: '0',
     m: '0 auto',
    [theme.breakpoints.down("md")]: {
        width: '30px',
        height: '30px'
    }
}

export const nameIngr = {
    textAlign: 'center', 
    mb: '0', 
    '& span': {
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        whiteSpace: 'nowrap',
    }
}

export const containerUnit = {
    textAlign: 'center', 
    opacity: '0.6', 
}

export const containerButtons = { 
    display: 'flex', 
    justifyContent: 'center' 
}

export const buttonList = {
    width:'40%',
    p:'2px 7px',
    display:'block',
    mt:'10px',
    color:'text.disabled',
    [theme.breakpoints.down(1100)]: {  
        width:"75px"
    },
    [theme.breakpoints.down("md")]: {    
        minWidth:'0',
    },
    '@media (hover: hover) and (pointer: fine)': {
        '&:hover': {
            color:'text.primary',
        },
    },
}

export const menuContainer = {
    '& .MuiPaper-root': { 
        backgroundColor: "supportBackground.light" 
    }, 
    '@media (hover: hover) and (pointer: fine)': {
        '& .MuiMenuItem-root:hover': {
            backgroundColor: 'background.paper',
            cursor: 'auto'
        },
    },
    '& .MuiList-root': {
        p: '5px 10px'
    },

    
}

export const headerMenu = { 
    opacity: "1 !important", 
    display: 'block', 
    minHeight: '0' 
}


export const menuListItems = {
    // backgroundColor:'background.paper',
    width:'100%',
    borderRadius:'10px',
    m:'7px auto',
    minHeight:'0',
    // '@media (hover: hover) and (pointer: fine)': {
        // '&:hover':{
            // backgroundColor:'background.paper'
        // },
    // },
}

export const btnListItem = {
    pointerEvents: 'auto',
    '@media (hover: hover) and (pointer: fine)': {
        '&:hover':{
            backgroundColor:'primary.dark'
        },
        '& svg:hover':{
            color:'text.primary'
        },
    },

    
    p:'4px 4px',
    width:'auto',
    minWidth:'auto',
    ml:'auto',
    [theme.breakpoints.down("md")]: {
        width:'20px',
        height:'20px'
    }
}

export const boxOr = {
    opacity: "1 !important", 
    display: 'block', 
    pt: '5px', 
    minHeight: "0"
}

export const chipMenu = {
    width:'100%',
    maxWidth:'138px',
    borderRadius:'10px',
    justifyContent:'space-between',
    '@media (hover: hover) and (pointer: fine)': {
        '&:hover': {
            backgroundColor: theme.palette.background.paper,
        },
    },

    '& .MuiChip-label':{
        textAlign:'center',
        width:'100%',
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        whiteSpace: 'nowrap',
    },
}

export const addIcon = {
    
    [theme.breakpoints.down("md")]: { 
        width: '20px', 
        height: '20px' 
    } 
}

export const emptyUnits = { 
    display: 'block', 
    textAlign: 'center', 
    [theme.breakpoints.down("md")]: { 
        fontSize: '14px' 
    }, 
    '&.Mui-disabled': { 
        opacity: '1' 
    } 
}

export const scrollItems = {
    maxHeight:'145px',
    overflow:'auto',

}

//-------- main content --------//























// export const btnsCookHeader = {
//     padding: '5px 5px',
//     minHeight: 'auto',
//     borderRadius: '10px',
//     minWidth: '110px',
//     width: '100%',
//     textTransform:'none',
//     // m: '8px auto',
//     '@media (hover: hover) and (pointer: fine)': {
//         '&:hover': {
//             color: '#fff',
//             opacity:1,
//             backgroundColor: 'primary.dark'
//         },
//     },
//     whiteSpace: 'nowrap',
//     overflow: 'hidden',
//     textOverflow: 'ellipsis',
//     display: 'block',
//     textAlign: 'center',
//     maxWidth: '120px',
//     '& .MuiButtonBase-root': {
//         textAlign: 'center',
//     },
//     [theme.breakpoints.down('md')]:{
//         m: '0',
//     },
// } as const;


// export const deleteHeaderCook = {
//     minWidth: 'inherit',
//     p: '5px',
//     borderRadius: '50%',
//     width: '30px',
//     height: '30px',
//     '@media (hover: hover) and (pointer: fine)': {
//         '&:hover': {
//             backgroundColor: 'primary.main'
//         },
//         '&:hover svg': {
//             color: '#fff'
//         }
//     },

//     [theme.breakpoints.down("md")]: {
//         position:'absolute',
//         top:'0',
//         right:'0',
//         width: '35px',
//         height: '35px',
//     }

// }





// export const imgRecipeContainer = {
//     width:'100%',
//     height:'100%',
//     alignItems:'center',
//     justifyContent:'center',
//     display:'flex',
//     aspectRatio:'4/5',
//     maxWidth:'465px'
// }

// export const imgRecipe = {
//     height: '100%',
//     objectFit: "cover",
// }

// export const contentBlock = {
//     backgroundColor:'background.default',
//     borderRadius:'20px',
//     width:'50%',
//     overflow: "auto", 
//     p:'7px 7px',
//     // height:'fit-content',
//     flexShrink:'0',
//     mr:'20px',
//     height:'100%'
// }

// export const contentContainer ={
//     overflowX:'hidden',
//     scrollbarColor: "#353842 #1F2128",
//     maxHeight:'calc(100dvh - 74px)',
//     p:'15px 15px',
//     position:'relative'
   
// }

// export const descriptionRecipt = {
//     textAlign: 'center', 
//     fontSize: '16px', 
//     p: '15px 0 10px'
// }


// export const containerContentRecipe = {
//     width:'calc(100% - 200px)',
//     m:'0',
//     borderRadius:'20px',
//     backgroundColor:'background.default',
//     ml:"20px",
//     scrollbarColor: "#353842 #1F2128",
//     p:'10px',
    
//     [theme.breakpoints.down("md")]: {
//         // width:'calc(100% - 50px)',
//         width:'100%',
//         ml:"0px",
//         mt:'20px',
//         flexGrow: 1
//         // height:"100dvh",
//     }
// }


// export const ingredientsCook = {
//     display:'flex',
//     flexWrap:'wrap',
// }

// export const ingredientBox = {
//     width:'25%',
//     display:'block',
//     alignItems:'center',
//     p:'6px'
// }

// export const containerContentSlide ={
//     p:'5px',
// }

// export const avatartIngredient = {
//     margin:'0 auto', 
//     width:'50px', 
//     height:"50px",
//     objectFit:'cover'
// }


// export const addListIngr = {
//     backgroundColor:'background.default',
//     color:'text.secondary',
//     textTransform:'none',
//     p:'2px 7px',
//     lineHeight:'1.7',
//     '@media (hover: hover) and (pointer: fine)': {
//         '&:hover':{
//             color:'text.primary',
//             backgroundColor:'primary.main',
//         },
//     },
//     display:'block',
//     mt:'10px',
//     [theme.breakpoints.down("md")]: {    
//         fontSize:'14px',
//         minWidth:'0',
//         lineHeight:'14px',
//         p:"5px 7px"
//     }
// }







// export const btnAddNew = {
//     display:'flex', 
//     m:'0 auto 10px ', 
//     transition:'0',
//     color:'text.primary',
//     textTransform:'capitalize',
//     backgroundColor:'background.paper',
//     p:'5px 10px',
//     '@media (hover: hover) and (pointer: fine)': {
//         '&:hover':{
//             backgroundColor:'primary.dark',
//         }
//     },
//     [theme.breakpoints.down("md")]: {
//         width:'auto',
//         height:'auto',
//         p:'5px 15px',
//         borderRadius:'10px',
//         fontSize:'14px',
//         lineHeight:'20px'
//     }
// }