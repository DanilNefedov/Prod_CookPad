'use client'


import { IconButton, Popover, Typography } from "@mui/material";
import InfoIcon from '@mui/icons-material/Info';
import { MouseEvent, useState } from "react";
import { textPopover } from "./styles";






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
            <IconButton color={'white'} aria-describedby={id} onClick={handleClick}>
                <InfoIcon sx={{width:'20px', height:'20px'}}></InfoIcon>
            </IconButton>
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
                <Typography sx={textPopover}>
                    For the convenience of testing, registration allows the use of non-existent addresses, for example: tt@tt.tt.
                </Typography>
            </Popover>
        </div>
    );
}