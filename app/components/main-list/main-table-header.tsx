import { boxText, cellHeader, headerArrow, headerText, sortBtnHeader, tableHeader } from "@/app/(main)/(main-list)/style";
import { Box, TableCell, TableHead, TableRow, Theme, Typography } from "@mui/material";
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import { Dispatch, SetStateAction, } from "react";
import { usePathname } from "next/navigation";
import { centerFlexBlock } from "@/app/styles";





interface Props{
    sortOrder:'asc' | 'desc' | null, 
    setSortOrder:Dispatch<SetStateAction<"asc" | "desc" | null>>,
    sortBy:string | null, 
    setSortBy:Dispatch<SetStateAction<string | null>>
}


export function MainTableHeader ({props}: {props:Props}) {
    const {setSortBy, setSortOrder, sortBy, sortOrder} = props
    const pathName = usePathname()


    const border = (theme: Theme) => pathName === '/list-recipe' ? {
        borderRight: `3px solid ${theme.palette.background.default}`,
        borderBottom: `3px solid ${theme.palette.background.default}`,
    }
    : 
    {
        borderRight: `3px solid ${theme.palette.background.default}`,
        borderBottom: `3px solid ${theme.palette.background.default}`,
    };



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
        <TableHead sx={tableHeader}>
            <TableRow sx={[cellHeader, {
                '& .MuiTableCell-root': (theme) => border(theme)
            }]}>
                <TableCell sx={[headerText, {cursor:'initial'}]}>Image</TableCell>
                <TableCell sx={headerText} onClick={() => handleSort("name")}>
                    <Box sx={[centerFlexBlock, sortBtnHeader]}>
                        <Typography sx={boxText}>
                            Name
                        </Typography>
                        <ArrowUpwardIcon sx={[
                            headerArrow,
                            {transform: `rotate(${sortOrder === 'asc' && sortBy === 'name' ? '180deg' : '0deg'})`}
                        ]}></ArrowUpwardIcon>
                    </Box>

                </TableCell>
                {/* {isMobile ?
                    <TableCell onClick={() => handleSort("unit")} sx={{ cursor: 'pointer' }}>

                    </TableCell>
                    : */}
                <TableCell sx={headerText} onClick={() => handleSort("unit")} >
                    <Box sx={[centerFlexBlock, sortBtnHeader]}>
                        <Typography sx={boxText}>
                            Unit
                        </Typography>
                        <ArrowUpwardIcon sx={[
                            headerArrow,
                            {transform: `rotate(${sortOrder === 'asc' && sortBy === 'name' ? '180deg' : '0deg'})`}
                        ]}></ArrowUpwardIcon>
                    </Box>

                </TableCell>
                {/* } */}
                <TableCell sx={{}}>
                </TableCell>
            </TableRow>
        </TableHead>
    )
}