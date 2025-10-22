import { Box, Fab, Fade, Popover, Typography, Zoom } from "@mui/material";
import { useRef, useState } from "react";
import AddIcon from '@mui/icons-material/Add';
import { useAppSelector } from "@/state/hook";
import { ContainerIngredient } from "./ContainerIngredient";
import { MainButtons } from "./MainButtons";
import { containerCreationIngr, fabCreating, fabIcon, mainBoxCreating, popoverCreating } from "@/app/(main)/(main-list)/list/styles";
import CloseIcon from '@mui/icons-material/Close';


export function AddNewIngredient() {
    const [open, setOpen] = useState(false);
    const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);
    const fabRef = useRef<HTMLButtonElement>(null);
    const ingredientsForm = useAppSelector(state => state.newListIngredient.ingredients)

    const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        setAnchorEl(event.currentTarget);
        setOpen((prev) => !prev);
    };

    const handleClose = () => setOpen(false);


    return (
        <Box sx={mainBoxCreating}>
            <Fab 
                color="primary" 
                onClick={handleClick} 
                ref={fabRef}
                sx={fabCreating}
            >
                <Zoom in={!open} timeout={300}>
                    <AddIcon sx={fabIcon}/>
                </Zoom >
                <Zoom in={open} timeout={300}>
                    <CloseIcon sx={fabIcon}/>
                </Zoom >
            </Fab>
            <Popover
                id={open ? 'simple-popover' : undefined}
                open={open}//open
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
                        sx: popoverCreating,
                    },
                }}   
            >
                <Typography sx={{mt:'20px'}}>At least 1 ingredient completely filled</Typography>

                <Box sx={containerCreationIngr}>
                    {ingredientsForm.map(el =>(
                        <ContainerIngredient 
                            key={el.ingredient_id}
                            ingredient_id={el.ingredient_id} 
                            length={ingredientsForm.length}
                        >
                        </ContainerIngredient>
                    ))}
                    
                </Box>

                <MainButtons></MainButtons>

            </Popover>
        </Box>

    )
}