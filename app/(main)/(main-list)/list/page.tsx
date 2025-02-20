import { MainListPage } from "@/app/components/main-list/list/main-page-list";
import { Box } from "@mui/material";




export default function List() {


    return (
        <Box sx={{ height: '100%', position: 'relative' }}>
            
            <MainListPage></MainListPage>
            {/* <AddListFab></AddListFab> */}
        </Box>

    )
}
