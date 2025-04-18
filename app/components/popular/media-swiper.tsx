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
            pagination={
                media.length > 1
                    ? {
                          dynamicBullets: true,
                          clickable: true,
                      }
                    : false
            }
            className="swiper-popular"
            slidesPerView={'auto'}
            modules={media.length > 1 ? [Pagination] : []}
            spaceBetween={2}
            style={{zIndex:5, position:'relative', borderRadius: '20px 20px 0 20px',}}
        >
            {media.map((elem: MediaObj) => (
               
                <SwiperSlide key={elem.media_id} className="slide-popular" >
                    <Box sx={{width:'100%', height:'100%', borderRadius: '20px 20px 0 20px',}}>
                       {
                            elem.media_type === 'image' ?
                                <CardMedia
                                    sx={{
                                        height: '100%',
                                        objectFit: 'cover',
                                        width:'100%',
                                        borderRadius: '20px 20px 0 20px',
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
                                        borderRadius: '20px 20px 0 20px',
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
                    

                </SwiperSlide>
            
            
            )

            )}
        </Swiper>

    )
},);
