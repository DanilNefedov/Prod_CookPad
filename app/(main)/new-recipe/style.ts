import { theme } from "@/config/ThemeMUI/theme";
import { styled } from "@mui/material";





export const mainPaper = { 
    boxShadow: 'none', 
    width: '100%',           
}

export const container = {
    width: '100%', 
    maxWidth:'100%', 
    '&.MuiContainer-root': {
        paddingLeft: 0,
        paddingRight: 0,
    },
    display: "flex",
    flexDirection: "column",
    height: "100dvh",
    padding: "10px 0",
}

export const form = {
    '& .MuiTextField-root': {
        m: 1, 
    },
    flexGrow: 1,
    display: 'flex',
    flexDirection: 'column',
    mt: '20px',
    width: '100%',
    maxHeight:'84dvh',
}

export const containerProgress = { 
    width: '100%', 
    mt: '10px' 
}

export const stepper = {
    '& .MuiStepConnector-root.Mui-active .MuiStepConnector-line': {
        borderColor: 'primary.main',
    },
    '& .MuiStepConnector-root.Mui-completed .MuiStepConnector-line': {
        borderColor: 'primary.main',
    },
    '& .MuiStepLabel-iconContainer': {
        [theme.breakpoints.down(500)]: {
            p: '0',
            '& svg': {
                width: '19px',
                height: '19px',
            }
        }
    }
}

export const stepperText = { 
    fontSize: '12px',
    [theme.breakpoints.down(1250)]: { 
        display: 'none' 
    } 
}

export const buildLoaderBox = {
    position: 'absolute',
    width: '100%',
    height: '100%',
    top: '0',
    left: '0',
    backgroundColor: 'common.black46',
    backdropFilter: 'blur(10px)',
    zIndex: 99999,
}

export const errorBox = {
    maxWidth: "270px",
    width: '100%',
    position: 'absolute',
    bottom: '20px',
    right: 'calc(50% - 135px)',
    zIndex: 99999,
    '& .MuiPaper-root':{
        alignItems:'center'
    },
    
}
































// export const VisuallyHiddenInput = styled('input')({
//     clip: 'rect(0 0 0 0)',
//     clipPath: 'inset(50%)',
//     height: 1,
//     overflow: 'hidden',
//     position: 'absolute',
//     bottom: 0,
//     left: 0,
//     whiteSpace: 'nowrap',
//     width: 1,
//   });


export const btnsSwiperMedia = {
    '@media (hover: hover) and (pointer: fine)': {
        '&:hover': {
            backgroundColor: 'background.paper'
        },
        '&:hover .MuiSvgIcon-root': {
            color: 'primary.main'
        },
    },
    
    position: 'absolute',
    backgroundColor: 'background.paper',
    top: '10px',
}


export const addMainMediaSwiper = {
    left: '10px'
}


export const  deleteMediaSwiper= {
    right: '10px'
}



export const typeDishInput = {
    
    display: 'flex',
    borderColor: '#fff',
    "& .MuiSvgIcon-root": {
        color: "#8E94A4",
    },
    '&&': {
        m: '40px 8px 0',
        [theme.breakpoints.down('md')]: {
            m: '10px 0'
        }
    },

    '& .MuiOutlinedInput-root': {
        '& fieldset': {
            borderColor: '#353842',
        },
    },
    '& .MuiInputBase-root': {
        backgroundColor: '#1F2128',
        color: '#fff',

        '&.Mui-focused': {
            backgroundColor: '#1F2128',
            color: '#fff',
            '& fieldset': {
                borderColor: '#fff',
            },
        },
    },

    '& .MuiSelect-select': {
        [theme.breakpoints.down('md')]: {
            p: "10px",
            fontSize: '14px'
        },
    },
    '& .MuiInputLabel-root': {
        color: '#fff',
        
        '&.Mui-focused': {
            color: '#fff',
        },
        [theme.breakpoints.down('md')]: {
            fontSize: '14px',
            lineHeight: "14px"
        },
    },
            
}