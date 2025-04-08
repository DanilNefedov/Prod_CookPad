import { collectionUser } from "@/app/types/types"
import { useAppDispatch, useAppSelector } from "@/state/hook"
import { Avatar, Box, Button, List, ListItem, ListItemAvatar, ListItemText, TextField, Typography } from "@mui/material"
import { memo, useCallback, useEffect, useState } from "react"
import SendIcon from '@mui/icons-material/Send';
import { commVideoFetch, getReplies, likedComment, newCommPopular, newReplyComm } from "@/state/slices/comments-popular-slice";
import FavoriteIcon from '@mui/icons-material/Favorite';
import { v4 as uuidv4 } from 'uuid';
import { ReplyComment } from "./reply-comment";
import InfiniteScroll from 'react-infinite-scroll-component';
import { InputComment } from "./input-comment";
import { CommentsItem } from "./comments-item";



interface dataProps {
    config_id: string,
    activeVideo: number
}

export interface LikeT {
    id_comment: string,
    config_id: string,
    liked: boolean | undefined,
    reply: boolean,
    id_branch: string 
}

// export function Comments({ props }: { props: dataProps }) {
export const MainComments = memo(({ config_id, activeVideo }:  dataProps ) => {

    // const { config_id, activeVideo } = props
    const userData = useAppSelector(state => state.user)
    const connection_id = userData?.user?.connection_id
    const commentsData = useAppSelector(state => state.comments.comments)
    // const repliesData = useAppSelector(state => state.comments.replies)

    // const commentsStatus = useAppSelector(state => state.comments.status)

    // const [localLikeLoading, setLocalLikeLoading] = useState(false);

    // const [comm, setComm] = useState<string>('')
    const [openReply, setOpenReply] = useState<string>('')

    const [newComments, setNewComments] = useState<string[]>([])
    const [newReply, setNewReply] = useState<string[]>([])

    const dispatch = useAppDispatch()

    const [infoReply, setInfoReply] = useState<{ id_comment: string, author_name: string, id_branch: string }>({
        id_comment: '',
        author_name: '',
        id_branch: ''
    })

    useEffect(() => {
        if (config_id && connection_id !== '' && commentsData.ids.length === 0) {
            dispatch(commVideoFetch({ config_id, user_id: connection_id, page: commentsData.page, newComments: [] }))
        }
    }, [config_id, activeVideo]);

    const sendComm = useCallback((text: string) => {
        if (connection_id !== '') {
            if (infoReply.id_comment !== '') {
                const data = {
                    id_comment: uuidv4(),
                    id_branch: openReply === '' ? infoReply.id_comment : openReply,
                    id_author: connection_id,
                    author_avatar: userData?.user.img,
                    author_name: userData?.user.name,
                    id_parent: infoReply.id_comment,
                    name_parent: infoReply.author_name,
                    likes_count: 0,
                    text: text.trim(),
                }
                dispatch(newReplyComm({ data, config_id: config_id }))
                setNewReply([...newComments, data.id_comment])
                // setComm('')
                setOpenReply(openReply === '' ? infoReply.id_comment : openReply)
            } else {
                const data = {
                    id_comment: uuidv4(),
                    id_author: connection_id,
                    author_avatar: userData?.user.img,
                    author_name: userData?.user.name,
                    config_id: config_id,
                    text: text.trim(),
                    likes_count: 0,
                    reply_count: 0,
                }
                setNewComments([...newComments, data.id_comment]);
                dispatch(newCommPopular(data))
                // setComm('')
            }
        }
    }, [connection_id, config_id, dispatch, infoReply, newComments, openReply, userData])

    const handleReply = useCallback((id_branch: string, id_comment: string, author_name: string) => {
        setInfoReply((prev) =>
            prev.id_comment === id_comment
                ? { id_comment: "", author_name: "", id_branch: "" }
                : { id_branch, id_comment, author_name }
        );
    }, []);




    // function handleReplies(id_comment: string) {
    //     const replyData = repliesData[id_comment];

    //     if (replyData && replyData.ids.length > 0) {
    //         setOpenReply(id_comment)
    //     }

    //     if (connection_id !== '') {

    //         const comment = commentsData.entities[id_comment];


    //         if (comment ) {
    //             const nextPage = replyData && !Number.isNaN(replyData.page) ? replyData.page + 1 : 1;
    //             setOpenReply(id_comment)
    //             dispatch(getReplies({
    //                 id_comment,
    //                 page: nextPage,
    //                 id_author: connection_id,
    //                 newReply
    //             }));
    //         }
    //     }

    // }



    // const handleLike = useCallback(({ id_comment, config_id, liked, reply, id_branch }: LikeT) => {
    //     if (connection_id !== "" && liked !== undefined && !localLikeLoading) {
    //         setLocalLikeLoading(true);
    //         dispatch(
    //             likedComment({
    //                 id_author: connection_id,
    //                 id_comment,
    //                 config_id,
    //                 liked,
    //                 reply,
    //                 id_branch
    //                 // id_branch: id_branch ?? "",
    //             })
    //         )
    //         .finally(() => {
    //                 setLocalLikeLoading(false);
    //             });
    //     }
    // }, [connection_id, dispatch, localLikeLoading]);



    const fetchMoreComments = useCallback(() => {
        if (Number.isNaN(commentsData.page)) return;
        dispatch(commVideoFetch({
            config_id,
            user_id: connection_id,
            page: commentsData.page + 1,
            newComments
        }));
    }, [commentsData.page, config_id, connection_id, newComments, dispatch]);

    console.log('main-comments')
    return (
        <Box sx={{ width: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', flexGrow: '1', pt: '20px', overflow: 'auto', }}>


            <List sx={{ overflow: 'auto', scrollbarColor: "#353842 #1F2128", pr: '5px', pb: "0" }} id="scrollableTarget">
                <InfiniteScroll
                    dataLength={commentsData.ids.length}
                    next={fetchMoreComments}
                    hasMore={!Number.isNaN(commentsData.page)}
                    loader={<h4>Loading...</h4>}
                    endMessage={
                        <p style={{ textAlign: 'center' }}>
                            <b>Yay! You have seen it all</b>
                        </p>
                    }
                    scrollableTarget="scrollableTarget"

                >
                    {commentsData.ids.map((id_comment) => {
                        const comment = commentsData.entities[id_comment];
                        return(
                            <CommentsItem key={id_comment} handleReply={handleReply} newReply={newReply} id_comment={comment.id_comment} config_id={config_id}></CommentsItem>
                        )
                    })}
                    {/* 
                        const comment = commentsData.entities[id_comment];

                        return (
                            <Box key={comment.id_comment} sx={{ mb: '10px' }}>
                                <ListItem alignItems="flex-start" sx={{
                                    bgcolor: 'background.paper',
                                    borderRadius: '10px',

                                    flexWrap: "wrap",
                                    border: '1px solid transparent',
                                    borderColor: infoReply.id_comment === comment.id_comment ? 'text.secondary' : 'transparent',
                                    '&:last-child': {
                                        mb: '0'
                                    }
                                }}>

                                    <ListItemAvatar>
                                        <Avatar alt="Remy Sharp" src={comment.author_avatar} />
                                    </ListItemAvatar>
                                    <ListItemText
                                        sx={{ '& .MuiTypography-root ': { maxWidth: '513px' } }}
                                        primary={comment.author_name}
                                        secondary={
                                            <>
                                                {comment.text}
                                            </>
                                        }
                                    />
                                    <Typography sx={{ fontSize: '14px', color: 'text.disabled', mt: '7px' }}>{comment.createdAt}</Typography>


                                    <Box sx={{ width: '100%', justifyContent: 'space-between', display: 'flex', mt: '7px' }}>
                                        <Button
                                            onClick={() => handleReply(comment.id_comment, comment.id_comment, comment.author_name)}
                                            sx={{
                                                p: '0',
                                                '&:hover': { backgroundColor: "transparent", color: 'primary.main' },
                                                fontSize: "14px",
                                                textTransform: 'initial',
                                                minWidth: "0",
                                                color: infoReply.id_comment === comment.id_comment ? 'primary.main' : 'text.secondary'
                                            }}>reply</Button>
                                        <Button
                                            onClick={() => {
                                                if ((openReply === '' || openReply !== comment.id_comment) && comment.reply_count > 0) {
                                                    handleReplies(comment.id_comment)

                                                }
                                            }}
                                            sx={{
                                                p: '0',
                                                '&:hover': { backgroundColor: "transparent", color: openReply === comment.id_comment ? '#BDBDBD' : 'primary.main' },
                                                fontSize: "14px",
                                                textTransform: 'initial',
                                                cursor: openReply === comment.id_comment ? 'auto' : 'pointer',
                                                minWidth: "0",
                                                color: openReply === comment.id_comment ? '#BDBDBD' : 'text.secondary'
                                            }}>{comment.reply_count} replies</Button>

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
                                            onClick={() => handleLike({ id_comment: comment.id_comment, config_id, liked: comment.liked, reply: false, id_branch:'' })}
                                        >
                                            {comment.likes_count}
                                            <FavoriteIcon sx={{ fontSize: "16px", m: '0 0 3px 3px', color: comment.liked ? 'primary.main' : 'inherit' }}></FavoriteIcon>
                                        </Button>
                                    </Box>
                                </ListItem>
                                {openReply === comment.id_comment ? (repliesData[comment.id_comment]?.ids ?? []).map(replyId => {
                                    const reply = repliesData[comment.id_comment]?.entities[replyId];

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
                                                id_branch_p={comment.id_comment}
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
                                    openReply === comment.id_comment && repliesData[comment.id_comment]?.ids && repliesData[comment.id_comment]?.ids.length > 0 ?
                                    <Box sx={{ maxWidth: "50%", justifyContent: 'center', m: '0 auto', display: "flex" }}>
                                        <Button
                                            disabled={Number.isNaN(repliesData[comment.id_comment]?.page)}
                                            sx={{
                                                p: '0',
                                                '&:hover': { backgroundColor: "transparent", color: 'primary.main' },
                                                fontSize: "14px",
                                                textTransform: 'initial',
                                                minWidth: "0",
                                                color: 'text.secondary',
                                                mr: '25px',

                                            }}
                                            onClick={() => handleReplies(comment.id_comment)}
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
                    })} */}

                </InfiniteScroll>





            </List>

            <InputComment 
                sendComm={sendComm}
            ></InputComment>


        </Box>
    )
});

