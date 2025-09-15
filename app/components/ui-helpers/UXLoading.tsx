'use client'

import { Box, CircularProgress, useMediaQuery } from "@mui/material";
import { loadingContainer } from "./styles";





interface Props {
    color?: string;
    position?: string
}

export function UXLoading({  position = "absolute" }: Props) {//color = "secondary",
    const isMobile = useMediaQuery('(max-width:750px)');

   
    const fallbackSize = isMobile ? 28 : 35;

    return (
        <Box sx={loadingContainer(position)}>
            <CircularProgress size={fallbackSize}/>
        </Box>

    )
}