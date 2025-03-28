'use client'


import { useAppDispatch, useAppSelector } from "@/state/hook";
import { likePopContent, popularFetch, savePopContent } from "@/state/slices/popular-slice";
import { Avatar, Box, Button, Card, CardActions, CardContent, IconButton, Typography } from "@mui/material";
import { useEffect, useRef, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination } from 'swiper/modules';
import { MediaObj } from "@/app/types/types";
import FavoriteIcon from '@mui/icons-material/Favorite';
import BookmarkIcon from '@mui/icons-material/Bookmark';
import CommentIcon from '@mui/icons-material/Comment';
import { MediaSwiper } from "./media-swiper";
import { all, BigNumber, create, evaluate, number } from "mathjs";
import { Comments } from "./comments";
import { resetComments } from "@/state/slices/comments-popular-slice";


import 'swiper/css';
import 'swiper/css/navigation';

import './styles.css';







export function MainPopular() {
    const dispatch = useAppDispatch()
    const popularData = useAppSelector(state => state.popular)
    const userData = useAppSelector(state => state.user)
    const connection_id = userData?.user?.connection_id
    const commentsData = useAppSelector(state => state.comments)
    
    const [activeVideo, setActiveVideo] = useState<number>(0)
    const [openComment, setOpenComment] = useState<boolean>(false)

    const firstViewTracked = useRef<string>('');


    useEffect(() => {
        if (connection_id !== '') {
            dispatch(popularFetch({ id: connection_id, count: 10 }))
        }
    }, [connection_id])


    useEffect(() => {
        if (popularData.pop_list.length > 0) {
            const firstRecipe = popularData.pop_list[0];

            if (firstRecipe && firstViewTracked.current !== firstRecipe.id_recipe) {
                updateViews(firstRecipe.config_id);
                firstViewTracked.current = firstRecipe.id_recipe;
            }
        }
    }, [popularData.pop_list]);


    async function updateViews(config_id: string) {
        try {
            const response = await fetch(`/api/popular`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ config_id }),
            });

            if (!response.ok) {
                console.error('Failed to update views');
            }
        } catch (error) {
            console.error('Error in updating views:', error);
        }
    }


    function handleLike() {
        if (connection_id !== '' && !popularData.status) {
            console.log('3')
            dispatch(likePopContent({
                config_id: popularData.pop_list[activeVideo]?.config_id,
                liked: popularData.pop_list[activeVideo]?.liked,
                user_id: connection_id
            }))
        }

    }


    function handleSave() {
        if (connection_id !== '' && !popularData.status) {
            dispatch(savePopContent({
                config_id: popularData.pop_list[activeVideo]?.config_id,
                saved: popularData.pop_list[activeVideo]?.saved,
                user_id: connection_id
            }))
        }
    }





    return (
        <Card sx={{ width: '100%', backgroundColor: "background.default", display: 'flex', m: '20px 0', height: '100%' }}>
            <Box sx={{ maxWidth: '70%', position: 'relative', width: "100%" }}>

                <Swiper
                    key={activeVideo}
                    pagination={{
                        dynamicBullets: true,
                        clickable: true,
                    }}
                    className="swiper-popular"
                    slidesPerView={'auto'}
                    modules={[Pagination]}
                    spaceBetween={2}

                >
                    {popularData.pop_list[activeVideo]?.recipe_media.map((elem: MediaObj) => (
                        <SwiperSlide key={elem.media_id} className="slide-popular">
                            <MediaSwiper props={{ elem }} />
                        </SwiperSlide>
                    ))}
                </Swiper>


                <Box
                    sx={{ position: 'absolute', p: '10px', backgroundColor: 'primary.main', top: '50px', zIndex: 1000 }}
                    onClick={() => {
                        setActiveVideo(activeVideo + 1)
                        if(commentsData.comm_list.length > 0){
                            setOpenComment(false)
                            dispatch(resetComments())
                        }
                        // handleNewVideo()
                    }}
                >+</Box>
                <Box
                    sx={{ position: 'absolute', p: '10px', backgroundColor: 'primary.main', bottom: "100px", zIndex: 1000 }}
                    onClick={() => {
                        setActiveVideo(activeVideo !== 0 ? activeVideo - 1 : activeVideo)
                        if(commentsData.comm_list.length > 0){
                            setOpenComment(false)
                            dispatch(resetComments())
                        }
                    }}
                >-</Box>



                <Box sx={{
                    backgroundColor: 'rgba(0, 0, 0, 0.2)',
                    backdropFilter: 'blur(3px)',
                    height: '100%',
                    // width:'100px',
                    position: "absolute",
                    top: '0',
                    right: '0',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    p: '0 7px',
                    zIndex: 1000,
                }}>

                    <Avatar alt="name" src={popularData.pop_list[activeVideo]?.author_info.author_img} />
                    <Typography sx={{ m: '10px 0' }}>{popularData.pop_list[activeVideo]?.author_info.author_name}</Typography>

                    <CardActions sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        '&.MuiCardActions-root>:not(style)~:not(style)': {
                            ml: 0,
                        }
                    }}>
                        <IconButton
                            onClick={() => handleLike()}
                            sx={{ m: '5px 0', color: 'text.primary', p: '0', flexDirection: 'column', justifyContent: "center" }}
                        >
                            <FavoriteIcon sx={{ color: `${popularData.pop_list[activeVideo]?.liked ? 'primary.main' : 'text.primary'}` }}></FavoriteIcon>
                            <Typography>{popularData.pop_list[activeVideo]?.likes}</Typography>
                        </IconButton>


                        <IconButton
                            onClick={() => setOpenComment(!openComment)}
                            sx={{ m: '10px 0', color: 'text.primary', p: '0', flexDirection: 'column', justifyContent: "center" }}>
                            <CommentIcon sx={{ color: `${openComment ? 'primary.main' : 'text.primary'}` }} >{popularData.pop_list[activeVideo]?.comments}</CommentIcon>
                            <Typography>{popularData.pop_list[activeVideo]?.comments}</Typography>
                        </IconButton>

                        <IconButton
                            onClick={() => handleSave()}
                            sx={{ m: '5px 0', color: 'text.primary', p: '0', flexDirection: 'column', justifyContent: "center" }}>
                            <BookmarkIcon sx={{ color: `${popularData.pop_list[activeVideo]?.saved ? 'primary.main' : 'text.primary'}` }}>{popularData.pop_list[activeVideo]?.saves}</BookmarkIcon>
                            <Typography>{popularData.pop_list[activeVideo]?.saves}</Typography>
                        </IconButton>
                    </CardActions>

                </Box>

            </Box>


            <CardContent sx={{ flexGrow: '1', display: 'flex', flexDirection: 'column' }}>
                <Typography gutterBottom variant="h5" component="div">
                    {popularData.pop_list[activeVideo]?.recipe_name}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                    {popularData.pop_list[activeVideo]?.description}
                </Typography>

                {openComment ?
                    <Comments props={{
                        user_info: userData?.user,
                        config_id: popularData.pop_list[activeVideo]?.config_id,
                        activeVideo
                        // dataAlgoPop,
                        // setDataAlgoPop
                    }}></Comments>
                    
                    :
                    <CardActions>
                        <Button size="small">Share</Button>
                        <Button size="small">Learn More</Button>
                    </CardActions>
                }

            </CardContent>


        </Card>

    )
}