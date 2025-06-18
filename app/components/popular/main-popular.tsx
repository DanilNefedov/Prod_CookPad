'use client'

import { useAppDispatch, useAppSelector } from "@/state/hook";
import { popularFetch, updateViews, } from "@/state/slices/popular-slice";
import { Box, Card, CircularProgress, Typography } from "@mui/material";
import { useCallback, useEffect, useRef, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { MediaSwiper } from "./media-swiper";
import { MainComments } from "./main-comments";
import 'swiper/css';
import 'swiper/css/navigation';
import './styles.css';
import { InfoAboutContent } from "./info-about-content";
import {
    btnOpenInfoMobile, containerActiveInfo, containerSwichBtns, descriptionRecipe, mainBtnsPopular, mainCardContent,
    mainContainerInfoComments, mainDescriptionRecipe, mainNameRecipe, mobileNameDescriptionContainer, nameRecipe,
    viewContentContainer
} from "@/app/(main)/popular/style";
import { Mousewheel, Virtual } from 'swiper/modules'
import type { Swiper as SwiperType } from 'swiper/types';
import { theme } from "@/config/ThemeMUI/theme";
import KeyboardDoubleArrowDownIcon from '@mui/icons-material/KeyboardDoubleArrowDown';
import KeyboardDoubleArrowUpIcon from '@mui/icons-material/KeyboardDoubleArrowUp';
import KeyboardArrowLeftIcon from '@mui/icons-material/KeyboardArrowLeft';
import { usePingGate } from "@/app/hooks/ping";
import { initCommentsState } from "@/state/slices/comments-popular-slice";




export function MainPopular() {

    const dispatch = useAppDispatch()
    const popularData = useAppSelector(state => state.popular)
    const userData = useAppSelector(state => state.user)
    const errorPopular = useAppSelector(state => state.popular.operations.popularFetch)
    const connection_id = userData?.user?.connection_id
    const [activeVideo, setActiveVideo] = useState<number>(0)
    const [openComment, setOpenComment] = useState<boolean>(false)
    const viewedVideos = useRef<Set<string>>(new Set());
    const swiperRef = useRef<SwiperType | null>(null);
    const cooldownRef = useRef(false);
    const [openInfo, setOpenInfo] = useState<boolean>(false)
    const [expanded, setExpanded] = useState(false);
    const commentRef = useRef<HTMLDivElement | null>(null);
    const pingGate = usePingGate()
    const [hasFetched, setHasFetched] = useState(false);
    const isFetching = useAppSelector(state => state.popular.operations.popularFetch.loading)


    useEffect(() => {        
        dispatch(initCommentsState(popularData.pop_list[activeVideo]?.config_id))
    },[popularData.pop_list[activeVideo]?.config_id])


    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (
                window.innerWidth <= 768 &&
                openComment &&
                commentRef.current &&
                !commentRef.current.contains(event.target as Node)
            ) {
                setOpenComment(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [openComment]);

    useEffect(() => {
        if (!connection_id || errorPopular?.error) return;//|| initialFetchDone.current

        pingGate(() => {
            dispatch(popularFetch({ connection_id, count: 5, getAllIds: null }))
                .finally(() => {
                    setHasFetched(true);
                });
        });
    }, [connection_id, errorPopular?.error]);


    useEffect(() => {
        if (popularData.pop_list.length > 0 || !errorPopular) {
            const firstRecipe = popularData.pop_list[0];
            if (!viewedVideos.current.has(firstRecipe.config_id)) {
                dispatch(updateViews({config_id:firstRecipe.config_id}));
            }
        }
    }, [popularData.pop_list]);
  

    useEffect(() => {
        const current = popularData.pop_list[activeVideo];
        if ((current && !viewedVideos.current.has(current.config_id)) || !errorPopular) {
            viewedVideos.current.add(current.config_id);
            dispatch(updateViews({config_id:current.config_id}));
        }
    }, [activeVideo, popularData.pop_list.length, hasFetched, isFetching]);


    function handleNewVideo() {
        if (isFetching || errorPopular.error) return;

        pingGate(() => {
            if (connection_id ) {//&& popularData.pop_list.length >= 5
                dispatch(popularFetch({
                    connection_id,
                    count: 1,
                    getAllIds: popularData.pop_list.map(item => item.config_id)
                }))
            } 
        });
    }


    
    const toggleComment = useCallback(() => {
        const width = window.innerWidth;

        if (width <= 1030 && width > 768) {
            setOpenComment(prev => {
                const newState = !prev;
                setOpenInfo(newState ? true : openInfo);
                return newState;
            });
        } else {
            setOpenComment(prev => !prev);
        }
    }, [openInfo]);


    const handleCooldown = (callback: () => void) => {
        if (cooldownRef.current || errorPopular.error) return;
        cooldownRef.current = true;
        callback();
        setTimeout(() => {
            cooldownRef.current = false;
        }, 1000);
    };

    

    return (
        <>
            <Card
                onClick={() => {
                    if (openComment) setOpenComment(false);
                }}
                sx={(theme) => mainCardContent(theme, openInfo)}
            >
                <Box sx={viewContentContainer} >


                    {/* FOR MOBILE */}
                    <Box sx={(theme) => mobileNameDescriptionContainer(theme, expanded)}>

                        <Typography gutterBottom variant="h5" component="h1" sx={nameRecipe}>
                            {popularData.pop_list[activeVideo]?.recipe_name}
                        </Typography>
                        <Typography
                            variant="body2"
                            onClick={() => setExpanded(prev => !prev)}
                            sx={(theme) => descriptionRecipe(theme, expanded)}
                        >
                            {popularData.pop_list[activeVideo]?.description}
                        </Typography>

                    </Box>
                    {/* FOR MOBILE */}




                    
                    <Swiper
                        onSwiper={(swiper) => (swiperRef.current = swiper)}
                        touchReleaseOnEdges
                        direction="vertical"
                        slidesPerView={1}
                        mousewheel={{
                            thresholdTime: 1000,
                        }}
                        virtual
                        freeMode={false}
                        touchRatio={1.5}
                        threshold={20}
                        allowTouchMove={true}
                        simulateTouch={true}
                        onSlideChange={(swiper) => {
                            const newIndex = swiper.activeIndex;
                            const oldIndex = swiper.previousIndex;

                            if (newIndex === activeVideo) return;

                            setActiveVideo(newIndex);

                            if (openComment) setOpenComment(false);

                            if (newIndex > oldIndex) {
                                handleNewVideo();
                            } 

                        }}
                        modules={[Virtual, Mousewheel]}
                        style={{ height: '100%', zIndex: 3 }}
                    >
                        {popularData.pop_list.map((item, index) => (
                            popularData.status && index >= popularData.pop_list.length - 1 ?
                                <Box key={index} style={{ margin: '0 auto', width: '100%', height: '100%', display: "inline-flex", justifyContent: 'center', overflow: "none" }}>
                                    <CircularProgress color="secondary" size="35px" />
                                </Box>
                                :
                                <SwiperSlide key={item.config_id} virtualIndex={index}>
                                    <Box sx={{ width: '100%', height: '100%', borderRadius: '20px 20px 0 20px' }}>
                                        <MediaSwiper configId={item.config_id} />
                                        {/* activeVideo={activeVideo} */}
                                    </Box>
                                </SwiperSlide>
                        ))}
                    </Swiper>
                    {/* }  */}


                    {
                        popularData.pop_list[activeVideo] &&
                        <Box sx={containerActiveInfo}>

                            <InfoAboutContent props={{
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

                            <Box sx={containerSwichBtns}>
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
                                ><KeyboardDoubleArrowUpIcon sx={{ mb: '2px', [theme.breakpoints.down('md')]: { width: "19px", height: '19px' } }}></KeyboardDoubleArrowUpIcon></Box>
                                <Box
                                    sx={mainBtnsPopular}
                                    onClick={() => {
                                        handleCooldown(() => {
                                            
                                            if (activeVideo + 1 < popularData.pop_list.length || !errorPopular.error) {
                                                const newIndex = activeVideo + 1;
                                                swiperRef.current?.slideTo(newIndex);
                                                setActiveVideo(newIndex);
                                                handleNewVideo();
                                                dispatch(updateViews({config_id:popularData.pop_list[newIndex].config_id}));
                                            }

                                            if (openComment) {
                                                setOpenComment(false);
                                            }
                                        });
                                    }}
                                ><KeyboardDoubleArrowDownIcon sx={{ [theme.breakpoints.down('md')]: { width: "19px", height: '19px' } }}></KeyboardDoubleArrowDownIcon>
                                </Box>
                            </Box>
                        </Box>
                    }
                </Box>

            </Card>
            <Box
                ref={commentRef}
                sx={(theme) => mainContainerInfoComments(theme, openInfo, openComment)}>

                <Box
                    onClick={() => setOpenInfo(!openInfo)}
                    sx={btnOpenInfoMobile}>
                    <KeyboardArrowLeftIcon sx={{
                        width: "35px",
                        height: "35px",
                        transition: 'transform 0.3s ease-in-out',
                        transform: openInfo ? 'rotate(180deg)' : 'rotate(0deg)'
                    }}
                    ></KeyboardArrowLeftIcon>
                </Box>

                <Typography gutterBottom variant="h5" component="h1" sx={mainNameRecipe}>
                    {popularData.pop_list[activeVideo]?.recipe_name}
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={mainDescriptionRecipe}>
                    {popularData.pop_list[activeVideo]?.description}
                </Typography>
                {openComment ?

                    <MainComments config_id={popularData.pop_list[activeVideo]?.config_id} comments={popularData.pop_list[activeVideo]?.comments} ></MainComments>

                    :
                    <></>
                }
            </Box>


        </>

    )
}