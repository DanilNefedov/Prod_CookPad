import { MainListPage } from "@/app/components/main-list/list/main-page-list";
import { Box, Paper, Table, TableContainer } from "@mui/material";
import { blockList } from "../style";




export default function List() {


    return (
        <Box sx={{ height: 'calc(100vh - 85px)', position: 'relative' }}>
            <TableContainer component={Paper} sx={{ ...blockList, backgroundColor: "background.paper", boxShadow: 'none' }}>
                <MainListPage></MainListPage>
            </TableContainer>
            {/* <AddListFab></AddListFab> */}
        </Box>

    )
}
