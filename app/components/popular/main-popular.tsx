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
import { commVideoFetch, resetComments } from "@/state/slices/comments-popular-slice";


import 'swiper/css';
import 'swiper/css/navigation';

import './styles.css';
import { ContentPopular } from "./content-popular";
import { InfoAboutContent } from "./info-about-content";
import InfiniteScroll from "react-infinite-scroll-component";







export function MainPopular() {

    const dispatch = useAppDispatch()
    const popularData = useAppSelector(state => state.popular)
    // const popularStatus = useAppSelector(state => state.popular.status)
    const userData = useAppSelector(state => state.user)
    const connection_id = userData?.user?.connection_id
    const commentsData = useAppSelector(state => state.comments.comments)

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




    console.log('main-popular')
    return (
        <Card sx={{ width: '100%', backgroundColor: "background.default", display: 'flex', m: '20px 0', height: '100%' }}>
            <Box sx={{ maxWidth: '70%', position: 'relative', width: "100%" }} >

                
                <MediaSwiper activeVideo={activeVideo} />
                     
                <Box
                    sx={{ position: 'absolute', p: '10px', backgroundColor: 'primary.main', top: '50px', zIndex: 1000 }}
                    onClick={() => {
                        if (activeVideo + 1 < popularData.pop_list.length) {
                            setActiveVideo(activeVideo + 1);
                            handleNewVideo();
                            updateViews(popularData.pop_list[activeVideo + 1].config_id);
                        }

                        if (commentsData.ids.length > 0) {
                            setOpenComment(false);
                            dispatch(resetComments());
                        }

                    }}
                >+</Box>
                <Box
                    sx={{ position: 'absolute', p: '10px', backgroundColor: 'primary.main', bottom: "100px", zIndex: 1000 }}
                    onClick={() => {
                        setActiveVideo(activeVideo !== 0 ? activeVideo - 1 : activeVideo)
                        if (commentsData.ids.length > 0) {
                            setOpenComment(false)
                            dispatch(resetComments())
                        }
                    }}
                >-</Box>



                {
                    popularData.pop_list[activeVideo] && <InfoAboutContent props={{
                        author:popularData.pop_list[activeVideo]?.author_info,
                        likes:popularData.pop_list[activeVideo]?.likes,
                        liked:popularData.pop_list[activeVideo]?.liked,
                        saved:popularData.pop_list[activeVideo]?.saved,
                        saves:popularData.pop_list[activeVideo]?.saves,
                        comments:popularData.pop_list[activeVideo]?.comments,
                        config_id:popularData.pop_list[activeVideo]?.config_id,
                        openComment, 
                        toggleComment
                    }}></InfoAboutContent>
                }

            </Box>


            <CardContent sx={{ flexGrow: '1', display: 'flex', flexDirection: 'column' }}>
                 <Typography gutterBottom variant="h5" component="div">
                    {popularData.pop_list[activeVideo]?.recipe_name}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                    {popularData.pop_list[activeVideo]?.description}
                </Typography>
                {openComment ?
                    
                    <MainComments config_id={popularData.pop_list[activeVideo]?.config_id} activeVideo={activeVideo}></MainComments>
                        
                    :
                    <></>
                }
            </CardContent>



        </Card>

    )
}