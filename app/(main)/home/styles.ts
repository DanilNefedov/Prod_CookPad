import { theme } from "@/config/ThemeMUI/theme"
import { SxProps, Theme } from "@mui/material"
import { PageStyles } from "./types"

//: SxProps<Theme> = (theme) => ({  : SxProps<Theme> = {


export const styledPaperHome = {
    borderRadius: '20px 0 0 20px',
    width: "calc(100% - 165px)",

    [theme.breakpoints.down("md")]: {
        width: "calc(100% - 60px)",
    },
    [theme.breakpoints.down(500)]: {
        width: "calc(100% - 45px)",
    }
}

export const containerHome = {
    height: '100dvh',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    position: 'relative',
    [theme.breakpoints.down("md")]: {
        pl: "10px",
        pr: '10px'
    },
}

//------- navigation site -------//

export const paperNavigation: SxProps<Theme> = {
    backgroundColor: 'background.default',
    // flexGrow: 0,
    borderRadius: '0',
    width: '100%',
    maxWidth: '165px',
    [theme.breakpoints.down("md")]: {
        maxWidth:'60px'
    },
    [theme.breakpoints.down(500)]: {
        maxWidth:'45px'
    }
}

export const containerNavigation = {
    height: '100dvh', 
    padding:'17px 12px 25px 12px',

    '&.MuiContainer-root': {
    
        [theme.breakpoints.down("md")]: {
            pl:'0px',
            pr:'0',
        },

        [theme.breakpoints.down(500)]: {
            pr:'0'
        }
    },
}

export const containerUser = { 
    width:'100%', 
    flexDirection:'column'
}

export const textAvatar = {
    fontWeight:'600',
    mt:1,
    maxWidth: '90px',
    [theme.breakpoints.down("md")]: {
        display:'none'
    },
}

export const containerButtons = {
    display:'flex', 
    flexDirection:'column', 
    [theme.breakpoints.down("md")]: {
        display:'block'
    }
}

export function btnLink(page: PageStyles, pathname: string) {
    const thisPage = page.path.find(el => matchPath(el, pathname));

    return {
        maxHeight:'37px',
        textTransform: 'initial',
        color: thisPage ? 'text.primary' : 'text.disabled',
        backgroundColor: thisPage ? 'primary.main' : 'background.paper',
        mb: '20px',
        lineHeight: '14px',
        justifyContent: "flex-start",
        
        '@media (hover: hover) and (pointer: fine)': {
            '&:hover': {
                color: 'text.primary'
            },
        },

        [theme.breakpoints.down("md")]: {
            maxHeight:'35px',
            height:'35px',
            p:'5px 5px 5px 2px',
            minWidth:'auto',
            borderRadius:'0 20px 20px 0',

            '& span':{
                display:'none'
            }
        },
    }
}

export const havigationIcons = {
    mr:'5px', 
    [theme.breakpoints.down("md")]: {
        width:'30px', 
        height:'35px', 
        mr:'0'
    }
}

function matchPath(pagePaths: string, pathname: string): boolean {
    const regexPath = new RegExp('^' + pagePaths.replace(/:[^\s/]+/g, '([^\\s/]+)') + '$');
    return regexPath.test(pathname);   
}

export const containerExit = {
    display:'flex', 
    justifyContent:'center',
    [theme.breakpoints.down("md")]: {
        justifyContent:'flex-start'
    }
}

export const exitButton = {
    lineHeight: 'inherit',
    color: 'text.disabled',
    width: '100%',
    '@media (hover: hover) and (pointer: fine)': {
        ':hover': {
            color: 'text.primary'
        },
    },
    [theme.breakpoints.down("md")]: {
        minWidth:'auto',
        ml:'0px',
        p:'5px',
        borderRadius:'0 20px 20px 0',
        width:'40px',
        '& span':{
            display:'none'
        }
    },
}

export const exitIcon = {
    mr:'5px',  
    [theme.breakpoints.down("md")]: {
        mr:'0'
    },
}

//------- navigation site -------//

//------- navigation home -------//

export const appBar = {
    position:"static",
    boxShadow: 'none',
    m: '10px 0',
    borderRadius: '20px',
    backgroundColor: 'background.default',
    padding: '10px 10px',

    [theme.breakpoints.down("md")]: {
        padding: '7px 7px',
        borderRadius: '10px',
    },
} 

export const toolBar = {
    justifyContent: 'space-between',
    '&.MuiToolbar-root': {
        minHeight: 0,
    },
}

export const linksBar = {
    textTransform: 'initial',
    padding: '4px 12px',
    minHeight: '0',
    minWidth: '0',
    mr: '15px',
    borderRadius: '10px',
    color:'text.disabled',
    
}

//------- navigation home -------//

//--------- home content --------//

export const mainContent = {
    overflowY: 'auto',
    mb: '20px',
    borderRadius: '0',
    scrollbarWidth: 'none',
    '&::-webkit-scrollbar': {
        display: 'none' 
    }
}


