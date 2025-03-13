import { cellHeader, sortBtnHeader } from "@/app/(main)/(main-list)/style";
import { Box, TableCell, TableHead, TableRow, Typography } from "@mui/material";
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import { Dispatch, SetStateAction, useState } from "react";





interface DataProps{
    sortOrder:'asc' | 'desc' | null, 
    setSortOrder:Dispatch<SetStateAction<"asc" | "desc" | null>>,
    sortBy:string | null, 
    setSortBy:Dispatch<SetStateAction<string | null>>
}


export function MainTableHeader ({props}: {props:DataProps}) {
    const {setSortBy, setSortOrder, sortBy, sortOrder} = props

    const handleSort = (name: string) => { //check for frequent re-rendering. if any, rewrite to useCallback
        if (sortBy === name) {
            setSortBy(null);
            setSortOrder(null);
        } else {
            setSortBy(name);
            setSortOrder(name === 'unit' ? 'desc' : 'asc');
        }
    };


    return(
        <TableHead sx={{
            '& .MuiTableCell-root': {
                borderBottom: '0',
            },
        }}>
            <TableRow sx={cellHeader}>
                <TableCell align="center">Image</TableCell>
                <TableCell align="center" onClick={() => handleSort("name")} sx={{ cursor: 'pointer' }}>
                    <Box sx={sortBtnHeader}>
                        <Typography fontSize={'0.875rem'} sx={{ borderBottom: '0', pr: '10px' }}>
                            Name
                        </Typography>
                        <ArrowUpwardIcon sx={{ width: '16px', transition: "transform 0.3s ease", transform: `rotate(${sortOrder === 'asc' && sortBy === 'name' ? '180deg' : '0deg'})` }}></ArrowUpwardIcon>
                    </Box>

                </TableCell>
                {/* {isMobile ?
                    <TableCell onClick={() => handleSort("unit")} sx={{ cursor: 'pointer' }}>

                    </TableCell>
                    : */}
                <TableCell align="center" onClick={() => handleSort("unit")} sx={{ cursor: 'pointer' }}>
                    <Box sx={sortBtnHeader}>
                        <Typography fontSize={'0.875rem'} sx={{ borderBottom: '0', pr: '10px' }}>
                            Unit
                        </Typography>
                        <ArrowUpwardIcon sx={{ width: '16px', transition: "transform 0.3s ease", transform: `rotate(${sortOrder === 'desc' && sortBy === 'unit' ? '180deg' : '0deg'})` }}></ArrowUpwardIcon>
                    </Box>

                </TableCell>
                {/* } */}
                <TableCell>
                </TableCell>
            </TableRow>
        </TableHead>
    )
}