"use client"

import { containerContent, containerIngr, containerSwiperInfo, descriptionInstruction, instruction,
     mediaContainer, scrollContainer, secondHeader, skeletonIngredients, swiperContainer} from "@/app/(main)/cook/styles";
import { useAppDispatch, useAppSelector } from "@/state/hook";
import { Box, Skeleton, Typography } from "@mui/material";
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/grid';
import './styles.css';
import { Navigation, Virtual } from "swiper/modules";
import ArrowRightIcon from '@mui/icons-material/ArrowRight';
import ArrowLeftIcon from '@mui/icons-material/ArrowLeft';
import { useEffect } from "react";
import { fetchCook } from "@/state/slices/cook-slice";
import { usePathname } from "next/navigation";
import { arrowFullTemplate, skeletonSwiperCook } from "@/app/styles";
import { arrowSwiper } from "@/app/(main)/home/styles";
import SwiperMediaCook from "./SwiperMedia";
import dynamic from "next/dynamic";
import ActionInfoRecipe from "./ActionInfoRecipe";

const IngredientSwiper = dynamic(() => import("./IngredientSwiper"), { 
    ssr: false ,
    loading: () => (
        <Skeleton 
        variant="rectangular" 
        sx={skeletonIngredients} 
        />
    ),
});





export function ContentCook() {
    const pathName = usePathname()
    const segments = pathName.split("/");
    const recipe_id = segments[2];

    const dispatch = useAppDispatch()
    const cookRecipe = useAppSelector(state => state.cook.recipes[recipe_id])
    const user_id = useAppSelector(state => state.user.user.connection_id)
    const recipeStatus = useAppSelector(state => state.cook.operations.fetchCook.loading)

    
    useEffect(() => {
        if (!user_id) return; 
        if (!cookRecipe) {
            dispatch(fetchCook({ id: user_id, recipe_id }));
        }
    }, [recipe_id, cookRecipe, user_id, dispatch]);



    return (
        <Box sx={containerContent}>
            <Box sx={scrollContainer}>
                <Box sx={containerSwiperInfo}>
                    {
                        recipeStatus ? 
                        <Skeleton variant="rectangular" sx={[mediaContainer, skeletonSwiperCook]}/>
                        :
                        <Swiper
                            modules={[Navigation, Virtual]}
                            virtual
                            slidesPerView={1}
                            className="swiper-cook-media-main"
                            navigation={{
                                prevEl: '.btn-prev-cook-media',
                                nextEl: '.btn-next-cook-media',
                            }}
                        >
                            {cookRecipe?.media
                                .slice()
                                .sort((a, b) => Number(b.main) - Number(a.main))
                                .map((el, index) => (
                                    <SwiperSlide virtualIndex={index} key={el.media_id} className={el.media_type === 'image' ? 'cook-media-main-slide' : 'cook-media-main-slide-video'} >
                                        <SwiperMediaCook props={{ el }}></SwiperMediaCook>
                                    </SwiperSlide>
                                )
                            )}

                            <Box className='btn-next-cook-media' sx={arrowFullTemplate}>
                                <ArrowRightIcon viewBox="2 2 20 20" sx={arrowSwiper}></ArrowRightIcon>
                            </Box>
                            <Box className='btn-prev-cook-media' sx={arrowFullTemplate}>
                                <ArrowLeftIcon viewBox="3 2 20 20" sx={arrowSwiper}></ArrowLeftIcon>
                            </Box>
                        </Swiper>
                    }

                
                    <ActionInfoRecipe recipe_id={recipe_id}></ActionInfoRecipe>
                </Box>

                <Box sx={containerIngr}>
                    <Typography variant="h3" sx={secondHeader}>Ingredients</Typography>
                    <Box sx={swiperContainer}>

            
                        {
                            cookRecipe?.ingredients && cookRecipe?.ingredients.length > 0 ?
                            (<IngredientSwiper recipe_id={recipe_id}></IngredientSwiper>)
                            :
                            <Skeleton variant="rectangular" sx={skeletonIngredients}/>
                        }
                        
                    </Box>
                    <Box>
                        <Typography variant="h3" sx={secondHeader}>Instruction</Typography>
                        <Typography variant="body1" sx={[descriptionInstruction, instruction]}>

                            {recipeStatus ? 
                                <Skeleton variant="text" height={80}></Skeleton>
                                :
                                <>{cookRecipe?.instruction}</>
                            }
                            
                        </Typography>
                    </Box>
                </Box>
            </Box>

        </Box >
    )
}