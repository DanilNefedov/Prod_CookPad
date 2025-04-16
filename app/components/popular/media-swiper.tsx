import { MediaObj } from "@/app/types/types";
import { Box, CardMedia } from "@mui/material";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination } from 'swiper/modules';

import 'swiper/css';
import 'swiper/css/navigation';

import './styles.css';
import { useAppSelector } from "@/state/hook";
import { memo } from "react";
import { shallowEqual } from "react-redux";





// export function MediaSwiper({ props }: { props: dataPorps }) {
export const MediaSwiper = memo(({ activeVideo }: { activeVideo: number }) => {

    const media = useAppSelector(
        state => state.popular.pop_list[activeVideo]?.recipe_media || [],
        shallowEqual
    );

    console.log('media')
    return (

        <Swiper
            direction="horizontal"
            key={activeVideo}
            pagination={{
                dynamicBullets: true,
                clickable: true,
            }}
            className="swiper-popular"
            slidesPerView={'auto'}
            modules={[Pagination]}
            spaceBetween={2}

        >
            {media.map((elem: MediaObj) => (
                <SwiperSlide key={elem.media_id} className="slide-popular">
                    {elem.media_id === '' ? 
                    <Box sx={{width:'100%', height:'100%', backgroundColor: "background.default", }}></Box>
                    :
                    <Box >
                        {
                            elem.media_type === 'image' ?
                                <CardMedia
                                    sx={{
                                        height: '100%',
                                        objectFit: 'cover',
                                        width:'100%',
                                    }}
                                    component='img'
                                    src={elem.media_url as string}
                                    loading="lazy"
                                />
                                :
                                <CardMedia
                                    sx={{
                                        height: '100%',
                                        objectFit: 'cover',
                                        width:'100%',
                                    }}
                                    component='video'
                                    autoPlay
                                    loop
                                    muted
                                    poster={elem.media_url as string}
                                >
                                    <source
                                        src={elem.media_url as string}
                                        type="video/mp4"
                                    />
                                </CardMedia>
                        }
                    </Box>
                    }
                    

                </SwiperSlide>
            ))}
        </Swiper>

    )
},);
