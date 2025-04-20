'use client'

import { Box, CircularProgress, CircularProgressProps } from "@mui/material";





interface DataProps {
    color?: string; 
}

export function UXLoading({props}:{props:DataProps}) {
    const {color} = props


    return (
        <Box
            sx={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                zIndex: 10,
            }}
        >
            <CircularProgress  size="35px" sx={{
                color:color || 'secondary'
            }}
            />
        </Box>

    )
}