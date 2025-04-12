import { Avatar, Box, Button, List, ListItem, ListItemAvatar, ListItemText, Typography } from "@mui/material"
import FavoriteIcon from '@mui/icons-material/Favorite';
import { useAppDispatch, useAppSelector } from "@/state/hook";
import { memo, useCallback, useEffect, useRef, useState } from "react";
import { getReplies, likedComment } from "@/state/slices/comments-popular-slice";
import { LikeT } from "./main-comments";
import { ReplyComment } from "./reply-comment";




interface DataProps {
    id_comment: string,
    config_id: string,
    newReply: string[],
    handleReply: (id_branch: string, id_comment: string, author_name: string) => void,
    // isOpen:string
    // mainOpen: (arg: string) => void
}




export const CommentsItem = memo(({ id_comment, config_id, newReply, handleReply, }: DataProps) => {
    const commentsData = useAppSelector(state => state.comments.comments.entities[id_comment])
    const [openReply, setOpenReply] = useState<string>('')
    const repliesData = useAppSelector(state => state.comments.replies[id_comment])
    const userData = useAppSelector(state => state.user)
    const connection_id = userData?.user?.connection_id
    const dispatch = useAppDispatch()
    const localLikeLoadingRef = useRef(false);
    const [activeRep, setActiveRep] = useState<string>('')

    const prevLengthRef = useRef<number>(repliesData?.ids?.length || 0)

    useEffect(() => {
        const currentLength = repliesData?.ids?.length || 0
        const prevLength = prevLengthRef.current

        if (currentLength > prevLength) {
            setOpenReply(id_comment)
        }

        prevLengthRef.current = currentLength
    }, [repliesData?.ids?.length, id_comment])



    function openReplyT() {
        setActiveRep(commentsData.id_comment)
        handleReply(commentsData.id_comment, commentsData.id_comment, commentsData.author_name);
    }


    function handleReplies({ id_comment, more }: { id_comment: string, more: boolean }) {
        if (connection_id !== '') {
            if (repliesData && repliesData.ids.length > 0 && !more) {
                setOpenReply(id_comment)

            } else {
                const nextPage = repliesData && !Number.isNaN(repliesData.page) ? repliesData.page + 1 : 1;
                setOpenReply(id_comment)
                // openReplyCur = id_comment
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



    console.log('comm-item', openReply, '222')
    return (
        <ListItem sx={{ mb: '10px', p: 0, display: 'block' }}>
            <Box alignItems="flex-start" sx={{
                bgcolor: 'background.paper',
                borderRadius: '10px',
                p: '8px 16px',
                width: "100%",
                display: 'flex',
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
                                handleReplies({ id_comment: commentsData.id_comment, more: false })

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
                        onClick={() => handleLike({ id_comment: commentsData.id_comment, config_id, liked: commentsData.liked, reply: false, id_branch: '' })}
                    >
                        {commentsData.likes_count}
                        <FavoriteIcon sx={{ fontSize: "16px", m: '0 0 3px 3px', color: commentsData.liked ? 'primary.main' : 'inherit' }}></FavoriteIcon>
                    </Button>
                </Box>
            </Box>
            <List sx={{display:openReply === commentsData.id_comment ? 'block' : 'none'}}>
                {openReply === commentsData.id_comment ? (repliesData?.ids ?? []).map(replyId => {
                    const reply = repliesData?.entities[replyId];

                    return (
                        <ListItem key={reply.id_comment} sx={{
                            bgcolor: 'background.paper',
                            borderRadius: '10px',
                            m: '10px 0 ',
                            ml: "auto",
                            flexWrap: "wrap",
                            border: '1px solid transparent',
                            maxWidth: "90%",
                            lignItems: "flex-start",
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
            </List>

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
                            onClick={() => handleReplies({ id_comment: commentsData.id_comment, more: true })}
                        >more</Button>
                        <Button sx={{
                            p: '0',
                            '&:hover': { backgroundColor: "transparent", color: 'primary.main' },
                            fontSize: "14px",
                            textTransform: 'initial',
                            minWidth: "0",
                            color: 'text.secondary'
                        }}
                            onClick={() => {
                                if (openReply === commentsData.id_comment) {
                                    setOpenReply('')
                                }
                            }}
                        >hide</Button>
                    </Box>
                    :
                    <></>
            }

        </ListItem>
    )
}, (prevProps, nextProps) => {
    return prevProps.id_comment === nextProps.id_comment &&
        prevProps.config_id === nextProps.config_id
    // prevProps.isOpen === nextProps.isOpen
})