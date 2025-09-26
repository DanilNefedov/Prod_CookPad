import { arrowFullTemplate } from "@/app/styles";
import { Box } from "@mui/material";
import { memo} from "react";
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Virtual } from "swiper/modules";
import ArrowRightIcon from '@mui/icons-material/ArrowRight';
import ArrowLeftIcon from '@mui/icons-material/ArrowLeft';
import { arrowSwiper } from "@/app/(main)/home/styles";
import { useAppSelector } from "@/state/hook";
import { MediaSlide } from "./MediaSlide";




interface Props {
    recipe_id: string,
}

const SwiperMediaCook = memo(({ recipe_id }: Props ) => {
    const recipeMedia = useAppSelector(state => state.cook.recipes[recipe_id]?.media)
    const recipeName = useAppSelector(state => state.cook.recipes[recipe_id]?.name)

    return (
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

            {recipeMedia?.slice()
                .sort((a, b) => Number(b.main) - Number(a.main))
                .map((el, index) => (
                    <SwiperSlide virtualIndex={index} key={el.media_id} className={el.media_type === 'image' ? 'cook-media-main-slide' : 'cook-media-main-slide-video'} >
                        <MediaSlide el={el} recipeName={recipeName} priority={index === 0}></MediaSlide>
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
        

    )
}, )



SwiperMediaCook.displayName = "SwiperMediaCook"

export default SwiperMediaCook;