export const mainContainer = {
    height: '100dvh',
    display: 'flex',
    flexWrap: 'wrap', 
    borderRadius: '20px',
    gap:'2%',
    alignContent:'flex-start',
}

export const linkEmptyPage = {
    position: 'absolute',
    top: '65%',
    left: '50%',
    transform: 'translate(-50%, -50%)',      
}

export const moreButtonContainer = {
    width: '100%', 
    display: 'flex', 
    justifyContent:'center'
}

export const mainCard = {
    width: '32%',
    backgroundColor: 'background.default',
    mb: '20px',
    borderRadius: '0',
    '&:nth-child(1)': {
        borderRadius: '20px 0 0 0',
    },
    '&:nth-child(3)': {
        borderRadius: '0 20px 0 0',
    },
    alignItems: "stretch",
    maxHeight:'450px',
    height:'100%',
    position:'relative',
    [theme.breakpoints.down(710)]: {
        maxHeight:'350px',
        width: '48%',
        mb:"0",
        '&:nth-child(1)': {
            borderRadius: '10px 0 0 0',
        },
        '&:nth-child(2)': {
            borderRadius: '0 10px 0 0',
        },
        '&:nth-child(3)': {
            borderRadius: '0 0 0 0',
        },
    },
    [theme.breakpoints.down(500)]: {
        maxHeight:'300px',
        width: '48.5%',
    }
}

export const contentPostionAbsolute = {
    position:'absolute',
    backgroundColor:'common.cardBlack7',
    width: '100%',
    padding:'7px 15px',
    backdropFilter: 'blur(3px)',
    zIndex:'100',

    [theme.breakpoints.down(500)]: {
       p:"7px"
    },
}

export const headerCard = {
    padding: 0, 
    maxWidth: "70%", 
    '& .MuiCardHeader-content':{
        width:'100%'
    }, 
    [theme.breakpoints.down(500)]: {
        maxWidth: "57%"
    }
}

export const headerCardTitle = {
    // fontSize:'inherit',
    textTransform: 'capitalize',
    width:'100%',
    
}

export const timeIcon = {
    fontSize: "20px",
    height: '20px',
    mr: '3px',
    [theme.breakpoints.down("md")]: {
        height: '17px',
    },
}

export const arrowSwiper = {
    width:'100%', 
    height:'100%'
}

export const cardBottom = {
    bottom: '0', 
    '&:last-child':{
        pb:'7px'
    } 
}

export const typeRecipeText = {
    mb:'0', 
    color: 'text.lightGray',
    lineHeight: 'inherit',
    [theme.breakpoints.down("md")]: {
        whiteSpace: "nowrap",
        overflow: "hidden",
        textOverflow: "ellipsis"
    },
}

export const descriptionText = {
    pb: '8px',
    m: '0',
    maxWidth:"80%",
    cursor: 'pointer',
    overflow: 'hidden',
   
}

export const mobileMenu = {
    color: 'text.disabled', 
    position:'absolute', 
    top:'30px', 
    right:'9px', 
    width:'20px', 
    height:'20px', 
    padding:'0'
}

export const containerMenu = {
    '& .MuiPaper-root':{
        bgcolor:'background.default',
        padding:'7px 0',
        borderRadius:'15px'
    }
}

export const mobileButtons = {
    minHeight:'auto', 
    justifyContent:'center', 
    p:'4px 7px',
}

export const cookBtn = {
    padding: '2px 10px', 
    backgroundColor: '#4F5362', 
    color: 'text.primary', 
    textTransform: 'initial', 
    // fontSize: '15px', 
    '@media (hover: hover) and (pointer: fine)': {
        "&:hover": { 
            backgroundColor: 'primary.main', 
            color: "text.primary" 
        },
    },
    [theme.breakpoints.down("md")]: {
        // fontSize: '12px', 
        padding: '2px 5px',
        minWidth:'50px'
    },
    [theme.breakpoints.down(500)]: {
        borderRadius:'10px',
    },
}

export const media = { 
    height: '100%', 
    objectFit: 'cover', 
    width: '100%' 
}

export function transitionBlock(ellipsisEnabled:boolean) {

    return {
        overflow: 'hidden',
        transition: 'opacity 0.3s ease, max-height 0.3s ease',
        opacity: ellipsisEnabled ? 1 : 0,
        maxHeight: ellipsisEnabled ? '150px' : 0,
    }
}

export function transitionDescription(ellipsisEnabled:boolean) {

    return {
        maxWidth: ellipsisEnabled ? '80%' : '100%',
        transition: 'all 0.3s ease',
        whiteSpace: ellipsisEnabled ? 'nowrap' : 'normal',
        textOverflow: ellipsisEnabled ? 'ellipsis' : 'unset',
    }
}


//--------- home content --------//

