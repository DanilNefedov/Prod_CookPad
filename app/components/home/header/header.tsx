import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import TabsRenderer from './tabs';
import { appBar, toolBar } from '@/app/(main)/home/styles';




export default function Header() {

  return (
    <AppBar component="nav" sx={appBar}>
      <Toolbar disableGutters sx={toolBar}>
        <Box>
          <TabsRenderer />
        </Box>
      </Toolbar>
    </AppBar>
  );
}
