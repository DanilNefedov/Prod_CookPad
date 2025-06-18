import { theme } from "@/config/ThemeMUI/theme"

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