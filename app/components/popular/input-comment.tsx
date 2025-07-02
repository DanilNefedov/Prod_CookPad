import { Box, Button, TextField } from "@mui/material";
import SendIcon from '@mui/icons-material/Send';
import { memo, useState } from "react";
import { inputComment } from "@/app/(main)/popular/style";
import { useAppSelector } from "@/state/hook";





interface Props {
    sendComment: (text: string) => void
}
export const InputComment = memo(({ sendComment }: Props) => {
    const isReplyLoading = useAppSelector(state => state.comments.operations.newReplyComm.loading);
    const isCommentLoading = useAppSelector(state => state.comments.operations.newCommPopular.loading);

    const [commentText, setCommentText] = useState<string>('');


    const handleSend = () => {
        if(isReplyLoading || isCommentLoading) return

        if (commentText.trim() !== '') {
            sendComment(commentText);
            setCommentText('')
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
                value={commentText}
                onChange={(e) => {
                    if (e.target.value.length <= 500) {
                        setCommentText(e.target.value);
                    }
                }}
                onKeyDown={(e) => {
                    if(isReplyLoading || isCommentLoading) return

                    if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault(); 
                        handleSend();
                    }
                }}
            />
            <Button disabled={isReplyLoading || isCommentLoading} onClick={handleSend} sx={{ position: 'absolute', right: '15px', top: 'calc(50% - 19px)', minWidth: '0' }}>
                <SendIcon />
            </Button>
        </Box>
    )
})

InputComment.displayName = 'InputComment';