import { Avatar, Box, Button, List, ListItem, ListItemAvatar, ListItemText, Typography } from "@mui/material"
import FavoriteIcon from '@mui/icons-material/Favorite';
import { useAppDispatch, useAppSelector } from "@/state/hook";
import { Dispatch, memo, SetStateAction, useCallback, useEffect, useRef, useState } from "react";
import { getReplies, likedComment } from "@/state/slices/comments-popular-slice";
import { LikeT } from "./main-comments";
import { ReplyComment } from "./reply-comment";
import { setActiveComment } from "@/state/slices/comments-context";
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import numbro from "numbro";
import { theme } from "@/config/ThemeMUI/theme";



interface DataProps {
    id_comment: string,
    config_id: string,
    newReply: string[],
}




export const CommentsItem = memo(({ id_comment, config_id, newReply,}: DataProps) => {

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

    console.log('comm-item', '222')
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
                borderColor: isActive ? 'text.secondary' : 'transparent',
                '&:last-child': {
                    mb: '0'
                },
                [theme.breakpoints.down('md')]:{
                    p: '4px 8px'
                }
            }}>

                <Box sx={{display:'flex', justifyContent:'space-between', alignItems:'center', width:'100%', p:'7px 0',
                    [theme.breakpoints.down('md')]:{p:'4px 0'}
                }}>
                    <ListItemAvatar sx={{minWidth:"0", pr:'10px',
                        [theme.breakpoints.down('md')]:{
                            pr: '5px'
                        }
                    }}>
                        <Avatar alt={commentsData.author_name} src={commentsData.author_avatar} sx={{
                            [theme.breakpoints.down('md')]:{
                                width:'30px', height:"30px"
                            }
                        }}/>
                    </ListItemAvatar>
                    <ListItemText
                        sx={{ m:"0", width:'65%',  '& .MuiTypography-root ': { color:'text.primary', fontSize:'16px', [theme.breakpoints.down('md')]:{
                            fontSize:'14px',
                            lineHeight:"initial"
                        }}, '& .MuiTypography-body1':{
                            mb:'5px',
                            textOverflow: "ellipsis",
                            whiteSpace:'nowrap',
                            overflow:"hidden",
                            [theme.breakpoints.down('md')]:{mb:'0'}
                        } }}
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
                


                <Box sx={{ width: '100%', justifyContent: 'space-between', display: 'flex', mt: '7px',
                    [theme.breakpoints.down('md')]:{ mt: '4px'}
                 }}>
                    
                    <Button
                        onClick={() => {
                            dispatch(setActiveComment(
                                isActive ? 
                                {id_comment: '', author_name: '', id_branch:''}
                                :
                                {id_comment: id_comment, author_name: commentsData.author_name, id_branch:id_comment}
                            ))
                        }}
                        sx={{
                            p: '0',
                            '&:hover': { backgroundColor: "transparent", color: 'text.primary' },
                            fontSize: "14px",
                            textTransform: 'initial',
                            minWidth: "0",
                            color: isActive ? 'primary.main' : 'text.secondary',
                            [theme.breakpoints.down('md')]:{ fontSize:'12px'}
                        }}>
                            reply
                    </Button>
                    <Typography sx={{ fontSize: '14px', color: 'text.disabled',alignSelf: 'flex-start', 
                        [theme.breakpoints.down('md')]:{ fontSize:'12px'}
                    }}>{commentsData.createdAt}</Typography>

                    <Button sx={{
                        p: '0',
                        '&:hover': { backgroundColor: "transparent", color: 'primary.main' },
                        fontSize: "14px",
                        textTransform: 'initial',
                        minWidth: "0",
                        color: 'text.secondary',
                        alignItems: 'center',
                        [theme.breakpoints.down('md')]:{ fontSize:'12px'}
                    }}
                        onClick={() => handleLike({ id_comment: commentsData.id_comment, config_id, liked: commentsData.liked, reply: false, id_branch: '' })}
                    >
                        {formatCount(Number(commentsData.likes_count))}
                        <FavoriteIcon sx={{ fontSize: "16px", m: '0 0 3px 3px', color: commentsData.liked ? 'primary.main' : 'inherit' }}></FavoriteIcon>
                    </Button>
                </Box>

                <Box sx={{display:'flex', alignItems:'center', width:'100%'}}>
                    <hr style={{maxWidth:'10%', height:'1px', backgroundColor:'#8E94A4',flex:1}}/>
                    <Button
                        onClick={() => {
                            if ((openReply === '' || openReply !== commentsData.id_comment) && commentsData.reply_count > 0) {
                                handleReplies({ id_comment: commentsData.id_comment, more: false })

                            }

                            if (openReply === commentsData.id_comment) {
                                setOpenReply('')
                            }
                        }}
                        sx={{
                            whiteSpace: 'nowrap',
                            m:'0 20px',
                            p: '0',
                            '&:hover': { backgroundColor: "transparent", color: commentsData.reply_count > 0 ? 'text.primary' : 'text.secondary' },
                            fontSize: "14px",
                            textTransform: 'initial',
                            cursor: commentsData.reply_count > 0 ? 'pointer' : 'initial',
                            minWidth: "0",
                            color: openReply === commentsData.id_comment ? 'primary.main' : 'text.secondary',
                            [theme.breakpoints.down('md')]:{ fontSize:'12px'}
                        }}>
                            {formatCount(Number(commentsData.reply_count))} replies 
                            <KeyboardArrowDownIcon sx={{
                                transform: openReply === commentsData.id_comment ? 'rotate(180deg)' : 'rotate(0deg)',
                                transition: 'transform 0.2s ease', 
                            }} width={20} height={20}></KeyboardArrowDownIcon>
                    </Button>
                    <hr style={{width:'40%', height:'1px', backgroundColor:'#8E94A4',flex:1}}/>
                </Box>
                
            </Box>
            <List sx={{display:openReply === commentsData.id_comment ? 'block' : 'none'}}>
                {openReply === commentsData.id_comment ? (repliesData?.ids ?? []).map(replyId => {
                    const reply = repliesData?.entities[replyId];

                    return (
                        <ReplyComment
                            key={reply.id_comment}

                            id_comment_p={reply.id_comment}
                            id_branch_p={id_comment}
                            handleLike={handleLike}
                            config_id={config_id}
                        >
                        </ReplyComment>
                        

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
                                '&:hover': { backgroundColor: "transparent", color: 'text.primary' },
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
                            '&:hover': { backgroundColor: "transparent", color: 'text.primary' },
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
        
})