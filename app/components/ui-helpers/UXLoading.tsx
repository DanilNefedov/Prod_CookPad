'use client'

import { Box, CircularProgress, useMediaQuery } from "@mui/material";
import { loadingContainer } from "./styles";
import { theme } from "@/config/ThemeMUI/theme";





interface Props {
    color?: string;
    position?: string
}

export function UXLoading({  position = "absolute" }: Props) {//color = "secondary",
    const isMobile = useMediaQuery(theme.breakpoints.down(750));
    const fallbackSize = isMobile ? 28 : 35;

    return (
        <Box sx={loadingContainer(position)}>
            <CircularProgress size={fallbackSize}/>
        </Box>

    )
}