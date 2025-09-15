'use client'

import { mediaContainer } from "@/app/(main)/cook/styles";
import { RecipeMedia } from "@/app/(main)/types";
import { cardMedia, centerFlexBlock } from "@/app/styles";
import { Box, CardMedia } from "@mui/material";
import { useRef } from "react";







export function MediaSlide({ el }: { el: RecipeMedia}) {
    const ref = useRef<HTMLDivElement | null>(null);


    return (
        
        <Box sx={[centerFlexBlock, mediaContainer]} ref={ref}>
            {el.media_type === "image" ? (
                <CardMedia
                    alt="image"
                    sx={cardMedia}
                    component="img"
                    src={el.media_url as string}
                    loading="lazy"
                />
            ) : (
                <CardMedia
                    sx={cardMedia}
                    component="video"
                    autoPlay
                    loop
                    muted
                    poster={el.media_url as string}
                >
                    <source src={el.media_url as string} type="video/mp4" />
                </CardMedia>
            )}
        </Box>
    );

}