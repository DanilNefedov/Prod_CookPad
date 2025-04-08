import { Avatar, Box, Button, ListItem, ListItemAvatar, ListItemText, Typography } from "@mui/material"
import FavoriteIcon from '@mui/icons-material/Favorite';
import { useAppDispatch, useAppSelector } from "@/state/hook";
import { memo, useCallback, useRef, useState } from "react";
import { getReplies, likedComment } from "@/state/slices/comments-popular-slice";
import { LikeT } from "./main-comments";
import { ReplyComment } from "./reply-comment";




interface DataProps {
    id_comment:string, 
    config_id:string,
    newReply:string[],
    handleReply: (id_branch: string, id_comment: string, author_name: string) => void
}




export const CommentsItem = memo(({id_comment, config_id, newReply, handleReply}: DataProps) => {
    const commentsData = useAppSelector(state => state.comments.comments.entities[id_comment])
    const [openReply, setOpenReply] = useState<string>('')
    const repliesData = useAppSelector(state => state.comments.replies[id_comment])
    const userData = useAppSelector(state => state.user)
    const connection_id = userData?.user?.connection_id
    const dispatch = useAppDispatch()
    const localLikeLoadingRef = useRef(false);

    const [activeRep, setActiveRep] = useState<string>('')

    // const comment = commentsData.entities[id_comment];

    function openReplyT () {
        setActiveRep(commentsData.id_comment)
        handleReply(commentsData.id_comment, commentsData.id_comment, commentsData.author_name);
    }

    // const handleReply = useCallback((id_branch: string, id_comment: string, author_name: string) => {
    //     setInfoReply((prev) =>
    //         prev.id_comment === id_comment
    //             ? { id_comment: "", author_name: "", id_branch: "" }
    //             : { id_branch, id_comment, author_name }
    //     );
    // }, []);

    function handleReplies(id_comment: string) {
        const replyData = repliesData;

        if (replyData && replyData.ids.length > 0) {
            setOpenReply(id_comment)
        }

        if (connection_id !== '') {

            // const comment = commentsData.entities[id_comment];
            // commentsData

            // if (comment) {
            if (commentsData.id_comment === id_comment) {
                const nextPage = replyData && !Number.isNaN(replyData.page) ? replyData.page + 1 : 1;
                setOpenReply(id_comment)
                dispatch(getReplies({
                    id_comment,
                    page: nextPage,
                    id_author: connection_id,
                    newReply
                }));
            }
        }
    
    }
    const handleLike = useCallback(({ id_comment, config_id, liked, reply, id_branch }: LikeT) => {
        // let localLikeLoadingRef = false;
        if (connection_id !== "" && liked !== undefined && !localLikeLoadingRef.current) {
            localLikeLoadingRef.current = true;
            dispatch(
                likedComment({
                    id_author: connection_id,
                    id_comment,
                    config_id,
                    liked,
                    reply,
                    id_branch
                    // id_branch: id_branch ?? "",
                })
            )
            .finally(() => {
                localLikeLoadingRef.current = false;
            });
        }
    }, [connection_id, dispatch]);

    console.log('comm-item',activeRep)
    return (
        <Box key={commentsData.id_comment} sx={{ mb: '10px' }}>
            <ListItem alignItems="flex-start" sx={{
                bgcolor: 'background.paper',
                borderRadius: '10px',

                flexWrap: "wrap",
                border: '1px solid transparent',
                borderColor: activeRep === commentsData.id_comment ? 'text.secondary' : 'transparent',
                '&:last-child': {
                    mb: '0'
                }
            }}>

                <ListItemAvatar>
                    <Avatar alt="Remy Sharp" src={commentsData.author_avatar} />
                </ListItemAvatar>
                <ListItemText
                    sx={{ '& .MuiTypography-root ': { maxWidth: '513px' } }}
                    primary={commentsData.author_name}
                    secondary={
                        <>
                            {commentsData.text}
                        </>
                    }
                />
                <Typography sx={{ fontSize: '14px', color: 'text.disabled', mt: '7px' }}>{commentsData.createdAt}</Typography>


                <Box sx={{ width: '100%', justifyContent: 'space-between', display: 'flex', mt: '7px' }}>
                    <Button
                        onClick={openReplyT}
                        sx={{
                            p: '0',
                            '&:hover': { backgroundColor: "transparent", color: 'primary.main' },
                            fontSize: "14px",
                            textTransform: 'initial',
                            minWidth: "0",
                            color: activeRep === commentsData.id_comment ? 'primary.main' : 'text.secondary'
                        }}>reply</Button>
                    <Button
                        onClick={() => {
                            if ((openReply === '' || openReply !== commentsData.id_comment) && commentsData.reply_count > 0) {
                                handleReplies(commentsData.id_comment)

                            }
                        }}
                        sx={{
                            p: '0',
                            '&:hover': { backgroundColor: "transparent", color: openReply === commentsData.id_comment ? '#BDBDBD' : 'primary.main' },
                            fontSize: "14px",
                            textTransform: 'initial',
                            cursor: openReply === commentsData.id_comment ? 'auto' : 'pointer',
                            minWidth: "0",
                            color: openReply === commentsData.id_comment ? '#BDBDBD' : 'text.secondary'
                        }}>{commentsData.reply_count} replies</Button>

                    <Button sx={{
                        p: '0',
                        '&:hover': { backgroundColor: "transparent", color: 'primary.main' },
                        fontSize: "14px",
                        textTransform: 'initial',
                        minWidth: "0",
                        color: 'text.secondary',
                        alignItems: 'center',
                        // maxHeight:'20px'
                    }}
                        onClick={() => handleLike({ id_comment: commentsData.id_comment, config_id, liked: commentsData.liked, reply: false, id_branch:'' })}
                    >
                        {commentsData.likes_count}
                        <FavoriteIcon sx={{ fontSize: "16px", m: '0 0 3px 3px', color: commentsData.liked ? 'primary.main' : 'inherit' }}></FavoriteIcon>
                    </Button>
                </Box>
            </ListItem>
            {openReply === commentsData.id_comment ? (repliesData?.ids ?? []).map(replyId => {
                const reply = repliesData?.entities[replyId];

                return (
                    <ListItem key={reply.id_comment} alignItems="flex-start" sx={{
                        bgcolor: 'background.paper',
                        borderRadius: '10px',
                        m: '10px 0 ',
                        ml: "auto",
                        flexWrap: "wrap",
                        border: '1px solid transparent',
                        maxWidth: "90%",
                        // borderColor: infoReply.id_comment === el.id_comment ? 'text.secondary' : 'transparent',
                        '&:last-child': {
                            mb: '20px'
                        }
                    }}>
                        <ReplyComment 
                            id_comment_p={reply.id_comment}
                            id_branch_p={commentsData.id_comment}
                            handleLike={handleLike}
                            config_id={config_id}
                            handleReply={handleReply}
                        >
                        </ReplyComment>
                    </ListItem>

                )
            }) :
                <></>
            }
            {
                openReply === commentsData.id_comment && repliesData?.ids && repliesData?.ids.length > 0 ?
                <Box sx={{ maxWidth: "50%", justifyContent: 'center', m: '0 auto', display: "flex" }}>
                    <Button
                        disabled={Number.isNaN(repliesData?.page)}
                        sx={{
                            p: '0',
                            '&:hover': { backgroundColor: "transparent", color: 'primary.main' },
                            fontSize: "14px",
                            textTransform: 'initial',
                            minWidth: "0",
                            color: 'text.secondary',
                            mr: '25px',

                        }}
                        onClick={() => handleReplies(commentsData.id_comment)}
                    >more</Button>
                    <Button sx={{
                        p: '0',
                        '&:hover': { backgroundColor: "transparent", color: 'primary.main' },
                        fontSize: "14px",
                        textTransform: 'initial',
                        minWidth: "0",
                        color: 'text.secondary'
                    }}
                        onClick={() => setOpenReply('')}
                    >hide</Button>
                </Box>
                :
                <></>
            }

        </Box>
    )
}, (prevProps, nextProps) => {
    return prevProps.id_comment === nextProps.id_comment &&
    prevProps.config_id === nextProps.config_id 
})