import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import { appBar, toolBar } from '@/app/(main)/home/styles';
import TabsRender from './TabsRender';




export default function Header() {

  return (
    <AppBar component="nav" sx={appBar}>
      <Toolbar disableGutters sx={toolBar}>
        {/* <Box sx={{width:'100%'}}> */}
          <TabsRender />
        {/* </Box> */}
      </Toolbar>
    </AppBar>
  );
}
