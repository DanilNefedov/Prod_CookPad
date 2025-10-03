import { cellHeader, headerText, sortBtnHeader, tableHeader } from "@/app/(main)/(main-list)/styles";
import { centerFlexBlock } from "@/app/styles";
import { theme } from "@/config/ThemeMUI/theme";
import { Box, Skeleton, TableCell, TableHead, TableRow } from "@mui/material";






export function SkeletonHeader() {
    return (
        <TableHead sx={tableHeader}>
            <TableRow sx={[cellHeader, {
                '& .MuiTableCell-root': {
                    borderRight: `3px solid ${theme.palette.background.default}`,
                    borderBottom: `3px solid ${theme.palette.background.default}`,
                }
            }]}>
                <TableCell sx={{

                    [theme.breakpoints.down('md')]: {
                        '&.MuiTableCell-root': {
                            p: '10px 5px 5px',
                        },
                    },
                }}>
                    <Skeleton variant="text" width={50}></Skeleton>
                </TableCell>
                <TableCell sx={headerText}>
                    <Box sx={[centerFlexBlock, sortBtnHeader]}>
                        <Skeleton variant="text" sx={{ width: '100%' }}></Skeleton>
                    </Box>
                </TableCell>
                <TableCell sx={headerText} >
                    <Box sx={[centerFlexBlock, sortBtnHeader]}>
                        <Skeleton variant="text" sx={{ width: '70px' }}></Skeleton>
                    </Box>

                </TableCell>

                <TableCell sx={{}}>
                </TableCell>
            </TableRow>
        </TableHead>
    )
}