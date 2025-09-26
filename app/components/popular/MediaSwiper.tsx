import { Box } from "@mui/material";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Virtual } from 'swiper/modules';
import { v4 as uuidv4 } from 'uuid';
import 'swiper/css';
import 'swiper/css/navigation';
import './styles.css';
import { memo,} from "react";
import { boxImg, containerSlideMediaSwiper, mediaSwiperElement } from "@/app/(main)/popular/styles";
import { useAppSelector } from "@/state/hook";
import { shallowEqual } from "react-redux";
import { CldImage, CldVideoPlayer } from "next-cloudinary";
import { videoContainer } from "@/app/(main)/home/styles";
import { RecipeMediaId } from "@/app/(main)/popular/types";




export const MediaSwiper = memo(({ configId }: { configId: string }) => {
    const media = useAppSelector(
        state => {
            const item = state.popular.pop_list.find(item => item.config_id === configId);
            return item?.recipe_media || [];
        },
    shallowEqual);

    const recipeName = useAppSelector(state => {
            const item = state.popular.pop_list.find(item => item.config_id === configId);
            return item?.recipe_name || [];
        },
    shallowEqual)

   
    return (

        <Swiper
            direction="horizontal"
            virtual
            pagination={
                media.length > 1
                    ? {
                        dynamicBullets: true,
                        clickable: true,
                    }
                    : false
            }
            className="swiper-popular"
            modules={media.length > 1 ? [Pagination, Virtual] : [Virtual]}
            spaceBetween={2}
            slidesPerView={1}
            style={{
                zIndex: 5, 
                position: 'relative',
            }}
        >
            {media.map((elem:RecipeMediaId, index) => {
                const uniqueId = uuidv4();
                return (

                <SwiperSlide key={elem.media_id} className="slide-popular" virtualIndex={index}>
                    <Box sx={containerSlideMediaSwiper}>
                       
                        {elem.media_type === 'image' ? (
                        
                            <Box sx={{...boxImg, '& img':mediaSwiperElement}}> 
                                <CldImage
                                    alt={recipeName as string}
                                    format="auto"
                                    id={uniqueId}
                                    sizes="100%"
                                    quality="auto"
                                    src={elem.media_url as string}
                                    loading={index === 0 ? "eager" : "lazy"}
                                    priority={index === 0}
                                    fill
                                />
                            </Box>
                            
                        ) : (
                            <Box 
                                sx={videoContainer}
                            > 
                                <CldVideoPlayer
                                    
                                    src={elem.media_url as string}
                                    id={uniqueId}
                                    width={900}
                                    height={1100}
                                    autoPlay={true}
                                    autoplay={true}
                                    playsinline={true}
                                    muted
                                    loop
                                    controls={false}
                                />
                            </Box>
                        )}
                    </Box>
                </SwiperSlide>
            )
            }
            

            )}
        </Swiper>

    )
}, (prevProps, nextProps) => {
    return prevProps.configId === nextProps.configId;
});


MediaSwiper.displayName = "MediaSwiper"