import { cellHeader, sortBtnHeader } from "@/app/(main)/(main-list)/style";
import { Box, TableCell, TableHead, TableRow, Typography } from "@mui/material";
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import { Dispatch, SetStateAction, } from "react";
import { usePathname } from "next/navigation";





interface Props{
    sortOrder:'asc' | 'desc' | null, 
    setSortOrder:Dispatch<SetStateAction<"asc" | "desc" | null>>,
    sortBy:string | null, 
    setSortBy:Dispatch<SetStateAction<string | null>>
}


export function MainTableHeader ({props}: {props:Props}) {
    const {setSortBy, setSortOrder, sortBy, sortOrder} = props
    const pathName = usePathname()


    const border = pathName === '/list-recipe' ? {
        borderRight: '2px solid #1F2128',
        borderBottom:'2px solid #1F2128',
    } 
        : 
    {
        borderRight: '2px solid #37393c',
        borderBottom:'2px solid #37393c',
    }


    const handleSort = (name: string) => { 
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
            '& .MuiTableCell-root .head': {
                borderBottom: '0',
            },
        }}>
            <TableRow sx={{...cellHeader, '& .MuiTableCell-root': {
                ...border,
                '&:last-child': {
                    borderRight: '0'
                }
            }}}>
                <TableCell  align="center">Image</TableCell>
                <TableCell align="center" onClick={() => handleSort("name")} sx={{ cursor: 'pointer', }}>
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
                <TableCell align="center" onClick={() => handleSort("unit")} sx={{ cursor: 'pointer', }}>
                    <Box sx={sortBtnHeader}>
                        <Typography fontSize={'0.875rem'} sx={{ borderBottom: '0', pr: '10px' }}>
                            Unit
                        </Typography>
                        <ArrowUpwardIcon sx={{ width: '16px', transition: "transform 0.3s ease", transform: `rotate(${sortOrder === 'desc' && sortBy === 'unit' ? '180deg' : '0deg'})` }}></ArrowUpwardIcon>
                    </Box>

                </TableCell>
                {/* } */}
                <TableCell sx={{}}>
                </TableCell>
            </TableRow>
        </TableHead>
    )
}