import { Avatar, Box, Button, ListItem, ListItemAvatar, ListItemText, Typography } from "@mui/material"
import FavoriteIcon from '@mui/icons-material/Favorite';
import { LikeT } from "./main-comments";
import { memo, useMemo, useState } from "react";
import { ReplyCommData } from "@/app/types/types";
import { useAppDispatch, useAppSelector } from "@/state/hook";
import ArrowRightIcon from '@mui/icons-material/ArrowRight';
import { setActiveComment } from "@/state/slices/comments-context";



interface dataProps {
    id_comment_p: string,
    id_branch_p: string,
    handleLike: (params: LikeT) => void
    config_id: string,
}
export const ReplyComment = memo(({ id_comment_p, id_branch_p, handleLike, config_id,}: dataProps) => {
    const reply = useAppSelector(state => state.comments.replies[id_branch_p]?.entities[id_comment_p]);
    const dispatch = useAppDispatch()
    
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

    const isActive = useAppSelector(
        state => state.commentContext.comment.id_comment === id_comment
    );  
   

    function likeT() {
        handleLike({ id_comment, config_id: config_id, liked, reply: true, id_branch })
    }

    function handleReply(){
        dispatch(setActiveComment(
            isActive ? {id_comment:'', author_name:'',id_branch:'' }
            :
            {id_comment:id_comment, author_name:author_name, id_branch:id_branch_p }
        ))
    }

    console.log('replies',3333,)
    return (
        <ListItem sx={{
            bgcolor: 'background.paper',
            borderRadius: '10px',
            m: '10px 0 ',
            ml: "auto",
            flexWrap: "wrap",
            border: '1px solid transparent',
            maxWidth: "90%",
            lignItems: "flex-start",
            borderColor: isActive ? 'text.secondary' : 'transparent',
            '&:last-child': {
                mb: '0px'
            }
        }}>
            <Box sx={{display:'flex', justifyContent:'space-between', alignItems:'center', width:'100%', p:'7px 0'}}>
                <ListItemAvatar>
                    <Avatar alt={author_name} src={author_avatar} />
                </ListItemAvatar>
                <ListItemText
                    sx={{ m: "0", '& .MuiTypography-root ': { maxWidth: '513px', color: 'text.primary', fontSize: '16px' } }}
                    primary={
                        <Box sx={{ display: 'flex', alignItems: 'center', mb:"5px" }}>{author_name}{id_parent === id_branch ? '' : <><ArrowRightIcon /> <span>{name_parent}</span></>}</Box>
                        // `${author_name} ${id_parent === id_branch ? '' : <ArrowRightIcon/>+name_parent}`
                    }
                    secondary={
                        <>
                            {text}
                        </>
                    }
                />
                <Typography sx={{ fontSize: '14px', color: 'text.disabled', alignSelf: 'flex-start', }}>{createdAt}</Typography>
            </Box>



            <Box sx={{ width: '100%', justifyContent: 'space-between', display: 'flex', mt: '7px' }}>
                <Button
                    onClick={handleReply}
                    sx={{
                        p: '0',
                        '&:hover': { backgroundColor: "transparent", color: 'text.primary' },
                        fontSize: "14px",
                        textTransform: 'initial',
                        minWidth: "0",
                        color: isActive ? 'primary.main' : 'text.secondary'
                    }}>reply</Button>
               

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
                    <FavoriteIcon sx={{ fontSize: "16px", m: '0 0 3px 3px', color: liked ? "primary.main" : "inherit" }}></FavoriteIcon>
                </Button>
            </Box>
        </ListItem>
    )
}, (prevProps, nextProps) => {

    return prevProps.id_comment_p === nextProps.id_comment_p &&
        prevProps.id_branch_p === nextProps.id_branch_p &&
        prevProps.config_id === nextProps.config_id 
        
})

