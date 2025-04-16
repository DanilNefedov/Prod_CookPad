'use client'


import { useAppDispatch, useAppSelector } from "@/state/hook";
import { likePopContent, popularFetch, savePopContent } from "@/state/slices/popular-slice";
import { Avatar, Box, Button, Card, CardActions, CardContent, IconButton, List, Skeleton, Typography } from "@mui/material";
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
import { Mousewheel, Virtual } from 'swiper/modules'
import type { Swiper as SwiperType } from 'swiper/types';
import { theme } from "@/config/ThemeMUI/theme";





export function MainPopular() {

    const dispatch = useAppDispatch()
    const popularData = useAppSelector(state => state.popular)
    // const popularStatus = useAppSelector(state => state.popular.status)
    const userData = useAppSelector(state => state.user)
    const connection_id = userData?.user?.connection_id
    const [activeVideo, setActiveVideo] = useState<number>(0)
    const [openComment, setOpenComment] = useState<boolean>(false)
    const viewedVideos = useRef<Set<string>>(new Set());
    const swiperRef = useRef<SwiperType | null>(null);
    const cooldownRef = useRef(false);



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
        if (connection_id !== '' && popularData.pop_list.length - activeVideo < 5) {
            dispatch(popularFetch({ connection_id, count: 1, getAllIds: popularData.pop_list.map(item => item.config_id) }))
        }
    }

    const toggleComment = useCallback(() => {
        setOpenComment(prev => !prev);
    }, []);


    const handleCooldown = (callback: () => void) => {
        if (cooldownRef.current) return;
        cooldownRef.current = true;
        callback();
        setTimeout(() => {
            cooldownRef.current = false;
        }, 1000);
    };
    // const [activeVideo, setActiveVideo] = useState(0);
    
    console.log('main-popular',)

    //768768768768768768768
    return (
        <>
            <Card sx={{
                position: 'relative',
                display: 'flex',
                overflow: "initial",
                boxShadow: 'none',

                m: "0 auto"
            }}>
                <Box sx={{
                    position: 'relative',
                    width: "100%",
                    aspectRatio: "9 / 13",
                    /* object-fit: cover; */
                    maxWidth: "900px",
                    height: "100%",
                    maxHeight: 'calc(100vh - 40px)',
                    backgroundColor: "background.default",
                    borderRadius: '20px 20px 0 20px',

                }} >



                
                   
                        <Swiper
                            onSwiper={(swiper) => (swiperRef.current = swiper)}
                            touchReleaseOnEdges
                            direction="vertical"
                            slidesPerView={1}
                            mousewheel={{
                                thresholdTime: 1000,
                            }}
                            effect="none"
                            virtual={{
                                // addSlidesAfter:5,
                                // addSlidesBefore:5
                                
                            }}
                            allowTouchMove={false}
                            simulateTouch={false}
                            onSlideChange={(swiper) => {
                                const newIndex = swiper.activeIndex
                                setActiveVideo(newIndex)
                                const current = popularData.pop_list[newIndex]
                                if (current) {
                                    updateViews(current.config_id)
                                    handleNewVideo()
                                    if (openComment) setOpenComment(false)
                                }
                            }}

                            initialSlide={activeVideo}
                            modules={[Virtual, Mousewheel]}
                            style={{ height: '100%' }}
                        >
                            {popularData.pop_list.map((item, index) => (
                                <SwiperSlide key={item.config_id} virtualIndex={index}>



                                    <MediaSwiper activeVideo={activeVideo} />




                                </SwiperSlide>
                            ))}
                        </Swiper>

                        


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


               
                <Box sx={{
                    position: 'absolute', right: '-200px', bottom: '11%', zIndex: 1000, display: 'flex', flexDirection: 'column', gap: '20px',
                    [theme.breakpoints.down(1250)]: { right: '-10px' }
                }}>
                    <Box
                        sx={mainBtnsPopular}
                        onClick={() => {
                            handleCooldown(() => {
                                if (activeVideo + 1 < popularData.pop_list.length) {
                                    const newIndex = activeVideo + 1;
                                    swiperRef.current?.slideTo(newIndex);
                                    setActiveVideo(newIndex);
                                    handleNewVideo();
                                    updateViews(popularData.pop_list[newIndex].config_id);
                                }

                                if (openComment) {
                                    setOpenComment(false);
                                }
                            });
                        }}
                    >+</Box>
                    <Box
                        sx={mainBtnsPopular}
                        onClick={() => {
                            handleCooldown(() => {
                                if (activeVideo > 0) {
                                    const newIndex = activeVideo - 1;
                                    swiperRef.current?.slideTo(newIndex);
                                    setActiveVideo(newIndex);
                                }

                                if (openComment) {
                                    setOpenComment(false);
                                }
                            });
                        }}
                    >-</Box>
                </Box>



            </Card>
            <Box sx={{
                backgroundColor: "background.default",
                // flexGrow: '1', 
                overflow: 'auto',
                display: 'flex',
                flexDirection: 'column',
                borderRadius: '20px',
                p: '10px 20px',
                width: " 23%",
                maxHeight: 'calc(100vh - 40px)',
                // position: "absolute",
                // top: 0,
                // right: 0,
                height: "100%",
                [theme.breakpoints.down(1250)]: { maxWidth: '42%' }
            }}>
                <Typography gutterBottom variant="h5" component="h1" sx={{
                    flexShrink: 0, textOverflow: 'ellipsis', pb: '10px', lineHeight: 'none', mb: '0', whiteSpace: 'nowrap', overflow: 'hidden',
                    [theme.breakpoints.down('md')]: { fontSize: '20px', pb: '5px' }
                }}>
                    {popularData.pop_list[activeVideo]?.recipe_name}
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{
                    flexShrink: 0, fontSize: "16px", display: 'block', pb: '20px',
                    [theme.breakpoints.down('md')]: { fontSize: '14px', pb: '10px' }
                }}>
                    {popularData.pop_list[activeVideo]?.description}
                </Typography>
                {openComment ?

                    <MainComments config_id={popularData.pop_list[activeVideo]?.config_id} activeVideo={activeVideo}></MainComments>

                    :
                    <></>
                }
            </Box>
            

        </>

    )
}