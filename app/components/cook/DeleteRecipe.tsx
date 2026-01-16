import { Box, Button, Dialog, DialogActions, DialogTitle } from "@mui/material";
import { useState } from "react";



export function DeleteRecipe() {
    const [confirmed, setConfirmed] = useState<boolean>(false)
    const [open, setOpen] = useState<boolean>(false);

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = (res:boolean) => {
        console.log(res)
        setConfirmed(res)
        setOpen(false);
    };


    console.log(confirmed)
    return (
        <Box sx={{ m: '30px 0 5px' }}>
            <Button color='blackRedBtn'
                sx={{ m: '0 auto', display: 'block', maxWidth: '180px', width: '100%', lineHeight: '18px', }}
                onClick={handleClickOpen}
            >
                Delete Recipe
            </Button>

            <Dialog
                open={open}
                onClose={(e) => handleClose(false)}
                aria-labelledby="delete-recipe-dialog"
                aria-describedby="alert-dialog-description"
                disableRestoreFocus
            >
                <DialogTitle id="delete-recipe-dialog">
                    {"Are you sure you want to delete this recipe?"}
                </DialogTitle>
                {/* <DialogContent>
                    <DialogContentText id="alert-dialog-description">
                        Let Google help apps determine location. This means sending anonymous
                        location data to Google, even when no apps are running.
                    </DialogContentText>
                </DialogContent> */}
                <DialogActions sx={{p:'8px 18px 18px'}}>
                    <Button color="blackBtn" onClick={(e) => handleClose(false)}>Disagree</Button>
                    <Button color="blackBtn" onClick={(e) => handleClose(true)} autoFocus>
                        Agree
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    )
}