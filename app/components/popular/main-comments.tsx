import { useAppDispatch, useAppSelector } from "@/state/hook"
import { Box, CircularProgress, List, Typography, } from "@mui/material"
import { memo, useCallback, useEffect, useRef, useState } from "react"
import { commVideoFetch, newCommPopular, newReplyComm } from "@/state/slices/comments-popular-slice";
import { v4 as uuidv4 } from 'uuid';
import InfiniteScroll from 'react-infinite-scroll-component';
import { InputComment } from "./input-comment";
import { CommentsItem } from "./comments-item";
import { shallowEqual } from "react-redux";
import { mainCommentContainer } from "@/app/(main)/popular/style";
import { usePingGate } from "@/app/hooks/ping";



interface dataProps {
    config_id: string,
    comments: number
}

export interface LikeT {
    id_comment: string,
    config_id: string,
    liked: boolean | undefined,
    reply: boolean,
    id_branch: string
}
export const MainComments = memo(({ config_id, comments }: dataProps) => {
    const userData = useAppSelector(state => state.user);
    const replyLength = useAppSelector(state =>
        Object.values(state.comments.replies).reduce((sum, replyData) => {
            return sum + replyData.ids.length;
        }, 0)
    );

    const connection_id = userData?.user?.connection_id;
    const dispatch = useAppDispatch();
    const pingGate = usePingGate()
    
    const commentsData = useAppSelector(state => {
        return state.comments.comments[config_id] 
    });
    const contextComment = useAppSelector(
        state => ({
            id_comment: state.commentContext.comment.id_comment,
            author_name: state.commentContext.comment.author_name,
            id_branch: state.commentContext.comment.id_branch
        }),
        shallowEqual
    );

    const [newComments, setNewComments] = useState<string[]>([]);
    const [newReply, setNewReply] = useState<string[]>([]);
    const scrollRef = useRef<HTMLDivElement>(null);
    const firstFetch = useRef<boolean>(true)

      

    useEffect(() => {
        if (config_id && connection_id && firstFetch.current && comments > 0) {
            firstFetch.current = false
            pingGate(() => {
                dispatch(commVideoFetch({
                    config_id,
                    user_id: connection_id,
                    page: 1,
                    newComments: []
                }))
            });
            
        }
    }, [config_id, connection_id, dispatch, comments, pingGate]);
    


    const fetchMoreComments = useCallback(() => {
        if (firstFetch.current || Number.isNaN(commentsData.page) ) return;
        // setIsFetching(true);
        pingGate(() => {
            dispatch(commVideoFetch({
                config_id,
                user_id: connection_id || '',
                page: commentsData.page + 1,
                newComments
            }))
        });
        // .finally(() => {
        //     setIsFetching(false);
        // });
    }, [commentsData.page, config_id, connection_id, newComments, dispatch, pingGate]);



    useEffect(() => {
        const el = scrollRef.current;
        if (!el || Number.isNaN(commentsData.page) || firstFetch.current) return;
        let timeout: ReturnType<typeof setTimeout> | null = null;
        const scrollBuffer = 75;


        const checkNeedFetch = () => {
            if (!el || firstFetch.current) return;

            const contentShort = el.scrollHeight <= el.clientHeight + scrollBuffer;

            if (contentShort && !Number.isNaN(commentsData.page) && commentsData.page > 0 ) {
                fetchMoreComments();
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
    }, [commentsData.page, commentsData.ids.length, fetchMoreComments]);



    const sendComm = useCallback((text: string) => {
        
        if (connection_id !== '') {
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
                };

                dispatch(newReplyComm({ data, config_id: config_id }));
                setNewReply(prev => [...prev, data.id_comment]);
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
                };
                setNewComments(prev => [...prev, data.id_comment]);
                dispatch(newCommPopular(data));
            }
        }
    }, [connection_id, config_id, dispatch, contextComment, userData]);


    return (
        <Box sx={mainCommentContainer}>
            <Typography sx={{textAlign:'center', p:'7px 0', fontSize:'14px', color:"text.disabled"}}>Total {comments}</Typography>

            <Box ref={scrollRef} sx={{
                overflow: 'auto', scrollbarColor: "#353842 #1F2128", pr: '5px', pb: "0",
                height: "100%"
            }} id="scrollableTarget">
                <InfiniteScroll
                    style={{ overflow: 'initial' }}
                    dataLength={commentsData.ids.length}
                    next={fetchMoreComments}
                    hasMore={!Number.isNaN(commentsData.page) &&
                            commentsData.ids.length < (comments - replyLength)}
                    loader={
                        <div style={{ margin: '0 auto', width: '100%', display: "inline-flex", justifyContent: 'center', overflow: "none" }}>
                            <CircularProgress color="secondary" size="35px" />

                        </div>
                    }
                    endMessage={
                        <p style={{ textAlign: 'center' }}>
                            <span style={{ color: '#8E94A4', fontSize: "14px" }}>nothing else</span>
                        </p>
                    }
                    scrollableTarget="scrollableTarget"

                >
                    <List sx={{ pt: "0" }}>
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


MainComments.displayName = 'MainComments';