import { MainListPage } from "@/app/components/main-list/list/main-page-list";
import { Box, Paper, TableContainer } from "@mui/material";
import { mainBox, tableContainer } from "../style";




export default function List() {


    return (
        <Box sx={mainBox}>
            <TableContainer component={Paper} sx={tableContainer}>
                <MainListPage></MainListPage>
            </TableContainer>
        </Box>

    )
}
