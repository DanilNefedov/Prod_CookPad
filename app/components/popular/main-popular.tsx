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
import KeyboardDoubleArrowDownIcon from '@mui/icons-material/KeyboardDoubleArrowDown';
import KeyboardDoubleArrowUpIcon from '@mui/icons-material/KeyboardDoubleArrowUp';
import KeyboardArrowLeftIcon from '@mui/icons-material/KeyboardArrowLeft';

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
    const [openInfo, setOpenInfo] = useState<boolean>(false)
    const [expanded, setExpanded] = useState(false);
    const commentRef = useRef<HTMLDivElement | null>(null);
    

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (
                window.innerWidth <= 769 &&
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




    console.log('main-popular',)

    //769769769769769769769
    //1024
    return (
        <>


            <Card
                sx={{
                    position: 'relative',
                    overflow: 'initial',
                    boxShadow: 'none',
                    m: '0 auto',
                    backgroundSize: 'cover',
                    backgroundColor: '#353842',
                    borderRadius: '20px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    alignSelf: "center",
                    height: 'calc(100vh)',
                    width: 'calc((100vh - 40px) * (9 / 16))',
                    py: '20px',
                    [theme.breakpoints.down(1030)]: {
                        pr: openInfo ? '30px' : '0'
                    },
                    // [theme.breakpoints.down('md')]: {
                    //     // justifyContent: 'space-between',
                    //     m: 'initial'
                    // },
                    [theme.breakpoints.down(769)]: {
                        p: '0',
                        m: '0 auto',
                        maxWidth: '100%'
                    }
                }}>
                <Box sx={{


                    width: "100%",
                    aspectRatio: "9 / 16",
                    backgroundColor: "background.default",
                    borderRadius: '20px 20px 0 20px',
                    position: 'relative',
                    [theme.breakpoints.down(769)]: {
                        borderRadius: '20px 20px 20px 20px'
                    }
                }} >
                    <Box sx={{
                        display: 'none',
                        position: 'absolute',
                        zIndex: "150",
                        bottom: "0",
                        left: '0px',
                        width: '100%',
                        p: "0 65px 0 15px",
                        background: expanded ? `linear-gradient(
                           180deg,
                            hsl(0 0% 6% / 0.02) 0%,  
                            hsl(0 0% 0% / 0.34) 20%,
                            hsl(0 0% 0% / 0.54) 40%,
                            hsl(0 0% 0% / 0.69) 60%,
                            hsl(0 0% 0% / 0.8) 80%,
                            hsl(0 0% 0% / 0.9) 100%
                        )`: 'none',
                        // bgcolor:'rgba(31, 33, 40, 0.55)',
                        borderRadius: '0px 0 0px 20px',
                        [theme.breakpoints.down(769)]: {
                            display: 'block'
                        }
                    }}>
                        <Typography gutterBottom variant="h5" component="h1" sx={{
                            flexShrink: 0, textOverflow: 'ellipsis', pb: '5px', lineHeight: 'none', mb: '0', whiteSpace: 'nowrap', overflow: 'hidden',
                            fontSize: '16px'
                        }}>
                            {popularData.pop_list[activeVideo]?.recipe_name}
                        </Typography>
                        <Typography
                            variant="body2"
                            onClick={() => setExpanded(prev => !prev)}
                            sx={{
                                cursor: 'pointer',
                                fontSize: '14px',
                                pb: '15px',
                                flexShrink: 0,
                                display: 'block',
                                wordBreak: expanded ? 'break-word' : 'break-all',
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                                whiteSpace: expanded ? 'normal' : 'nowrap',
                                transition: "0.3s"
                            }}
                        >
                            {popularData.pop_list[activeVideo]?.description + "adsa kjdbasjkd basdasjdsjadgjkasgdjhasgdjhgashjdgashdb asjkdasdasjkdhkasdhj ashjdjasdjkasdjkasb jdasjkd asjkdasgdkjas"}
                        </Typography>

                    </Box>



                    <Swiper
                        onSwiper={(swiper) => (swiperRef.current = swiper)}
                        touchReleaseOnEdges
                        direction="vertical"
                        slidesPerView={1}
                        mousewheel={{
                            thresholdTime: 1000,
                        }}
                        effect="none"
                        virtual
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
                        style={{ height: '100%', zIndex: 3 }}
                    >
                        {popularData.pop_list.map((item, index) => (
                            <SwiperSlide key={item.config_id} virtualIndex={index} >
                                <Box sx={{ width: '100%', height: '100%', borderRadius: '20px 20px 0 20px', }}>
                                    <MediaSwiper activeVideo={activeVideo} />
                                </Box>


                            </SwiperSlide>
                        ))}
                    </Swiper>




                    {
                        popularData.pop_list[activeVideo] &&
                        <Box sx={{

                            position: "absolute",
                            bottom: '0',
                            right: '-79px',
                            zIndex: 2,
                            display: 'flex',
                            flexDirection: 'column-reverse',
                            alignItems: 'center',
                            gap: '20px',
                            [theme.breakpoints.down('md')]: {
                                width: '65px',
                                height: '265px',
                                right: '-64px',
                                // top: 'calc(50% - 122px)',
                            },
                            [theme.breakpoints.down(769)]: {
                                right: "0",
                                zIndex: 100
                            }
                        }}>
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

                            <Box sx={{
                                display: 'flex',
                                flexDirection: 'column',
                                gap: '20px',
                                width: "50px",
                                [theme.breakpoints.down('md')]: {
                                    width: "35px"
                                },
                                [theme.breakpoints.down(769)]: {
                                    display: "none"
                                }
                            }}>
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
                                ><KeyboardDoubleArrowDownIcon sx={{ [theme.breakpoints.down('md')]: { width: "19px", height: '19px' } }}></KeyboardDoubleArrowDownIcon>
                                </Box>



                            </Box>
                        </Box>

                    }

                </Box>

            </Card>





            <Box
                ref={commentRef}
                sx={{
                    backgroundColor: "background.default",
                    // flexGrow: '1', 
                    // overflow: 'auto',
                    display: 'flex',
                    flexDirection: 'column',
                    borderRadius: '20px',
                    p: '10px 20px',
                    width: "100%",
                    maxWidth: '450px',
                    maxHeight: 'calc(100vh - 40px)',
                    minHeight: 'calc(100vh - 40px)',
                    position: "relative",
                    transition: '0.3s',
                    // top: 0,
                    // right: 0,
                    height: "100%",
                    [theme.breakpoints.down(1250)]: { maxWidth: '42%' },
                    [theme.breakpoints.down(1030)]: {
                        width: '300px',
                        minWidth: '300px',
                        marginRight: openInfo ? '0' : "calc(-275px - 50px)"
                    },
                    [theme.breakpoints.down('md')]: {
                        width: '300px',
                        minWidth: '300px',
                        marginRight: openInfo ? '0' : "calc(-265px - 50px)"
                    },
                    [theme.breakpoints.down(769)]: {
                        mr: '0',
                        width: 'calc((100vh - 40px) * (9 / 16))',
                        maxWidth: 'calc(100% + 2px)',
                        bottom: openComment ? '0%' : "-100%",
                        p: '20px ',

                        // mb:openComment ? '0%' : '-150%',
                        position: 'absolute',
                        zIndex: '400',

                        borderRadius: '20px 20px 0 0',

                        // width: "100%",
                        // maxWidth: '450px',
                        maxHeight: '60%',
                        minHeight: '60%',
                        height: '100%',
                    }
                }}>


                <Box
                    onClick={() => setOpenInfo(!openInfo)}
                    sx={{
                        display: 'none',
                        position: "absolute",
                        backgroundColor: 'red',
                        width: "50px",
                        height: '50px',
                        top: '75px',
                        left: "-50px",
                        justifyContent: 'center',
                        alignItems: 'center',
                        borderRadius: '10px 0 0 10px',
                        bgcolor: 'background.default',
                        [theme.breakpoints.down(1030)]: { display: 'flex' },
                        [theme.breakpoints.down(769)]: {
                            display: 'none'
                        }
                    }}>
                    <KeyboardArrowLeftIcon sx={{
                        width: "45px",
                        height: "45px",
                        transition: 'transform 0.3s ease-in-out',
                        transform: openInfo ? 'rotate(180deg)' : 'rotate(0deg)'
                    }}
                    ></KeyboardArrowLeftIcon>
                </Box>

                <Typography gutterBottom variant="h5" component="h1" sx={{
                    flexShrink: 0, textOverflow: 'ellipsis', pb: '10px', lineHeight: 'none', mb: '0', whiteSpace: 'nowrap', overflow: 'hidden',
                    [theme.breakpoints.down('md')]: { fontSize: '20px', pb: '5px' },
                    [theme.breakpoints.down(769)]: {
                        display: "none"
                    }
                }}>
                    {popularData.pop_list[activeVideo]?.recipe_name}
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{
                    flexShrink: 0, fontSize: "16px", display: 'block', pb: '20px', wordBreak: 'break-all',
                    [theme.breakpoints.down('md')]: { fontSize: '14px', pb: '10px' },
                    [theme.breakpoints.down(769)]: {
                        display: "none"
                    }
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