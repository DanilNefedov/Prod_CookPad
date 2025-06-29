import { Box, Button, TextField } from "@mui/material";
import SendIcon from '@mui/icons-material/Send';
import { memo, useState } from "react";
import { inputComment } from "@/app/(main)/popular/style";
import { useAppSelector } from "@/state/hook";





interface Props {
    sendComm: (text: string) => void
}
export const InputComment = memo(({ sendComm }: Props) => {
    const statusNewReplyComm = useAppSelector(state => state.comments.operations.newReplyComm.loading)
    const statusNewCommPopular = useAppSelector(state => state.comments.operations.newCommPopular.loading)
    const [comm, setComm] = useState<string>('')


    const handleSend = () => {
        if(statusNewCommPopular || statusNewReplyComm) return

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
                onKeyDown={(e) => {
                    if(statusNewCommPopular || statusNewReplyComm) return

                    if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault(); 
                        handleSend();
                    }
                }}
            />
            <Button disabled={statusNewCommPopular || statusNewReplyComm} onClick={handleSend} sx={{ position: 'absolute', right: '15px', top: 'calc(50% - 19px)', minWidth: '0' }}>
                <SendIcon />
            </Button>
        </Box>
    )
})

InputComment.displayName = 'InputComment';