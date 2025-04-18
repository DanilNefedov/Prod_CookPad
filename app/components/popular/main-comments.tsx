import { collectionUser } from "@/app/types/types"
import { useAppDispatch, useAppSelector } from "@/state/hook"
import { Avatar, Box, Button, CircularProgress, List, ListItem, ListItemAvatar, ListItemText, TextField, Typography } from "@mui/material"
import { memo, useCallback, useEffect, useMemo, useRef, useState } from "react"
import SendIcon from '@mui/icons-material/Send';
import { commVideoFetch, getReplies, likedComment, newCommPopular, newReplyComm } from "@/state/slices/comments-popular-slice";
import FavoriteIcon from '@mui/icons-material/Favorite';
import { v4 as uuidv4 } from 'uuid';
import { ReplyComment } from "./reply-comment";
import InfiniteScroll from 'react-infinite-scroll-component';
import { InputComment } from "./input-comment";
import { CommentsItem } from "./comments-item";
import { shallowEqual } from "react-redux";
import { theme } from "@/config/ThemeMUI/theme";



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
export const MainComments = memo(({ config_id, activeVideo }: dataProps) => {

    const userData = useAppSelector(state => state.user)
    const connection_id = userData?.user?.connection_id

    const rawCommentsData = useAppSelector(state => state.comments.comments[config_id]);
    const commentsData = useMemo(() => {
      return rawCommentsData ?? {
        page: 1,
        ids: [],
        entities: {},
      };
    }, [rawCommentsData]);


    const contextComment = useAppSelector(state => ({
        id_comment: state.commentContext.comment.id_comment,
        author_name: state.commentContext.comment.author_name,
        id_branch: state.commentContext.comment.id_branch
    }),
        shallowEqual
    )

    const [newComments, setNewComments] = useState<string[]>([])
    const [newReply, setNewReply] = useState<string[]>([])

    const dispatch = useAppDispatch()

    const scrollRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        if (config_id && connection_id !== '' && commentsData.ids.length === 0) {
            console.log('3233')
            dispatch(commVideoFetch({ config_id, user_id: connection_id, page: commentsData.page, newComments: [] }))
        }
    }, [config_id, activeVideo]);

    const sendComm = useCallback((text: string) => {
        if (connection_id !== '') {
            console.log(contextComment)
            if (contextComment.id_comment !== '') {

                const data = {
                    id_comment: uuidv4(),
                    id_branch: contextComment.id_branch,
                    id_author: connection_id,
                    author_avatar: userData?.user.img,
                    author_name: userData?.user.name,
                    id_parent: contextComment.id_comment,
                    name_parent: contextComment.author_name,
                    likes_count: 0,
                    text: text.trim(),
                }

                dispatch(newReplyComm({ data, config_id: config_id }))
                setNewReply([...newComments, data.id_comment])
                // setOpenReply(openReply === '' ? contextComment.id_comment : openReply)
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
    }, [connection_id, config_id, dispatch, newComments, contextComment, userData])



    const fetchMoreComments = useCallback(() => {
        if (Number.isNaN(commentsData.page)) return;
        dispatch(commVideoFetch({
            config_id,
            user_id: connection_id,
            page: commentsData.page + 1,
            newComments
        }));
    }, [commentsData.page, config_id, connection_id, newComments, dispatch]);

    useEffect(() => {
        const el = scrollRef.current;
        if (!el || Number.isNaN(commentsData.page)) return;
    
        let isFetching = false;
        let timeout: ReturnType<typeof setTimeout> | null = null;
        
        const scrollBuffer = 75; //additional space in case of scroll but we can still see the loading block.
    
        const checkNeedFetch = () => {
            if (!el || isFetching) return;
    
            const contentShort = el.scrollHeight <= el.clientHeight + scrollBuffer;
    
            if (contentShort) {
                isFetching = true;
    
                dispatch(commVideoFetch({
                    config_id,
                    user_id: connection_id,
                    page: commentsData.page + 1,
                    newComments
                })).finally(() => {
                    isFetching = false;
                });
            }
        };
    
        const debouncedCheck = () => {
            if (timeout) clearTimeout(timeout);
            timeout = setTimeout(checkNeedFetch, 150);
        };
    
        const observer = new ResizeObserver(() => {
            debouncedCheck();
        });
    
        observer.observe(el);
        debouncedCheck();
    
        return () => {
            observer.disconnect();
            if (timeout) clearTimeout(timeout);
        };
    }, [commentsData.page, config_id, connection_id, newComments]);
    
      

    console.log('main-comments')
    return (
        <Box sx={{ width: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', flexGrow: '1', overflow: 'auto',
            
         }}>

            <Box ref={scrollRef} sx={{ overflow: 'auto', scrollbarColor: "#353842 #1F2128", pr: '5px', pb: "0",
                
             }} id="scrollableTarget">
                <InfiniteScroll
                    style={{ overflow: 'initial' }}
                    dataLength={commentsData.ids.length}
                    next={fetchMoreComments}
                    hasMore={!Number.isNaN(commentsData.page)}
                    loader={<div style={{ margin: '0 auto', width: '100%', display: "inline-flex", justifyContent: 'center', overflow: "none" }}><CircularProgress color="secondary" size="35px" /></div>}
                    endMessage={
                        <p style={{ textAlign: 'center' }}>
                            <b>Yay! You have seen it all</b>
                        </p>
                    }
                    scrollableTarget="scrollableTarget"

                >
                    <List sx={{pt:"0"}}>
                        {commentsData.ids.map((id_comment) => {
                            const comment = commentsData.entities[id_comment];
                            return (
                                <CommentsItem
                                    key={id_comment}

                                    id_comment={comment.id_comment}
                                    config_id={config_id}
                                    newReply={newReply}
                                ></CommentsItem>
                            )
                        })}
                    </List>


                </InfiniteScroll>





            </Box>

            <InputComment
                sendComm={sendComm}
            ></InputComment>


        </Box>
    )
});

