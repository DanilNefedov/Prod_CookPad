'use client'


import { useAppDispatch, useAppSelector } from "@/state/hook";
import { likePopContent, popularFetch, savePopContent } from "@/state/slices/popular-slice";
import { Avatar, Box, Button, Card, CardActions, CardContent, IconButton, List, Typography } from "@mui/material";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination } from 'swiper/modules';
import { MediaObj } from "@/app/types/types";
import FavoriteIcon from '@mui/icons-material/Favorite';
import BookmarkIcon from '@mui/icons-material/Bookmark';
import CommentIcon from '@mui/icons-material/Comment';
import { MediaSwiper } from "./media-swiper";
import { all, BigNumber, create, evaluate, number } from "mathjs";
import { MainComments } from "./main-comments";
import { commVideoFetch } from "@/state/slices/comments-popular-slice";


import 'swiper/css';
import 'swiper/css/navigation';

import './styles.css';
import { InfoAboutContent } from "./info-about-content";
import InfiniteScroll from "react-infinite-scroll-component";
import { mainBtnsPopular } from "@/app/(main)/popular/style";







export function MainPopular() {

    const dispatch = useAppDispatch()
    const popularData = useAppSelector(state => state.popular)
    // const popularStatus = useAppSelector(state => state.popular.status)
    const userData = useAppSelector(state => state.user)
    const connection_id = userData?.user?.connection_id
    

    const [activeVideo, setActiveVideo] = useState<number>(0)
    const [openComment, setOpenComment] = useState<boolean>(false)



    const viewedVideos = useRef<Set<string>>(new Set());

    useEffect(() => {
        if (connection_id !== '') {
            dispatch(popularFetch({ connection_id, count: 5, getAllIds: null }))
        }
    }, [connection_id])


    useEffect(() => {
        if (popularData.pop_list.length > 0) {
            const firstRecipe = popularData.pop_list[0];
            if (!viewedVideos.current.has(firstRecipe.config_id)) {
                updateViews(firstRecipe.config_id);
            }
        }
    }, [popularData.pop_list]);


    async function updateViews(config_id: string) {
        if (viewedVideos.current.has(config_id)) return
        viewedVideos.current.add(config_id);

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






    function handleNewVideo() {
        if (connection_id !== '') {
            dispatch(popularFetch({ connection_id, count: 1, getAllIds: popularData.pop_list.map(item => item.config_id) }))
        }
    }

    const toggleComment = useCallback(() => {
        setOpenComment(prev => !prev);
    }, []);




    console.log('main-popular',)
    return (
        <>
            <Card sx={{ maxWidth: '100%', position: 'relative', backgroundColor: "background.default", display: 'flex', width: "100%", height: '100%' }}>
                <Box sx={{ maxWidth: '65%', position: 'relative', width: "100%" }} >


                    <MediaSwiper activeVideo={activeVideo} />





                    {
                        popularData.pop_list[activeVideo] && <InfoAboutContent props={{
                            author: popularData.pop_list[activeVideo]?.author_info,
                            likes: popularData.pop_list[activeVideo]?.likes,
                            liked: popularData.pop_list[activeVideo]?.liked,
                            saved: popularData.pop_list[activeVideo]?.saved,
                            saves: popularData.pop_list[activeVideo]?.saves,
                            comments: popularData.pop_list[activeVideo]?.comments,
                            config_id: popularData.pop_list[activeVideo]?.config_id,
                            openComment,
                            toggleComment
                        }}></InfoAboutContent>
                    }

                </Box>


                <CardContent sx={{ flexGrow: '1', display: 'flex', flexDirection: 'column', maxWidth: '35%' }}>
                    <Typography gutterBottom variant="h5" component="div" sx={{ flexShrink: 0, textOverflow: 'ellipsis', pb: '10px', lineHeight: 'none', mb: '0', whiteSpace: 'nowrap', overflow: 'hidden', }}>
                        {popularData.pop_list[activeVideo]?.recipe_name}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ flexShrink: 0, fontSize: "16px", display: 'block', pb: '20px', textOverflow: 'ellipsis', whiteSpace: 'nowrap', overflow: 'hidden', }}>
                        {popularData.pop_list[activeVideo]?.description}
                    </Typography>
                    {openComment ?

                        <MainComments config_id={popularData.pop_list[activeVideo]?.config_id} activeVideo={activeVideo}></MainComments>

                        :
                        <></>
                    }
                </CardContent>



            </Card>
            <Box sx={{ position: 'absolute',left: '105%',bottom:'20%', zIndex: 1000, display:'flex', flexDirection:'column', gap:'20px'}}>
                <Box
                    sx={mainBtnsPopular}
                    onClick={() => {
                        if (activeVideo + 1 < popularData.pop_list.length) {
                            setActiveVideo(activeVideo + 1);
                            handleNewVideo();
                            updateViews(popularData.pop_list[activeVideo + 1].config_id);
                        }

                        if (openComment) {
                            setOpenComment(false);
                            // dispatch(resetComments());
                        }

                    }}
                >+</Box>
                <Box
                    sx={mainBtnsPopular}
                    onClick={() => {
                        setActiveVideo(activeVideo !== 0 ? activeVideo - 1 : activeVideo)
                        if (openComment) {
                            setOpenComment(false)
                            // dispatch(resetComments())
                        }
                    }}
                >-</Box>
            </Box>

        </>

    )
}