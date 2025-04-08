import { Avatar, Box, Button, ListItemAvatar, ListItemText, Typography } from "@mui/material"
import FavoriteIcon from '@mui/icons-material/Favorite';
import { LikeT } from "./main-comments";
import { memo, useMemo } from "react";
import { ReplyCommData } from "@/app/types/types";
import { useAppSelector } from "@/state/hook";




interface dataProps {
    id_comment_p:string,
    id_branch_p:string,
    handleLike: (params: LikeT) => void
    config_id:string,
    handleReply:(id_branch:string, id_comment: string, author_name: string) => void
}
export const ReplyComment = memo(({ id_comment_p, id_branch_p, handleLike, config_id, handleReply }:dataProps ) => {
    const reply = useAppSelector(state => state.comments.replies[id_branch_p]?.entities[id_comment_p]);
    
    const {
        author_avatar,
        author_name,
        text,
        createdAt,
        name_parent,
        id_comment,
        liked,
        likes_count,
        id_parent,
        id_branch,
    } = reply;

    function likeT(){
        handleLike({id_comment, config_id:config_id, liked, reply:true, id_branch })
    }
    
    console.log('replies',)
    return (
        <>
            <ListItemAvatar>
                <Avatar alt={author_name} src={author_avatar} />
            </ListItemAvatar>
            <ListItemText
                sx={{ '& .MuiTypography-root ': { maxWidth: '513px' } }}
                primary={`${author_name} replyed ${name_parent}`}
                secondary={
                    <>
                        {text}
                    </>
                }
            />
            <Typography sx={{ fontSize: '14px', color: 'text.disabled', mt: '7px' }}>{createdAt}</Typography>


            <Box sx={{ width: '100%', justifyContent: 'space-between', display: 'flex', mt: '7px' }}>
                <Button
                    onClick={() => handleReply(id_branch, id_comment, author_name)}
                    sx={{
                        p: '0',
                        '&:hover': { backgroundColor: "transparent", color: 'primary.main' },
                        fontSize: "14px",
                        textTransform: 'initial',
                        minWidth: "0",
                        color: 'text.secondary'
                    }}>reply</Button>
                {/* <Button sx={{
                    p: '0',
                    '&:hover': { backgroundColor: "transparent", color: 'primary.main' },
                    fontSize: "14px",
                    textTransform: 'initial',
                    minWidth: "0",
                    color: 'text.secondary'
                }}>{el.answer_count} replies</Button> */}

                <Button sx={{
                    p: '0',
                    '&:hover': { backgroundColor: "transparent", color: 'primary.main' },
                    fontSize: "14px",
                    textTransform: 'initial',
                    minWidth: "0",
                    color: 'text.secondary'
                }}
                onClick={() => likeT()}
                >
                    {likes_count}
                    <FavoriteIcon sx={{ fontSize: "16px", m:'0 0 3px 3px', color:liked ? "primary.main" : "inherit"  }}></FavoriteIcon>
                </Button>
            </Box>
        </>
    )
}, (prevProps, nextProps) => {
    return prevProps.id_comment_p === nextProps.id_comment_p &&
        prevProps.id_branch_p === nextProps.id_branch_p &&
        prevProps.config_id === nextProps.config_id
})

