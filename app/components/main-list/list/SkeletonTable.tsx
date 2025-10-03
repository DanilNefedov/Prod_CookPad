'use client'

import { tableBody } from "@/app/(main)/(main-list)/list/styles";
import { ingredientNameBox, mainButtonsBox, mainButtonsCell, skeletonImg, unitBox, unitBoxDesktop } from "@/app/(main)/(main-list)/styles";
import { Box, Skeleton, TableBody, TableCell, TableRow, useMediaQuery } from "@mui/material";







export function SkeletonTable({ count, widths }: { count: number, widths:number[] }) {
    const isMobile = useMediaQuery("(max-width:800px)");
    const isMobileBtn = useMediaQuery("(max-width:1150px)");





    return (

        <TableBody sx={tableBody}>
            <TableRow sx={[{backgroundColor: 'background.default',
    borderRadius: '15px',
    height:'60px',}, {
                '& .MuiTableCell-root': {
                    borderBottom: `${isMobile ? 'none' : '5px solid'}`,
                    borderColor: 'background.paper'
                },
            }]}>
                <TableCell sx={{ width: '50px' }}>
                    <Skeleton component={'div'} variant="rectangular" sx={[skeletonImg, { width: '50px' }]}></Skeleton>
                </TableCell>

                <TableCell sx={[ingredientNameBox]}>
                    <Skeleton variant="text" sx={{ width: '85px' }}></Skeleton>
                </TableCell>

                <TableCell sx={isMobile ? [unitBox] : [unitBox, unitBoxDesktop]}>
                    {
                        !isMobile &&
                        <Box
                            sx={{ display: 'flex', gap: '10px', overflow: 'hidden', }}
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

                    }
                </TableCell>

                <TableCell sx={mainButtonsCell}>
                    {
                        !isMobileBtn &&
                        <Box sx={mainButtonsBox}>
                            <Skeleton variant="rectangular" sx={{ width: '40px', height: '40px', borderRadius: '50%' }}></Skeleton>
                            <Skeleton variant="rectangular" sx={{ width: '40px', height: '40px', borderRadius: '50%' }}></Skeleton>
                            <Skeleton variant="rectangular" sx={{ width: '40px', height: '40px', borderRadius: '50%' }}></Skeleton>
                        </Box>
                    }
                </TableCell>
            </TableRow>
        </TableBody>




    )
}