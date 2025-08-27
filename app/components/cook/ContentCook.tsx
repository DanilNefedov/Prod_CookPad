"use client"

import { containerContent, containerInfo, containerIngr, containerSwiperInfo, containerTime, 
    descriptionInstruction, instruction, nameRecipe, scrollContainer, secondHeader, 
    swiperContainer} from "@/app/(main)/cook/styles";
import { useAppDispatch, useAppSelector } from "@/state/hook";
import { setFavoriteRecipe } from "@/state/slices/recipe-slice";
import { Box, IconButton, Typography } from "@mui/material";
import FavoriteIcon from '@mui/icons-material/Favorite';
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
import { IngredientSwiper } from "./IngredientSwiper";
import dynamic from "next/dynamic";
import { arrowFullTemplate, favoriteBtnActive, favoriteBtnDesactive, textMaxWidth } from "@/app/styles";
import { arrowSwiper } from "@/app/(main)/home/styles";


const SwiperMediaCook = dynamic(() => import('./SwiperMedia'), {
    ssr: false,
});
 

export function ContentCook() {

    const dispatch = useAppDispatch()
    const cookStore = useAppSelector(state => state.cook)
    const userStore = useAppSelector(state => state.user)
    const favoriteStatus = useAppSelector(state => state.recipe.operations.setFavoriteRecipe.loading)

    const pathName = usePathname()

    const segments = pathName.split("/");
    const recipe_id = segments[2];

    const id = userStore.user.connection_id
    const findCook = cookStore.recipes.find(el => el.recipe_id === recipe_id)


    useEffect(() => {
        if (!findCook && userStore.user.connection_id !== '') {
            dispatch(fetchCook({ id, recipe_id }))
        }

    }, [id, recipe_id, dispatch, findCook, userStore.user.connection_id]);


    const handleFavorite = ({ recipe_id }: { recipe_id: string | undefined }): void => {
        if(favoriteStatus) return

        if (recipe_id !== '' && recipe_id) {
            if (findCook && id !== '') {
                const data = { recipe_id, favorite: findCook?.favorite }
                dispatch(setFavoriteRecipe(data))
            }
        }
    }

    return (
        <Box sx={containerContent}>
            <Box sx={scrollContainer}>
                <Box sx={containerSwiperInfo}>
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
                        {findCook?.media
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


                    <Box sx={containerInfo}>
                        <Typography variant="h2" sx={[textMaxWidth, nameRecipe]}>{findCook?.name}</Typography>
                        <Typography variant="body1">Type: {findCook?.recipe_type}</Typography>
                        <Box sx={containerTime}>

                            <Typography
                            >Time: {findCook?.time.hours}h : {findCook?.time.minutes}m</Typography>
                            
                            <IconButton sx={{ padding: '0' }} aria-label="add to favorites" onClick={() => handleFavorite({ recipe_id: findCook?.recipe_id })}>
                                {findCook?.favorite ? <FavoriteIcon sx={favoriteBtnActive} /> : <FavoriteIcon sx={favoriteBtnDesactive} />}
                            </IconButton>

                        </Box>
                        <Typography sx={descriptionInstruction} variant="body1">Description: {findCook?.description}</Typography>
                    </Box>
                </Box>

                <Box sx={containerIngr}>
                    <Typography variant="h3" sx={secondHeader}>Ingredients</Typography>
                    <Box sx={swiperContainer}>
            
                        {
                        findCook?.ingredients && findCook?.ingredients.length > 0 &&
                        (<IngredientSwiper props={{findCook:findCook.ingredients, id}}></IngredientSwiper>)
                        }
                        
                    </Box>
                    <Box>
                        <Typography variant="h3" sx={secondHeader}>Instruction</Typography>
                        <Typography variant="body1" sx={[descriptionInstruction, instruction]}>{findCook?.instruction}</Typography>
                    </Box>
                </Box>
            </Box>

        </Box >
    )
}