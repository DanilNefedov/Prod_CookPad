'use client'

import { Box, Skeleton } from "@mui/material";
import { elementHeader, links, skeletonContainer } from "@/app/(main)/cook/styles";
import { centerFlexBlock } from "@/app/styles";





export function SkeletonList () {

     
    return (
        <Box sx={skeletonContainer}>
            {Array.from({ length: 40 }).map((_, i) => (
                <Box key={i} sx={[elementHeader, centerFlexBlock]}>
                    <Skeleton
                        variant="rectangular" 
                        sx={[links]} 
                    />
                </Box>
                
            ))}
        </Box>
    );
};