import { useAppDispatch, useAppSelector } from "@/state/hook"
import { Box, CircularProgress, List, Typography, } from "@mui/material"
import { memo, useCallback, useEffect, useRef, useState } from "react"
import { commVideoFetch, newCommPopular, newReplyComm } from "@/state/slices/comments-popular-slice";
import { v4 as uuidv4 } from 'uuid';
import InfiniteScroll from 'react-infinite-scroll-component';
import { InputComment } from "./InputComment";
import { CommentsItem } from "./CommentsItem";
import { shallowEqual } from "react-redux";
import { containerInfiniteScroll, countComments, mainCommentContainer } from "@/app/(main)/popular/styles";
import { usePingGate } from "@/app/hooks/ping";
import { columnSpaceBetween } from "@/app/styles";



interface Props {
    config_id: string,
    comments: number,
}


export const MainComments = memo(({ config_id, comments }: Props) => {
    const userData = useAppSelector(state => state.user);
    const repliesCount = useAppSelector(state =>
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
    const firstFetchRef = useRef<boolean>(true);

    

    useEffect(() => {
        if (config_id && connection_id && firstFetchRef.current && comments > 0) {
            firstFetchRef.current = false
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
        if (firstFetchRef.current || Number.isNaN(commentsData.page) ) return;
        pingGate(() => {
            dispatch(commVideoFetch({
                config_id,
                user_id: connection_id || '',
                page: commentsData.page + 1,
                newComments
            }))
        });
        
    }, [commentsData.page, config_id, connection_id, newComments, dispatch, pingGate]);



    useEffect(() => {
        const el = scrollRef.current;
        if (!el || Number.isNaN(commentsData.page) || firstFetchRef.current) return;
        let timeout: ReturnType<typeof setTimeout> | null = null;
        const scrollBuffer = 75;


        const checkNeedFetch = () => {
            if (!el || firstFetchRef.current) return;

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



    const sendComment = useCallback((text: string) => {
        
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

                pingGate(() => {
                    dispatch(newReplyComm({ data, config_id: config_id }));
                });
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
                pingGate(() => {
                    dispatch(newCommPopular(data));
                });
            }
        }
    }, [connection_id, config_id, dispatch, contextComment, userData]);


    return (
        <Box sx={[mainCommentContainer, columnSpaceBetween]}>
            <Typography sx={countComments}>Total {comments}</Typography>

            <Box ref={scrollRef} sx={containerInfiniteScroll} id="scrollableTarget">
                <InfiniteScroll
                    style={{ overflow: 'initial' }}
                    dataLength={commentsData.ids.length}
                    next={fetchMoreComments}
                    hasMore={!Number.isNaN(commentsData.page) &&
                            commentsData.ids.length < (comments - repliesCount)}
                    loader={
                        <div className="containerProgress" >
                            <CircularProgress color="secondary" size="35px" />
                        </div>
                    }
                    endMessage={
                        <p style={{ textAlign: 'center' }}>
                            <span className="emptyComments">nothing else</span>
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
                sendComment={sendComment}
            ></InputComment>


        </Box>
    )
});


MainComments.displayName = 'MainComments';