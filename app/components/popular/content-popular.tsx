'use client'


import { useAppDispatch, useAppSelector } from "@/state/hook";
import { likePopContent, popularFetch, savePopContent } from "@/state/slices/popular-slice";
import { Avatar, Box, Button, Card, CardActions, CardContent, IconButton, Typography } from "@mui/material";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination } from 'swiper/modules';
import { MediaObj } from "@/app/types/types";
import FavoriteIcon from '@mui/icons-material/Favorite';
import BookmarkIcon from '@mui/icons-material/Bookmark';
import CommentIcon from '@mui/icons-material/Comment';
import { MediaSwiper } from "./media-swiper";
import { all, BigNumber, create, evaluate, number } from "mathjs";
import { Comments } from "./main-comments";
import { resetComments } from "@/state/slices/comments-popular-slice";


import 'swiper/css';
import 'swiper/css/navigation';

import './styles.css';
import { InfoAboutContent } from "./info-about-content";







export function ContentPopular() {
    const dispatch = useAppDispatch()
    const popularData = useAppSelector(state => state.popular)
    const userData = useAppSelector(state => state.user)
    const connection_id = userData?.user?.connection_id
    const commentsData = useAppSelector(state => state.comments)
    
    const [activeVideo, setActiveVideo] = useState<number>(0)
    const [openComment, setOpenComment] = useState<boolean>(false)

    const viewedVideos = useRef<Set<string>>(new Set());

    useEffect(() => {
        if (connection_id !== '') {
            dispatch(popularFetch({ connection_id, count: 5, getAllIds:null}))
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


  



    function handleNewVideo(){
        if (connection_id !== '') {
            dispatch(popularFetch({ connection_id, count: 1, getAllIds: popularData.pop_list.map(item => item.config_id)}))
        }
    }




    console.log('content-popular')
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
                        if (activeVideo + 1 < popularData.pop_list.length) {
                            setActiveVideo(activeVideo + 1);
                            handleNewVideo();
                            updateViews(popularData.pop_list[activeVideo + 1].config_id);
                        }
                    
                        if (commentsData.comm_list.length > 0) {
                            setOpenComment(false);
                            dispatch(resetComments());
                        }
                        
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



                <InfoAboutContent></InfoAboutContent>

            </Box>


            

        </Card>

    )
}