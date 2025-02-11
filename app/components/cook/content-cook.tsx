"use client"

import { containerContentRecipe, contentBlock, contentContainer } from "@/app/(main)/cook/[recipe_id]/styles";
import { useAppDispatch, useAppSelector } from "@/state/hook";
import { fetchCook } from "@/state/slices/cook";
import { setFavoriteRecipe } from "@/state/slices/recipe-slice";
import { Box, Container, IconButton, List, Typography } from "@mui/material";
import { useEffect, useRef } from "react";
import FavoriteIcon from '@mui/icons-material/Favorite';
import { favoriteBtnActive, favoriteBtnDesactive } from "@/app/(main)/home/style";
import { Swiper, SwiperSlide } from 'swiper/react';
// Import Swiper styles
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/grid';
import './styles.css';
import { Grid, Navigation } from "swiper/modules";
// Import Swiper styles
import { ItemsIngrSwiper } from "./items-ingr-swiper";
import ArrowRightIcon from '@mui/icons-material/ArrowRight';
import ArrowLeftIcon from '@mui/icons-material/ArrowLeft';
import { SwiperMediaCook } from "./swiper-media";




export function ContentCook({ recipe_id }: { recipe_id: string }) {

    const dispatch = useAppDispatch()
    const cookStore = useAppSelector(state => state.cook)
    const userStore = useAppSelector(state => state.user)

    // const recipeStore = useAppSelector(state => state.recipe)

    // const thisRecipe = recipeStore.recipes.find(el => el.recipe_id === recipe_id)
    const id = userStore.user.connection_id
    const findCook = cookStore.recipes.find(el => el.recipe_id === recipe_id)

    // useEffect(() => {
    //     console.log(findCook, userStore.user.connection_id, cookStore)
    //     // async function fetchData() {
    //     if (!findCook && userStore.user.connection_id !== '') {
    //         console.log(findCook)
    //         dispatch(fetchCook({ id, recipe_id}))
    //         // dispatch(fetchNameLinks(id))
    //     }
    //     // }

    //     // fetchData();
    // }, [id, recipe_id]);
    // console.log(findCook, recipe_id, cookStore)

    // useEffect(() => {
    //     if (!findCook && userStore.user.connection_id !== '' && !isFetching) {
    //       dispatch(fetchCook({ id, recipe_id }))
    //     }
    //   }, [id, recipe_id, findCook, userStore.user.connection_id, dispatch, isFetching]);

    const effectRan = useRef(false);

    useEffect(() => {
        if (!findCook && userStore.user.connection_id !== '') {
            if (effectRan.current === false || typeof window === "undefined") {
                effectRan.current = true;
                console.log("Fetching recipe:", recipe_id);
                dispatch(fetchCook({ id, recipe_id }));
            }
        }
    }, [id, recipe_id, dispatch, findCook]);


    const handlerFavorite = ({ recipe_id }: { recipe_id: string | null | undefined }): void => {
        if (recipe_id !== null && recipe_id) {
            if (findCook && id !== '') {
                const data = { connection_id: id, recipe_id, favorite: findCook?.favorite }
                dispatch(setFavoriteRecipe(data))
            }
        }
    }

    return (
        <Container sx={containerContentRecipe}>
            <Typography variant='h1' sx={{ fontSize: '1.6rem', mb: '10px' }}>{findCook?.recipe_type}</Typography>


            <Box sx={{ display: 'flex', alignItems: 'center', maxHeight: '80vh' }}>
                <Box sx={{ ...contentBlock, }}>
                    <Box sx={contentContainer}>
                        <Typography variant="h2" fontSize={'2.75rem'}>{findCook?.name}</Typography>
                        <Typography variant="body1" sx={{ m: '15px 0' }}>{findCook?.description}</Typography>

                        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                            <Typography color={'text.secondary'}>Time: {findCook?.time.hours}h : {findCook?.time.minutes}m</Typography>
                            <IconButton sx={{ padding: '0' }} aria-label="add to favorites" onClick={() => handlerFavorite({ recipe_id: findCook?.recipe_id })}>
                                {findCook?.favorite ? <FavoriteIcon sx={favoriteBtnActive} /> : <FavoriteIcon sx={favoriteBtnDesactive} />}
                            </IconButton>

                        </Box>

                        <Box>

                            <Typography variant="h3" fontSize={'1.8rem'} align="center">Ingredients</Typography>
                            {/* change tag ul in DOM */}
                            <List sx={{ '& .swiper': { position: 'static', m: '0 15px' } }}>
                                <Swiper
                                    className='swiper-cook'
                                    navigation={{
                                        prevEl: '.btn-prev-cook',
                                        nextEl: '.btn-next-cook',

                                    }}
                                    slidesPerView={3}
                                    grid={{
                                        rows: findCook?.ingredients && findCook?.ingredients.length > 3 ? 2 : 1,
                                        fill: 'column'
                                    }}
                                    modules={[Grid, Navigation]}
                                    spaceBetween={10}

                                >
                                    {findCook?.ingredients.map(el => (
                                        <SwiperSlide key={el.ingredient_id} className='cook-slide'>
                                            <ItemsIngrSwiper props={{ el, id }}></ItemsIngrSwiper>

                                        </SwiperSlide>
                                    ))}

                                    <Box className='btn-next-cook'>
                                        <ArrowRightIcon viewBox="3 3 17 17" sx={{ fontSize: 35 }}></ArrowRightIcon>
                                    </Box>
                                    <Box className='btn-prev-cook'>
                                        <ArrowLeftIcon viewBox="3 3 17 17" sx={{ fontSize: 35 }}></ArrowLeftIcon>
                                    </Box>

                                </Swiper>
                            </List>
                        </Box>

                        <Box>
                            <Typography variant="h3" fontSize={'1.8rem'} align="center">Instruction</Typography>
                            <Typography variant="body1" >{findCook?.instruction}</Typography>
                        </Box>
                    </Box>

                </Box>


                <Swiper
                    modules={[Navigation]}
                    className="swiper-cook-media-main"
                    navigation={{
                        prevEl: '.btn-prev-cook-media',
                        nextEl: '.btn-next-cook-media',

                    }}
                // lazy={true}
                >
                    {findCook?.media.map(el => (
                        <SwiperSlide key={el.media_id} className={el.media_type === 'image' ? 'cook-media-main-slide' : 'cook-media-main-slide-video'} >
                            <SwiperMediaCook props={{ el }}></SwiperMediaCook>
                        </SwiperSlide>

                    ))}

                    <Box className='btn-next-cook-media'>
                        <ArrowRightIcon viewBox="3 3 17 17" sx={{ fontSize: 35, opacity: '0.5' }}></ArrowRightIcon>
                    </Box>
                    <Box className='btn-prev-cook-media'>
                        <ArrowLeftIcon viewBox="3 3 17 17" sx={{ fontSize: 35, opacity: '0.5' }}></ArrowLeftIcon>
                    </Box>
                </Swiper>

            </Box>


        </Container >
    )
}