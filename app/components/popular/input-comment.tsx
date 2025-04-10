import { Box, Button, TextField } from "@mui/material";
import SendIcon from '@mui/icons-material/Send';
import { Dispatch, memo, SetStateAction, useState } from "react";





interface DataProps{
    sendComm: (text:string) => void
}
export const InputComment = memo(({sendComm}: DataProps) => {
    const [comm, setComm] = useState<string>('')
    
    console.log('input')

    const handleSend = () => {
        sendComm(comm);
        setComm('')
    };

    return (
        <Box sx={{ position: 'relative', marginTop: "10px" }}>
            <TextField
                sx={{
                    bgcolor: 'background.paper',
                    width: '100%',
                    overflow: 'hidden',
                    '& .MuiInputBase-root': {
                        p: '9px 52px 9px 7px',
                        "&:after": {
                            border: "transparent"
                        }
                    },
                    borderRadius: '10px',
                }}
                id="filled-multiline-flexible"
                multiline
                maxRows={2}
                variant="filled"
                value={comm}
                onChange={(e) => setComm(e.target.value)}
            />
            <Button onClick={handleSend} sx={{ position: 'absolute', right: '15px', top: 'calc(50% - 19px)', minWidth: '0' }}>
                <SendIcon />
            </Button>
        </Box>
    )
})