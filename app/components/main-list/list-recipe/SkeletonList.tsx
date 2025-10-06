import { skeletonBox, skeletonImg, skeletonName } from "@/app/(main)/(main-list)/list-recipe/styles";
import { Box, Skeleton } from "@mui/material";






export function SkeletonList(){
    
    
    
    return(
        <Box>
            {Array.from({ length: 12 }).map((_, idx) => (
                <Box 
                    key={`list-recipe-${idx}`}
                    sx={skeletonBox}>
                        <Skeleton variant="rectangular" sx={skeletonImg}></Skeleton>
                        <Skeleton variant="text" sx={skeletonName}></Skeleton>
                </Box>
            ))}
        </Box>
    )
}