'use client'

import { useAppDispatch, useAppSelector } from "@/state/hook";
import { popularFetch, updateViews, } from "@/state/slices/popular-slice";
import { Box, Card, CircularProgress, Typography } from "@mui/material";
import { useCallback, useEffect, useRef, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { MediaSwiper } from "./MediaSwiper";
import { MainComments } from "./MainComments";
import 'swiper/css';
import 'swiper/css/navigation';
import './styles.css';
import { InfoAboutContent } from "./InfoAboutContent";
import {
    boxMediaSwiper,boxProgress,btnOpenInfoMobile, commentModileArrow, containerActiveInfo, containerNameDescription, 
    containerSwichBtns, descriptionRecipe, mainArrowIcon, mainBtnsPopular, mainCardContent,
    mainContainerInfoComments, mainDescriptionRecipe, mainNameRecipe, nameRecipeMobile, viewContentContainer
} from "@/app/(main)/popular/styles";
import { Mousewheel, Virtual } from 'swiper/modules'
import type { Swiper as SwiperType } from 'swiper/types';
import { theme } from "@/config/ThemeMUI/theme";
import KeyboardDoubleArrowDownIcon from '@mui/icons-material/KeyboardDoubleArrowDown';
import KeyboardDoubleArrowUpIcon from '@mui/icons-material/KeyboardDoubleArrowUp';
import KeyboardArrowLeftIcon from '@mui/icons-material/KeyboardArrowLeft';
import { usePingGate } from "@/app/hooks/usePing";
import { initCommentsState } from "@/state/slices/comments-popular-slice";
import { centerFlexBlock, textMaxWidth } from "@/app/styles";




export function MainPopular() {

    const dispatch = useAppDispatch()
    const popularStore = useAppSelector(state => state.popular.pop_list);
    const popularStatusLoading = useAppSelector(state => state.popular.operations.popularFetch)
    const userStore = useAppSelector(state => state.user);
    const errorState = useAppSelector(state => state.popular.operations.popularFetch.error);
    const connection_id = userStore?.user?.connection_id;
    const [activeVideo, setActiveVideo] = useState<number>(0);
    const [openComment, setOpenComment] = useState<boolean>(false);
    const viewedVideos = useRef<Set<string>>(new Set());
    const swiperRef = useRef<SwiperType | null>(null);
    const cooldownRef = useRef<boolean>(false);
    const [openInfo, setOpenInfo] = useState<boolean>(false)
    const [expanded, setExpanded] = useState(false);
    const commentRef = useRef<HTMLDivElement | null>(null);
    const pingGate = usePingGate()
    const isFetching = useAppSelector(state => state.popular.operations.popularFetch.loading)
    const configId = popularStore[activeVideo]?.config_id;
    const initialFetchDone = useRef(false);
 
    
    
    useEffect(() => {        
        dispatch(initCommentsState(configId))
    },[configId, activeVideo, dispatch])
    


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
        if (!connection_id || errorState || initialFetchDone.current ) return;//|| initialFetchDone.current

        pingGate(() => {
            dispatch(popularFetch({ more:false, connection_id, count: 5, getAllIds: null }))
            initialFetchDone.current = true;
        });
    }, [connection_id, errorState, dispatch, pingGate]);


    useEffect(() => {
        if (popularStore.length === 0 || errorState) {
            return;
        }
        const currentRecipe = popularStore[activeVideo];

        if (currentRecipe && !viewedVideos.current.has(currentRecipe.config_id)) {
            viewedVideos.current.add(currentRecipe.config_id);
            dispatch(updateViews({ config_id: currentRecipe.config_id }));
        }
    }, [activeVideo, popularStore, dispatch, errorState]);


    function handleNewVideo() {
        if (isFetching || errorState) return;

        const remaining = popularStore.filter(item => !viewedVideos.current.has(item.config_id)).length;

        if (remaining <= 4){
            pingGate(() => {
                if (connection_id ) {
                    dispatch(popularFetch({
                        more:true,
                        connection_id,
                        count: 1,
                        getAllIds: popularStore.map(item => item.config_id)
                    }))
                } 
            });
        }
    
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
        if (cooldownRef.current || errorState) return;
        cooldownRef.current = true;
        callback();
        setTimeout(() => {
            cooldownRef.current = false;
        }, 1000);
    };
    
    return (
        <>
            <Card
                onClick={(event) => {
                    if( window.innerWidth <= 768 &&
                        openComment &&
                        commentRef.current &&
                        !commentRef.current.contains(event.target as Node)
                    ){
                        setOpenComment(false);
                    }
                    // if (openComment) setOpenComment(false);
                }}
                sx={[mainCardContent, centerFlexBlock, 
                    {[theme.breakpoints.down(1030)]: {
                        pr: openInfo ? '30px' : '0'
                    }}
                ]}
            >
                <Box sx={viewContentContainer} >


                    {/* FOR MOBILE */}
                    <Box sx={(theme) => containerNameDescription(theme, expanded)}>

                        <Typography gutterBottom variant="h5" component="h1" sx={[nameRecipeMobile, textMaxWidth]}>
                            {popularStore[activeVideo]?.recipe_name}
                        </Typography>
                        <Typography
                            variant="body2"
                            onClick={() => setExpanded(prev => !prev)}
                            sx={[descriptionRecipe, 
                                {
                                    wordBreak: expanded ? 'break-word' : 'break-all',
                                    whiteSpace: expanded ? 'normal' : 'nowrap',
                                }
                            ]}
                        >
                            {popularStore[activeVideo]?.description}
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
                        {popularStore.map((item, index) => (
                            popularStatusLoading && index >= popularStore.length - 1 ?
                                <Box key={index} style={boxProgress}>
                                    <CircularProgress color="secondary" size="35px" />
                                </Box>
                                :
                                <SwiperSlide key={item.config_id} virtualIndex={index}>
                                    <Box sx={boxMediaSwiper}>
                                        <MediaSwiper configId={item.config_id} />
                                        {/* activeVideo={activeVideo} */}
                                    </Box>
                                </SwiperSlide>
                        ))}
                    </Swiper>
                    {/* }  */}


                    {
                        popularStore[activeVideo] &&
                        <Box sx={containerActiveInfo}>

                            <InfoAboutContent props={{
                                author: popularStore[activeVideo]?.author_info,
                                likes: popularStore[activeVideo]?.likes,
                                liked: popularStore[activeVideo]?.liked,
                                saved: popularStore[activeVideo]?.saved,
                                saves: popularStore[activeVideo]?.saves,
                                comments: popularStore[activeVideo]?.comments,
                                config_id: configId,
                                openComment,
                                toggleComment
                            }}></InfoAboutContent>

                            <Box sx={containerSwichBtns}>
                                <Box
                                    sx={[mainBtnsPopular, centerFlexBlock]}
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
                                ><KeyboardDoubleArrowUpIcon sx={[mainArrowIcon, {mb: '2px'}]}></KeyboardDoubleArrowUpIcon></Box>
                                <Box
                                    sx={[mainBtnsPopular, centerFlexBlock]}
                                    onClick={() => {
                                        handleCooldown(() => {
                                            
                                            if (activeVideo + 1 < popularStore.length || !errorState) {
                                                const newIndex = activeVideo + 1;
                                                swiperRef.current?.slideTo(newIndex);
                                                setActiveVideo(newIndex);
                                                // handleNewVideo();
                                                dispatch(updateViews({config_id:popularStore[newIndex].config_id}));
                                            }

                                            if (openComment) {
                                                setOpenComment(false);
                                            }
                                        });
                                    }}
                                ><KeyboardDoubleArrowDownIcon sx={mainArrowIcon}></KeyboardDoubleArrowDownIcon>
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
                    onClick={() => {
                        if(openInfo && openComment){
                            setOpenComment(false)
                        }
                        setOpenInfo(!openInfo)
                        
                    }}
                    sx={btnOpenInfoMobile}
                >
                    <KeyboardArrowLeftIcon sx={[commentModileArrow,
                    {transform: openInfo ? 'rotate(180deg)' : 'rotate(0deg)'}
                    ]}
                    ></KeyboardArrowLeftIcon>
                </Box>

                <Typography gutterBottom variant="h5" component="h1" sx={mainNameRecipe}>
                    {popularStore[activeVideo]?.recipe_name}
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={mainDescriptionRecipe}>
                    {popularStore[activeVideo]?.description}
                </Typography>
                {openComment ?

                    <MainComments config_id={configId} comments={popularStore[activeVideo]?.comments} ></MainComments>

                    :
                    <></>
                }
            </Box>


        </>

    )
}