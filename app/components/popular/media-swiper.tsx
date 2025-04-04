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




interface DataPropsT {
    activeVideo: number,
}

// export function MediaSwiper({ props }: { props: dataPorps }) {
export const MediaSwiper = memo(({ props }: { props: DataPropsT }) => {

    const { activeVideo } = props
    const media = useAppSelector(
        state => state.popular.pop_list[activeVideo]?.recipe_media || [],
        shallowEqual
    );    

    console.log('media')
    return (

        <Swiper
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
                     {
                        elem.media_type === 'image' ?
                        <CardMedia
                            sx={{
                                height: '100%',
                                objectFit: 'cover',
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
                </SwiperSlide>
            ))}
        </Swiper>
        
    )
}, (prevProps, nextProps) => {
    return prevProps.props.activeVideo === nextProps.props.activeVideo
});
