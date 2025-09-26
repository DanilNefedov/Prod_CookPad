'use client'

import { mediaContainer } from "@/app/(main)/cook/styles";
import { videoContainer } from "@/app/(main)/home/styles";
import { RecipeMedia } from "@/app/(main)/types";
import { centerFlexBlock } from "@/app/styles";
import { Box } from "@mui/material";
import { CldImage, CldVideoPlayer } from "next-cloudinary";
import { useRef } from "react";



interface Props { 
    el: RecipeMedia, 
    recipeName:string, 
    priority:boolean
}



export function MediaSlide({ el, recipeName, priority }: Props) {
    const ref = useRef<HTMLDivElement | null>(null);


    return (
        
        <Box sx={[centerFlexBlock, mediaContainer]} ref={ref}>
            {el.media_type === "image" ? (

                <CldImage
                    alt={recipeName}
                    style={{ objectFit: "cover" }}
                    format="auto"
                    sizes="100%"
                    quality="auto"
                    src={el.media_url as string}
                    loading={priority ? "eager" : "lazy"}
                    priority={priority}
                    fill
                />
            ) : (
                <Box 
                    sx={videoContainer}
                > 
                    <CldVideoPlayer
                        src={el.media_url as string}
                        width={900}
                        height={1100}
                        autoPlay={true}
                        autoplay={true}
                        playsinline={true}
                        muted
                        loop
                        controls={false}
                    />
                </Box>
            )}
        </Box>
    );

}