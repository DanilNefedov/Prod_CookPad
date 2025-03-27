import { replyCommData } from "@/app/types/types"
import { Avatar, Box, Button, ListItemAvatar, ListItemText, Typography } from "@mui/material"
import FavoriteIcon from '@mui/icons-material/Favorite';
import { LikeT } from "./comments";
import { memo, useMemo } from "react";




interface dataProps {
    elem:replyCommData,
    id_branch:string,
    handleLike: (params: LikeT) => void
    config_id:string,
    handleReply:(id_branch:string, id_comment: string, author_name: string) => void
}
export const ReplyComment = memo( ({ props }: { props: dataProps }) => {
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
    } = props.elem;



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
                    onClick={() => props.handleReply(id_branch, id_comment, author_name)}
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
                onClick={() => props.handleLike({id_comment, config_id:props.config_id, liked, reply:true, id_branch })}
                >
                    {likes_count}
                    <FavoriteIcon sx={{ fontSize: "16px", m:'0 0 3px 3px', color:liked ? "primary.main" : "inherit"  }}></FavoriteIcon>
                </Button>
            </Box>
        </>
    )
})

