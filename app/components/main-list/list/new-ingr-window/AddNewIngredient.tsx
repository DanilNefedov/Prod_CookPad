import { Box, Fab, Popover, Typography } from "@mui/material";
import { useRef, useState } from "react";
import AddIcon from '@mui/icons-material/Add';
import { useAppSelector } from "@/state/hook";
import { ContainerIngredient } from "./ContainerIngredient";
import { MainButtons } from "./MainButtons";
import { theme } from "@/config/ThemeMUI/theme";



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

    // const open = Boolean(anchorEl);


    return (
        <Box sx={{ position: 'absolute', right: '28px', bottom: '10px' }}>
            <Fab color="primary" onClick={handleClick} ref={fabRef}
            sx={{
                [theme.breakpoints.down(600)]: { 
                    width:"37px",
                    height:'33px'
                }
            }}>
                <AddIcon />
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
                <Typography sx={{mt:'20px'}}>At least 1 ingredient completely filled</Typography>

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

                <MainButtons></MainButtons>

            </Popover>
        </Box>

    )
}