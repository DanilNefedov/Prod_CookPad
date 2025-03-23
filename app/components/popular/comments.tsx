import { collectionUser } from "@/app/types/types"
import { useAppDispatch, useAppSelector } from "@/state/hook"
import { Avatar, Box, Button, List, ListItem, ListItemAvatar, ListItemText, TextField, Typography } from "@mui/material"
import { useEffect, useState } from "react"
import SendIcon from '@mui/icons-material/Send';
import { commVideoFetch, likedComment, newCommPopular } from "@/state/slices/comments-popular-slice";
import FavoriteIcon from '@mui/icons-material/Favorite';
import { v4 as uuidv4 } from 'uuid';




interface dataProps {
    user_info: collectionUser,
    config_id: string,
}



export function Comments({ props }: { props: dataProps }) {
    const { user_info, config_id} = props
    const connection_id = user_info.connection_id

    const [comm, setComm] = useState<string>('')
    const [openReply, setOpenReply] = useState<string>('')
    
    const dispatch = useAppDispatch()
    const commentsData = useAppSelector(state => state.comments)
    const [infoReply, setInfoReply] = useState<{ id_comment: string, author_name: string, id_branch:string }>({
        id_comment: '',
        author_name: '',
        id_branch:''
    })


    useEffect(() => {
        if (config_id && connection_id !== '') {
            dispatch(commVideoFetch({ config_id, user_id:connection_id }))
        }
        

    }, [config_id])
    
    function sendComm() {
        console.log('sendComm')
        if (connection_id !== '') {
        //     if (infoReply.id_comment !== '') {

        //         const data = {
        //             id_comment: uuidv4(),
        //             id_branch:openReply === '' ? infoReply.id_comment : openReply,
        //             id_author: user_info?.connection_id,
        //             author_avatar: user_info?.img,
        //             author_name: user_info?.name,
        //             id_parent: infoReply.id_comment,
        //             name_parent: infoReply.author_name,
        //             likes_count:0,
        //             text: comm.trim(),
        //         }
        //         dispatch(newReplyComm({ data, id_recipe: config_id }))
        //         setComm('')
        //         // setDataAlgoPop(prevState => ({
        //         //     ...prevState,
        //         //     comment: prevState.comment + 1
        //         // }));
        //     } else {
                const data = {
                    id_comment: uuidv4(),
                    id_author: connection_id,
                    author_avatar: user_info?.img,
                    author_name: user_info?.name,
                    config_id: config_id,
                    text: comm.trim(),
                    likes_count:0,
                    reply_list:[],
                    answer_count: 0,
                }
                dispatch(newCommPopular({data, comment_branch:true}))
                setComm('')
                // setDataAlgoPop(prevState => ({
                //     ...prevState,
                //     comment: prevState.comment + 1
                // }));

            }
        // }
    }

    // function handleReply(id_branch:string, id_comment: string, author_name: string) {
    //     setInfoReply(infoReply.id_comment === id_comment ? { id_comment: '', author_name: '', id_branch:'' } : { id_branch, id_comment, author_name })
    // }


    // function handleReplies(id_comment: string) {
    //     if (user_info?.connection_id && user_info?.connection_id !== null) {
            
    //         const comment = stateCommVideo.comm_list.find(el => el.id_comment === id_comment);
    //         const skip = comment ? (comment.reply_list ? comment.reply_list.length : 0) : 0;
    //         dispatch(getReplies({ id_comment, skip, id_author:user_info?.connection_id}))

    //     }
        
    // }
    
    function handleLike(id_comment:string, config_id:string, liked:boolean | undefined, id_parent:string, reply:boolean ){
        if (connection_id !== '' && liked !== undefined) {
            console.log(liked,id_comment)
            dispatch(likedComment({
                id_author:connection_id, 
                // id_branch:openReply === '' ? infoReply.id_comment : openReply, 
                id_comment, 
                config_id, 
                // id_parent, 
                liked, 
                reply
            }))
        }
        
    }
    console.log(commentsData)
    return (
        <Box sx={{ width: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', flexGrow: '1', pt: '20px', overflow: 'auto', }}>
            <List sx={{ overflow: 'auto', scrollbarColor: "#353842 #1F2128", pr: '5px', pb: "0" }}>


                {commentsData.comm_list.map(el => (
                    <Box key={el.id_comment} sx={{ mb: '10px' }}>
                        <ListItem alignItems="flex-start" sx={{
                            bgcolor: 'background.paper',
                            borderRadius: '10px',

                            flexWrap: "wrap",
                            border: '1px solid transparent',
                            borderColor: infoReply.id_comment === el.id_comment ? 'text.secondary' : 'transparent',
                            '&:last-child': {
                                mb: '0'
                            }
                        }}>

                            <ListItemAvatar>
                                <Avatar alt="Remy Sharp" src={el.author_avatar} />
                            </ListItemAvatar>
                            <ListItemText
                                sx={{ '& .MuiTypography-root ': { maxWidth: '513px' } }}
                                primary={el.author_name}
                                secondary={
                                    <>
                                        {el.text}
                                    </>
                                }
                            />
                            <Typography sx={{ fontSize: '14px', color: 'text.disabled', mt: '7px' }}>{el.createdAt}</Typography>


                            <Box sx={{ width: '100%', justifyContent: 'space-between', display: 'flex', mt: '7px' }}>
                                <Button
                                    // onClick={() => handleReply(el.id_comment, el.id_comment, el.author_name)}
                                    sx={{
                                        p: '0',
                                        '&:hover': { backgroundColor: "transparent", color: 'primary.main' },
                                        fontSize: "14px",
                                        textTransform: 'initial',
                                        minWidth: "0",
                                        color: infoReply.id_comment === el.id_comment ? 'primary.main' : 'text.secondary'
                                    }}>reply</Button>
                                <Button
                                    // onClick={() => {
                                    //     if((openReply === '' || openReply !== el.id_comment) && el.answer_count > 0){
                                    //         if(el.reply_list && el.reply_list.length === 0){
                                    //             handleReplies(el.id_comment) 
                                    //         }
                                    //         setOpenReply(el.id_comment)
                                    //     } 
                                    // }}
                                    sx={{
                                        p: '0',
                                        '&:hover': { backgroundColor: "transparent", color: openReply === el.id_comment ? '#BDBDBD' :'primary.main'  },
                                        fontSize: "14px",
                                        textTransform: 'initial',
                                        cursor:openReply === el.id_comment ? 'auto' : 'pointer',
                                        minWidth: "0",
                                        color: openReply === el.id_comment ? '#BDBDBD' : 'text.secondary'
                                    }}>{el.answer_count} replies</Button>

                                <Button sx={{
                                    p: '0',
                                    '&:hover': { backgroundColor: "transparent", color: 'primary.main' },
                                    fontSize: "14px",
                                    textTransform: 'initial',
                                    minWidth: "0",
                                    color: 'text.secondary',
                                    alignItems:'center',
                                    // maxHeight:'20px'
                                }}
                                onClick={() => handleLike(el.id_comment, config_id, el.liked, el.id_comment, false )}
                                >
                                    {el.likes_count}
                                    <FavoriteIcon sx={{ fontSize: "16px", m:'0 0 3px 3px', color:el.liked ? 'primary.main' : 'inherit' }}></FavoriteIcon>
                                </Button>
                            </Box>
                        </ListItem>
                        {openReply === el.id_comment ? el.reply_list?.map(elem => (
                            <ListItem key={elem.id_comment} alignItems="flex-start" sx={{
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
                                {/* <ReplyComment props={{elem, id_branch:el.id_comment, handleLike, config_id:config_id, handleReply}}></ReplyComment> */}
                            </ListItem>                           

                        )):
                        <></>
                        }
                        {
                            openReply === el.id_comment && el.reply_list && el.reply_list?.length > 0 ? 
                            <Box sx={{maxWidth:"50%",justifyContent:'center', m:'0 auto', display:"flex"}}>
                                <Button sx={{
                                    p: '0',
                                    '&:hover': { backgroundColor: "transparent", color: 'primary.main' },
                                    fontSize: "14px",
                                    textTransform: 'initial',
                                    minWidth: "0",
                                    color: 'text.secondary',
                                    mr:'25px'
                                }}
                                // onClick={() => handleReplies(el.id_comment)}
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
                ))}



            </List>


            <Box sx={{ position: 'relative', marginTop: "10px" }}>
                <TextField
                    sx={{
                        bgcolor: 'background.paper',
                        width: '100%',
                        overflow: 'hidden',
                        '& .MuiInputBase-root': {
                            p: '9px 52px 9px 7px',
                            "&:after": {
                                border: "transparent"
                            }
                        },
                        borderRadius: '10px',

                    }}
                    id="filled-multiline-flexible"
                    // label="Multiline"
                    multiline
                    maxRows={2}
                    variant="filled"
                    value={comm}
                    onChange={(e) => setComm(e.target.value)}

                />
                <Button onClick={() => sendComm()} sx={{ position: 'absolute', right: '15px', top: 'calc(50% - 19px)', minWidth: '0' }}>
                    <SendIcon ></SendIcon>
                </Button>
            </Box>

        </Box>

    )
}