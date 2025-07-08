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
        '@media (hover: hover) and (pointer: fine)': {
            '&:hover': {
                color: 'text.primary'
            },
        },
        mb: '20px',
        lineHeight: '14px',
        justifyContent: "flex-start",
        [theme.breakpoints.down("md")]: {
            p:'5px',
            minWidth:'auto',
            borderRadius:'0 20px 20px 0',

            '& span':{
                display:'none'
            }
        },
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
        padding: '5px 5px',
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
    [theme.breakpoints.down("md")]: {
        fontSize: '12px'
    },
}

//------- navigation home -------//




















export const mainContent = {
    backgroundColor: 'transparent',
    flex: '1',
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
    '&.MuiContainer-root': {
        paddingLeft: 0,
        paddingRight: 0,
    },
    borderRadius: '20px',
    gap:'2%',
    alignContent:'flex-start',
    
    // justifyContent:'space-between'
}


export const mainCard = {
    width: '32%',
    backgroundColor: 'background.default',
    mb: '20px',
    // height: 'fit-content',
    borderRadius: '0',
    '&:nth-child(1)': {
        borderRadius: '20px 0 0 0',
    },
    '&:nth-child(3)': {
        borderRadius: '0 20px 0 0',
    },
    alignItems: "stretch",
    height:'450px',
    position:'relative',

    [theme.breakpoints.down(710)]: {
        height:'350px',
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
        height:'250px',
        width: '48.5%',
        // m: '0 0 15px 0',
    }
    
}

export const mainCardImg = { 
    // borderRadius: '50%', 
    objectFit: "cover", 
    objectPosition: "center",
    width: '100%',
    height:'100%',
    m: '0 auto',
    flex: '1',
}

export const contentPostionAbsolute = {
    position:'absolute',
    backgroundColor:'rgba(31,33,40, 0.7)',
    width: '100%',
    padding:'7px 15px',
    backdropFilter: 'blur(3px)',
    zIndex:'100',

    [theme.breakpoints.down(500)]: {
       p:"7px"
    },
}


export const bottomTypeFavCard = {
    display: 'flex', 
    alignItems: 'center', 
    justifyContent: 'space-between',
    bottom:'0'
}

export const bottomDescriptionCard = {
    padding: '0 13px ', 
    maxWidth: '200p'
}


export const favoriteBtnActive ={ 
    color: 'primary.main', 
    '@media (hover: hover) and (pointer: fine)': {
        '&:hover': {
        color: 'primary.main',
        },
    },
    // '&:hover': { 
    //     color: 'primary.main' 
    // },
    [theme.breakpoints.down("md")]: {
        height:'20px',
        width:'20px'
    }, 
}

export const favoriteBtnDesactive = { 
    color: '#8E94A4', 
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


export const cookBtn = {
    padding: '2px 10px', 
    backgroundColor: '#4F5362', 
    color: 'text.primary', 
    textTransform: 'initial', 
    fontSize: '15px', 
    '@media (hover: hover) and (pointer: fine)': {
        "&:hover": { 
            backgroundColor: 'primary.main', 
            color: "text.primary" 
        },
    },

    [theme.breakpoints.down("md")]: {
        fontSize: '12px', 
        padding: '2px 5px',
        minWidth:'50px'
    },
}