import { mediaContainer, skeletonMedia } from "@/app/(main)/cook/styles";
import { arrowFullTemplate, cardMedia, centerFlexBlock } from "@/app/styles";
import { Box, CardMedia, Skeleton } from "@mui/material";
import { memo, useEffect, useRef, useState } from "react";
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Virtual } from "swiper/modules";
import ArrowRightIcon from '@mui/icons-material/ArrowRight';
import ArrowLeftIcon from '@mui/icons-material/ArrowLeft';
import { arrowSwiper } from "@/app/(main)/home/styles";
import { useAppSelector } from "@/state/hook";




interface Props {
    recipe_id: string,
}

const SwiperMediaCook = memo(({ recipe_id }: Props ) => {
    
    const recipeMedia = useAppSelector(state => state.cook.recipes[recipe_id]?.media)
    const containerRef = useRef<HTMLDivElement | null>(null);
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const observer = new IntersectionObserver(
            entries => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        setIsVisible(true);
                        observer.disconnect();
                    }
                });
            },
            {
                rootMargin: '100px',
            }
        );

        if (containerRef.current) {
            observer.observe(containerRef.current);
        }

        return () => observer.disconnect();
    }, []);


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
            {recipeMedia
                .slice()
                .sort((a, b) => Number(b.main) - Number(a.main))
                .map((el, index) => (
                    <SwiperSlide virtualIndex={index} key={el.media_id} className={el.media_type === 'image' ? 'cook-media-main-slide' : 'cook-media-main-slide-video'} >
                        <Box sx={[centerFlexBlock, mediaContainer]} ref={containerRef}>
                            {el.media_type === 'image' ? (
                                <CardMedia
                                    alt='image'
                                    sx={cardMedia}
                                    component='img'
                                    src={el.media_url as string}
                                    loading="lazy"
                                />
                            ) : (
                                <CardMedia
                                    sx={cardMedia}
                                    component='video'
                                    autoPlay
                                    loop
                                    muted
                                    poster={el.media_url as string}
                                >
                                    <source
                                        src={el.media_url as string}
                                        type="video/mp4"
                                    />
                                </CardMedia>
                            ) 
                            // : (
                            //     <Skeleton variant="rectangular" sx={skeletonMedia}/>
                            // )
                            }
                        </Box>
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