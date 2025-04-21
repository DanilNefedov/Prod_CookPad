import { MediaObj } from "@/app/types/types";
import { Box, CardMedia, CircularProgress } from "@mui/material";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination } from 'swiper/modules';

import 'swiper/css';
import 'swiper/css/navigation';

import './styles.css';
import { memo, useState } from "react";
import { containerSlideMediaSwiper, mediaSwiperElement } from "@/app/(main)/popular/style";
import { useAppSelector } from "@/state/hook";
import { shallowEqual } from "react-redux";




export const MediaSwiper = memo(({ configId }: { configId: string }) => {
    const [loaded, setLoaded] = useState<Record<string, boolean>>({});
    
    const media = useAppSelector(
        state => {
            const item = state.popular.pop_list.find(item => item.config_id === configId);
            return item?.recipe_media || [];
        },
        shallowEqual 
    );



    // if (!media) {
    //     return (
    //         <Box style={{ margin: '0 auto', width: '100%', display: "inline-flex", justifyContent: 'center', overflow: "none" }}>
    //             <CircularProgress color="secondary" size="35px" />
    //         </Box>

    //     );
    // }

    return (

        <Swiper
            direction="horizontal"
            // key={activeVideo}
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
            style={{
                zIndex: 5, position: 'relative',

            }}
        >
            {media.map((elem: MediaObj) => (

                <SwiperSlide key={elem.media_id} className="slide-popular">
                    <Box sx={{ ...containerSlideMediaSwiper, position: 'relative' }}>
                        {(!loaded[elem.media_id]) && (
                            <Box
                                sx={{
                                    position: 'absolute',
                                    top: '50%',
                                    left: '50%',
                                    transform: 'translate(-50%, -50%)',
                                    zIndex: 10,
                                }}
                            >
                                <CircularProgress color="secondary" size="35px" />
                            </Box>
                        )}

                        {elem.media_type === 'image' ? (
                            <CardMedia
                                sx={{
                                    ...mediaSwiperElement,
                                    opacity: loaded[elem.media_id] ? 1 : 0,
                                    transition: 'opacity 0.3s ease',
                                }}
                                component='img'
                                src={elem.media_url as string}
                                loading="lazy"
                                onLoad={() => setLoaded(prev => ({ ...prev, [elem.media_id]: true }))}
                            />
                        ) : (
                            <CardMedia
                                sx={{
                                    ...mediaSwiperElement,
                                    opacity: loaded[elem.media_id] ? 1 : 0,
                                    transition: 'opacity 0.3s ease',
                                }}
                                component='video'
                                autoPlay
                                loop
                                muted
                                poster={elem.media_url as string}
                                onCanPlayThrough={() => setLoaded(prev => ({ ...prev, [elem.media_id]: true }))}
                            >
                                <source
                                    src={elem.media_url as string}
                                    type="video/mp4"
                                />
                            </CardMedia>
                        )}
                    </Box>
                </SwiperSlide>
            )

            )}
        </Swiper>

    )
}, (prevProps, nextProps) => {
    return prevProps.configId === nextProps.configId;
});


MediaSwiper.displayName = "MediaSwiper"