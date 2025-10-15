import { Box, Button, Fab, Modal, Popover, SpeedDial, SpeedDialAction, Typography } from "@mui/material";
import SpeedDialIcon from '@mui/material/SpeedDialIcon';
import { useRef, useState } from "react";
import AddIcon from '@mui/icons-material/Add';
import { useAppDispatch, useAppSelector } from "@/state/hook";
import { newIngredient } from "@/state/slices/list-form";
import { ContainerIngredient } from "./ContainerIngredient";



export function AddNewIngredient() {
    const [open, setOpen] = useState(false);
    const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);
    const fabRef = useRef<HTMLButtonElement>(null);
    const ingredientsForm = useAppSelector(state => state.newListIngredient.ingredients)
    const dispatch = useAppDispatch()

    const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        setAnchorEl(event.currentTarget);
        setOpen((prev) => !prev);
    };

    const handleClose = () => setOpen(false);

    // const open = Boolean(anchorEl);

    function handleNewIngredient(){
        dispatch(newIngredient())
    }

    return (
        <Box sx={{ position: 'absolute', right: '28px', bottom: '10px' }}>
            <Fab color="primary" onClick={handleClick} ref={fabRef}>
                <AddIcon />
            </Fab>
            <Popover
                id={open ? 'simple-popover' : undefined}
                open={true}//open
                anchorEl={anchorEl}
                onClose={handleClose}
                anchorOrigin={{
                    vertical: 'top',
                    horizontal: 'left',
                }}
                transformOrigin={{
                    vertical: 'bottom',
                    horizontal: 'left',
                }}
                slotProps={{
                    paper: {
                        sx: {
                            display:'flex',
                            flexDirection:'column',
                            alignItems:'center',
                            width:'600px',
                            // overflow:'auto'
                        },
                    },
                }}  
            >
                <Box sx={{
                    // maxWidth:'400px',
                    width:'100%',
                    // height:'100%',
                    // maxHeight:'1000px',
                    bgcolor:'background.paper',
                    p:'20px 10px'
                }}>
                    {ingredientsForm.map(el =>(
                        <ContainerIngredient 
                            key={el.ingredient_id}
                            ingredient_id={el.ingredient_id} 
                            length={ingredientsForm.length}
                        >
                        </ContainerIngredient>
                    ))}
                    
                </Box>

                <Button 
                    color="blackRedBtn" 
                    onClick={handleNewIngredient}
                    sx={{mb:'20px'}}
                >Add ingredient</Button>
            </Popover>
        </Box>

    )
}