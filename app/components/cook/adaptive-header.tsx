'use client'

import { headerCook, scrollBox } from "@/app/(main)/cook/[recipe_id]/styles";
import { Box, Button, Drawer } from "@mui/material"
import { useState } from "react";
import { HeaderCook } from "./header-cook";
import MenuIcon from '@mui/icons-material/Menu';



export function AdaptiveHeader() {
    const [open, setOpen] = useState(false);

    const toggleDrawer = (newOpen: boolean) => () => {
      setOpen(newOpen);
    };
  
    console.log('AdaptiveHeader')
    return (
        <>
            <Button onClick={toggleDrawer(true)}
            sx={{
                minWidth:'0',
                p:'0'
            }}
            ><MenuIcon sx={{color:'#8E94A4'}}></MenuIcon></Button>
            <Drawer open={open} onClose={toggleDrawer(false)}>
                <Box sx={{...headerCook, borderRadius:"0"}}>
                    <Box sx={scrollBox}>
                        <HeaderCook />
                    </Box>
                </Box>
            </Drawer>
        </>
    )
}