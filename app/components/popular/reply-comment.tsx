import { Avatar, Box, Button, ListItem, ListItemAvatar, ListItemText, Typography } from "@mui/material"
import FavoriteIcon from '@mui/icons-material/Favorite';
import { LikeT } from "./main-comments";
import { memo, } from "react";
import { useAppDispatch, useAppSelector } from "@/state/hook";
import ArrowRightIcon from '@mui/icons-material/ArrowRight';
import { setActiveComment } from "@/state/slices/comments-context";
import numbro from "numbro";
import { theme } from "@/config/ThemeMUI/theme";
import { avatarReply, containerPrimaryReplyText, dataReply, fullTextReply, likesReply, replyContainer, replyReplyBtn } from "@/app/(main)/popular/style";



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

    function formatCount (value: number): string  {
        if (!value) return '';
        if (value < 1000) return String(Math.floor(value));
        return numbro(value).format({
            average: true,
            mantissa: 2,
            trimMantissa: true,
            spaceSeparated: false,
        });
    };

    console.log('replies',)
    return (
        <ListItem sx={(theme) => replyContainer(theme, isActive)}>
            <Box sx={{display:'flex', alignItems:'center', width:'100%', p:'0px'}}>
                <ListItemAvatar sx={{minWidth:"0", mr:"10px"}}>
                    <Avatar alt={author_name} src={author_avatar } sx={avatarReply}/>
                </ListItemAvatar>
                <ListItemText
                    sx={fullTextReply}
                    primary={
                        <Box sx={containerPrimaryReplyText}>
                            <Box
                              component="span"
                              sx={{
                                minWidth: 0,
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                                whiteSpace: 'nowrap',
                              }}
                            >
                              {author_name}
                            </Box>
                          
                            {id_parent === id_branch ? null : (
                              <>
                                <ArrowRightIcon sx={{ flexShrink: 0, [theme.breakpoints.down('md')]:{width:"20px", height:'20px'} }} />
                          
                                <Box
                                  component="span"
                                  sx={{
                                    minWidth: 0,
                                    overflow: 'hidden',
                                    textOverflow: 'ellipsis',
                                    whiteSpace: 'nowrap',
                                  }}
                                >
                                  {name_parent}
                                </Box>
                              </>
                            )}
                          </Box>
                    }
                    secondary={
                        <>
                            {text}
                        </>
                    }
                />
            </Box>



            <Box sx={{ width: '100%', justifyContent: 'space-between', display: 'flex', mt: '7px' }}>
                <Button
                    onClick={handleReply}
                    sx={(theme) => replyReplyBtn(theme, isActive)}>
                    reply
                </Button>
               
                <Typography sx={dataReply}>{createdAt}</Typography>
                <Button sx={likesReply}
                    onClick={() => likeT()}
                >
                    {formatCount(Number(likes_count))}
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



ReplyComment.displayName = "ReplyComment"