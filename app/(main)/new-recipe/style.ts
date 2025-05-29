import { theme } from "@/config/ThemeMUI/theme";
import { styled } from "@mui/material";



export const VisuallyHiddenInput = styled('input')({
    clip: 'rect(0 0 0 0)',
    clipPath: 'inset(50%)',
    height: 1,
    overflow: 'hidden',
    position: 'absolute',
    bottom: 0,
    left: 0,
    whiteSpace: 'nowrap',
    width: 1,
  });


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