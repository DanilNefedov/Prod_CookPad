'use client'

import { skeletonBoxMainBtns, skeletonBoxUnits, skeletonMainBtns, skeletonTableRow, tableBody } from "@/app/(main)/(main-list)/list/styles";
import { ingredientNameBox, mainButtonsBox, mainButtonsCell, skeletonImg, unitBox, unitBoxDesktop } from "@/app/(main)/(main-list)/styles";
import { Box, Skeleton, TableBody, TableCell, TableRow, useMediaQuery } from "@mui/material";







export function SkeletonTable({ count, widths }: { count: number, widths: number[] }) {
    const isMobile = useMediaQuery("(max-width:800px)");





    return (

        <TableBody sx={tableBody}>
            <TableRow sx={[skeletonTableRow]}>
                <TableCell sx={{ width: '50px' }}>
                    <Skeleton component={'div'} variant="rectangular" sx={[skeletonImg, { width: '50px' }]}></Skeleton>
                </TableCell>

                <TableCell sx={[ingredientNameBox]}>
                    <Skeleton variant="text" sx={{ width: '85px' }}></Skeleton>
                </TableCell>

                <TableCell sx={isMobile ? [unitBox] : [unitBox, unitBoxDesktop]}>

                    <Box
                        sx={skeletonBoxUnits}
                    >
                        {Array.from({ length: count }).map((_, idx) => {
                            return (
                                <Skeleton
                                    key={idx}
                                    variant="rectangular"
                                    sx={{
                                        width: `${widths[idx]}px`,
                                        minWidth: `${widths[idx]}px`,
                                        height: "42px",
                                        borderRadius: "10px",
                                    }}
                                />
                            );
                        })}

                    </Box>


                </TableCell>

                <TableCell sx={mainButtonsCell}>

                    <Box sx={[mainButtonsBox, skeletonBoxMainBtns]}>
                        <Skeleton variant="rectangular" sx={skeletonMainBtns}></Skeleton>
                        <Skeleton variant="rectangular" sx={skeletonMainBtns}></Skeleton>
                        <Skeleton variant="rectangular" sx={skeletonMainBtns}></Skeleton>
                    </Box>

                </TableCell>
            </TableRow>
        </TableBody>




    )
}