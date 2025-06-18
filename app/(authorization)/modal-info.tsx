'use client'


import { Button, Popover, Typography } from "@mui/material";
import InfoIcon from '@mui/icons-material/Info';
import { MouseEvent, useState } from "react";






export function ModalInfo(){
    const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);

    const handleClick = (event: MouseEvent<HTMLButtonElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const open = Boolean(anchorEl);
    const id = open ? 'simple-popover' : undefined;

    return (
        <div >
            <Button aria-describedby={id} variant="contained" onClick={handleClick} sx={{width:'0', minWidth:'0', p:'0'}}>
                <InfoIcon sx={{width:'20px', height:'20px', mb:'4px'}}></InfoIcon>
            </Button>
            <Popover
                id={id}
                open={open}
                anchorEl={anchorEl}
                onClose={handleClose}
                anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'left',
                }}
            >
                <Typography sx={{ p: 2, maxWidth:"300px", bgcolor:'background.default' }}>For the convenience of testing, registration allows the use of non-existent addresses, for example: tt@tt.tt.</Typography>
            </Popover>
        </div>
    );
}