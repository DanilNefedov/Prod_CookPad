"use client"

import { containerContentRecipe, contentBlock, contentContainer } from "@/app/(main)/cook/[recipe_id]/styles";
import { useAppDispatch, useAppSelector } from "@/state/hook";
import { setFavoriteRecipe } from "@/state/slices/recipe-slice";
import { Box, Container, IconButton, List, Typography } from "@mui/material";
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
import { useEffect } from "react";
import { fetchCook } from "@/state/slices/cook";
import { usePathname } from "next/navigation";




export function ContentCook() {

    const dispatch = useAppDispatch()
    const cookStore = useAppSelector(state => state.cook)
    const userStore = useAppSelector(state => state.user)
    const pathName = usePathname()
    const segments = pathName.split("/"); 
    const recipe_id = segments[2]; 

    const id = userStore.user.connection_id
    const findCook = cookStore.recipes.find(el => el.recipe_id === recipe_id)

    useEffect(() => {
        if (!findCook && userStore.user.connection_id !== '') {
            dispatch(fetchCook({ id, recipe_id}))
        }

    }, [id, recipe_id, dispatch, findCook, userStore.user.connection_id]);


    const handlerFavorite = ({ recipe_id }: { recipe_id: string | undefined }): void => {
        if (recipe_id !== '' && recipe_id) {
            if (findCook && id !== '') {
                const data = { connection_id: id, recipe_id, favorite: findCook?.favorite }
                dispatch(setFavoriteRecipe(data))
            }
        }
    }

    return (
        <Box sx={containerContentRecipe}>
            {/* <Typography variant='h1' sx={{ fontSize: '1.3rem', mb: '10px' }}>{findCook?.recipe_type}</Typography> */}


            <Box sx={{width:"100%", height:'100%', overflow:'auto' }}>


                 <Swiper
                    modules={[Navigation]}
                    className="swiper-cook-media-main"
                    navigation={{
                        prevEl: '.btn-prev-cook-media',
                        nextEl: '.btn-next-cook-media',

                    }}
                >
                    {findCook?.media.map(el => (
                        <SwiperSlide key={el.media_id} className={el.media_type === 'image' ? 'cook-media-main-slide' : 'cook-media-main-slide-video'} >
                            <SwiperMediaCook props={{ el }}></SwiperMediaCook>
                        </SwiperSlide>

                    ))}

                    <Box className='btn-next-cook-media' sx={{
                        borderRadius: '50%', backgroundColor: 'background.paper', width: '35px', height: '35px', right:"5px" }}>
                        <ArrowRightIcon viewBox="3 3 17 17" sx={{ fontSize: 35, opacity: '0.5', position:"relative",right:'1px', top:'-1px'  }}></ArrowRightIcon>
                    </Box>
                    <Box className='btn-prev-cook-media' sx={{
                        borderRadius: '50%', backgroundColor: 'background.paper', width: '35px', height: '35px', left:'5px'}}>
                        <ArrowLeftIcon viewBox="3 3 17 17" sx={{ fontSize: 35, opacity: '0.5', position:"relative",left:'-2px', top:'-1px' }}></ArrowLeftIcon>
                    </Box>
                </Swiper> 









                {/* <Box sx={{ ...contentBlock, }}>
                    <Box sx={contentContainer}>
                        <Typography variant="h2" fontSize={'2rem'}>{findCook?.name}</Typography>
                        <Typography variant="body1" sx={{ m: '8px 0' }}>{findCook?.description}</Typography>

                        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                            <Typography color={'text.secondary'}>Time: {findCook?.time.hours}h : {findCook?.time.minutes}m</Typography>
                            <IconButton sx={{ padding: '0' }} aria-label="add to favorites" onClick={() => handlerFavorite({ recipe_id: findCook?.recipe_id })}>
                                {findCook?.favorite ? <FavoriteIcon sx={favoriteBtnActive} /> : <FavoriteIcon sx={favoriteBtnDesactive} />}
                            </IconButton>

                        </Box>

                        <Box >

                            <Typography variant="h3" fontSize={'1.4rem'} align="center">Ingredients</Typography>
                            <Box sx={{ '& .swiper': { position: 'static', m: '0 15px'}, p:'0', position:'relative' }}>
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
                            </Box>
                        </Box>

                        <Box>
                            <Typography variant="h3" fontSize={'1.4rem'} align="center">Instruction</Typography>
                            <Typography variant="body1" sx={{wordWrap:'break-word', mt:'5px'}}>{findCook?.instruction}</Typography>
                        </Box>
                    </Box>

                </Box>
 */}

                {/* <Swiper
                    modules={[Navigation]}
                    className="swiper-cook-media-main"
                    navigation={{
                        prevEl: '.btn-prev-cook-media',
                        nextEl: '.btn-next-cook-media',

                    }}
                >
                    {findCook?.media.map(el => (
                        <SwiperSlide key={el.media_id} className={el.media_type === 'image' ? 'cook-media-main-slide' : 'cook-media-main-slide-video'} >
                            <SwiperMediaCook props={{ el }}></SwiperMediaCook>
                        </SwiperSlide>

                    ))}

                    <Box className='btn-next-cook-media' sx={{
                        borderRadius: '50%', backgroundColor: 'background.paper', width: '35px', height: '35px', right:"5px" }}>
                        <ArrowRightIcon viewBox="3 3 17 17" sx={{ fontSize: 35, opacity: '0.5', position:"relative",right:'1px', top:'-1px'  }}></ArrowRightIcon>
                    </Box>
                    <Box className='btn-prev-cook-media' sx={{
                        borderRadius: '50%', backgroundColor: 'background.paper', width: '35px', height: '35px', left:'5px'}}>
                        <ArrowLeftIcon viewBox="3 3 17 17" sx={{ fontSize: 35, opacity: '0.5', position:"relative",left:'-2px', top:'-1px' }}></ArrowLeftIcon>
                    </Box>
                </Swiper> */}

            </Box>


        </Box >
    )
}