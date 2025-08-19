import { Avatar, Box, Button, List, ListItem, ListItemAvatar, ListItemText, Typography } from "@mui/material"
import FavoriteIcon from '@mui/icons-material/Favorite';
import { useAppDispatch, useAppSelector } from "@/state/hook";
import { memo, useCallback, useEffect, useRef, useState } from "react";
import { getReplies, likedComment } from "@/state/slices/comments-popular-slice";
import { ReplyComment } from "./ReplyComment";
import { setActiveComment } from "@/state/slices/comments-context";
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import numbro from "numbro";
import { avatar, avatarContainer, commentsWrapper, commentTime, containerAvatarComment, 
    containerCommentItem, containerSecondBlockComm, iconReplyBtn, likeComm, likeIcon, 
    loaderReplyBox, moreHideBox, moreHideBtns, repliesOpen, replyBox, replyComm, 
    textComment } from "@/app/(main)/popular/styles";
import { usePingGate } from "@/app/hooks/ping";
import { UXLoading } from "../ui-helpers/UXLoading";
import { Like } from "@/app/(main)/popular/types";
import { betweenCenter } from "@/app/styles";




interface Props {
    id_comment: string,
    config_id: string,
    newReply: string[],
}



export const CommentsItem = memo(({ id_comment, config_id, newReply,}: Props) => {

    const isActive = useAppSelector(
        state => state.commentContext.comment.id_comment === id_comment
    );    
    const commentsData = useAppSelector(state => state.comments.comments[config_id].entities[id_comment])
    const [openReply, setOpenReply] = useState<string>('')
    const repliesData = useAppSelector(state => state.comments.replies[id_comment])
    const userData = useAppSelector(state => state.user)
    const connection_id = userData?.user?.connection_id
    const dispatch = useAppDispatch()
    const localLikeLoadingRef = useRef(false);
    const prevLengthRef = useRef<number>(repliesData?.ids?.length || 0)
    const pingGate = usePingGate()
    const [statusReply, setStatusReply] = useState<'all' | 'more' | ''>('')


    useEffect(() => {
        const currentLength = repliesData?.ids?.length || 0
        const prevLength = prevLengthRef.current

        if (currentLength > prevLength) {
            setOpenReply(id_comment)
        }

        prevLengthRef.current = currentLength
    }, [repliesData?.ids?.length, id_comment])




    function handleReplies({ id_comment, more }: { id_comment: string, more: boolean }) {
        if (connection_id !== '') {
            setStatusReply(more ? 'more' : 'all')
            if (repliesData && repliesData.ids.length > 0 && !more) {
                setOpenReply(id_comment)
                setStatusReply('')

            } else {
                const nextPage = repliesData && !Number.isNaN(repliesData.page) ? repliesData.page + 1 : 1;
                setOpenReply(id_comment)
                // openReplyCur = id_comment
                pingGate(() => {
                    dispatch(getReplies({
                        id_comment,
                        page: nextPage,
                        id_author: connection_id,
                        newReply
                    })).finally(() => {
                        setStatusReply('')
                    });
                });
            }
        }

    }
    const handleLike = useCallback(({ id_comment, config_id, liked, reply, id_branch }: Like) => {
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
            ).finally(() => {
                localLikeLoadingRef.current = false;
            });
        }
    }, [connection_id, dispatch]);
    

    function formatCount (value: number): string  {
        if (!value) return '';
        if (value < 1000) return value.toString();
        return numbro(value).format({
            average: true,
            mantissa: 2,
            trimMantissa: true,
            spaceSeparated: false,
        });
    };


    return (
        <ListItem sx={commentsWrapper}>
            <Box sx={[containerCommentItem, {borderColor: isActive ? 'text.secondary' : 'transparent'}]}>

                <Box sx={[containerAvatarComment, betweenCenter]}>
                    <ListItemAvatar sx={avatarContainer}>
                        <Avatar alt={commentsData.author_name} src={commentsData.author_avatar } 
                        sx={avatar}></Avatar>
                    </ListItemAvatar>
                    <ListItemText
                        sx={textComment}
                        primary={
                            commentsData.author_name
                        }
                        secondary={
                            <>
                                {commentsData.text}
                            </>
                        }
                    />
                </Box>
                


                <Box sx={containerSecondBlockComm}>
                    
                    <Button
                        onClick={() => {
                            dispatch(setActiveComment(
                                isActive ? 
                                {id_comment: '', author_name: '', id_branch:''}
                                :
                                {id_comment: id_comment, author_name: commentsData.author_name, id_branch:id_comment}
                            ))
                        }}
                        sx={[replyComm, {color: isActive ? 'primary.main' : 'text.disabled'}]}>
                            reply
                    </Button>
                    <Typography sx={commentTime}>{commentsData.createdAt}</Typography>

                    <Button sx={likeComm} 
                        onClick={() => handleLike({ id_comment: commentsData.id_comment, config_id, liked: commentsData.liked, reply: false, id_branch: '' })}
                    >
                        {formatCount(Number(commentsData.likes_count))}
                        <FavoriteIcon sx={[likeIcon, {color: commentsData.liked ? 'primary.main' : 'inherit'}]}></FavoriteIcon>
                    </Button>
                </Box>

                <Box sx={replyBox}>
                    <hr className="leftLine line" />
                    <Button
                        onClick={() => {
                            if ((openReply === '' || openReply !== commentsData.id_comment) && commentsData.reply_count > 0) {
                                handleReplies({ id_comment: commentsData.id_comment, more: false })

                            }

                            if (openReply === commentsData.id_comment) {
                                setOpenReply('')
                            }
                        }}
                        sx={(theme) => repliesOpen(theme, commentsData.reply_count > 0, openReply === commentsData.id_comment)}>
                            { commentsData.reply_count === 0 ? 0 : formatCount(Number(commentsData.reply_count)) } replies 
                            <KeyboardArrowDownIcon sx={[iconReplyBtn, {
                                transform: openReply === commentsData.id_comment ? 'rotate(180deg)' : 'rotate(0deg)',
                            }]}></KeyboardArrowDownIcon>
                    </Button>
                    <hr className="rightLine line"/>
                </Box>
                
            </Box>
            <List sx={{display:openReply === commentsData.id_comment ? 'block' : 'none'}}>
                {openReply === commentsData.id_comment ? (
                    statusReply === "all" ? (
                        <Box sx={loaderReplyBox}>
                            <UXLoading position="static"/>
                        </Box>
                        
                    ) : (
                        <>
                            {(repliesData?.ids ?? []).map(replyId => {
                                const reply = repliesData?.entities[replyId];
                                return (
                                    <ReplyComment
                                        key={reply.id_comment}
                                        id_comment_p={reply.id_comment}
                                        id_branch_p={id_comment}
                                        handleLike={handleLike}
                                        config_id={config_id}
                                    />
                                );
                            })}
                            {statusReply === "more" && <UXLoading position="static"/>}
                        </>
                    )
                ) : null}
            </List>

            {
                openReply === commentsData.id_comment && repliesData?.ids && repliesData?.ids.length > 0 ?
                    <Box sx={moreHideBox}>
                        <Button
                            disabled={Number.isNaN(repliesData?.page)}
                            sx={[moreHideBtns, {mr: '25px'}]}
                            onClick={() => handleReplies({ id_comment: commentsData.id_comment, more: true })}
                        >more</Button>
                        <Button sx={moreHideBtns}
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
        
})

CommentsItem.displayName = "CommentsItem"