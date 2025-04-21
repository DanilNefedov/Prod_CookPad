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