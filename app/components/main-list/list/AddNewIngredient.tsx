import { Box, Button, Fab, Modal, Popover, SpeedDial, SpeedDialAction, Typography } from "@mui/material";
import SpeedDialIcon from '@mui/material/SpeedDialIcon';
import { useRef, useState } from "react";
import AddIcon from '@mui/icons-material/Add';



export function AddNewIngredient() {
    const [open, setOpen] = useState(false);
    const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);
    const fabRef = useRef<HTMLButtonElement>(null);

    const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        setAnchorEl(event.currentTarget);
        setOpen((prev) => !prev);
    };

    const handleClose = () => setOpen(false);

    // const open = Boolean(anchorEl);
    const id = open ? 'simple-popover' : undefined;



    return (
        <Box sx={{ position: 'absolute', right: '28px', bottom: '10px' }}>
            <Fab color="primary" onClick={handleClick} ref={fabRef}>
                <AddIcon />
            </Fab>
            <Popover
                id={id}
                open={open}
                anchorEl={anchorEl}
                onClose={handleClose}
                anchorOrigin={{
                    vertical: 'top', // верх кнопки
                    horizontal: 'center',
                }}
                transformOrigin={{
                    vertical: 'bottom', // низ поповера привязан к верх кнопки
                    horizontal: 'center',
                }}
                PaperProps={{
                    sx: { mt: -8 }, // поднимаем над кнопкой, можно подогнать под размер FAB
                }}
            >
                <Typography sx={{ p: 2 }}>The content of the Popover.</Typography>
            </Popover>
        </Box>

    )
}