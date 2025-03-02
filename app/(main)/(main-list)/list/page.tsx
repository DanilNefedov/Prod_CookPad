import { MainListPage } from "@/app/components/main-list/list/main-page-list";
import { Box, Paper, Table, TableContainer } from "@mui/material";
import { blockList } from "../style";




export default function List() {


    return (
        <Box sx={{ height: '100%', position: 'relative' }}>
            <TableContainer component={Paper} sx={{ ...blockList, backgroundColor: "background.paper", boxShadow: 'none' }}>
                <MainListPage></MainListPage>
            </TableContainer>
            {/* <AddListFab></AddListFab> */}
        </Box>

    )
}
