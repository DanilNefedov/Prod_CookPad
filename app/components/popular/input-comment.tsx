import { Box, Button, TextField } from "@mui/material";
import SendIcon from '@mui/icons-material/Send';
import { memo, useState } from "react";
import { inputComment } from "@/app/(main)/popular/style";





interface DataProps {
    sendComm: (text: string) => void
}
export const InputComment = memo(({ sendComm }: DataProps) => {
    const [comm, setComm] = useState<string>('')

    console.log('input')

    const handleSend = () => {
        if (comm.trim() !== '') {
            sendComm(comm);
            setComm('')
        }

    };

    return (
        <Box sx={{ position: 'relative', marginTop: "10px" }}>
            <TextField
                sx={inputComment}
                placeholder="Type in a comment"
                id="filled-multiline-flexible"
                multiline
                maxRows={2}
                variant="filled"
                value={comm}
                onChange={(e) => {
                    if (e.target.value.length <= 500) {
                        setComm(e.target.value);
                    }
                }}
            />
            <Button onClick={handleSend} sx={{ position: 'absolute', right: '15px', top: 'calc(50% - 19px)', minWidth: '0' }}>
                <SendIcon />
            </Button>
        </Box>
    )
})

InputComment.displayName = 'InputComment';