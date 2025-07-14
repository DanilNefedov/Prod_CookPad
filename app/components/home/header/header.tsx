import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import TabsRenderer from './tabs';
import { appBar, toolBar } from '@/app/(main)/home/styles';




export default function Header() {

  return (
    <AppBar component="nav" sx={appBar}>
      <Toolbar disableGutters sx={toolBar}>
        {/* <Box sx={{width:'100%'}}> */}
          <TabsRenderer />
        {/* </Box> */}
      </Toolbar>
    </AppBar>
  );
}
