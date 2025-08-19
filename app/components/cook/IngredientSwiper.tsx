import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/grid';
import './styles.css';
import { Grid, Navigation } from "swiper/modules";
import { Swiper, SwiperSlide } from 'swiper/react';
import { ItemsIngrSwiper } from './ItemsIngrSwiper';
import { Box } from '@mui/material';
import ArrowRightIcon from '@mui/icons-material/ArrowRight';
import ArrowLeftIcon from '@mui/icons-material/ArrowLeft';
import { memo } from 'react';
import { Ingredients } from '@/app/(main)/cook/types';
import { ingredinetsArrow } from '@/app/(main)/cook/styles';

interface Props {
    findCook: Ingredients[] | undefined,
    id: string
}


export const IngredientSwiper = memo(({ props }: { props: Props }) => {

    const { findCook, id } = props;
    const itemCount = findCook?.length || 0;


    return (
        <Swiper
            style={{
                "--swiper-justify": itemCount === 3 ? "unset" : "center",
                "--swiper-margin": itemCount === 1 ? "0" : "0 10px 10px 0"
            } as React.CSSProperties}
            className='swiper-cook'
            navigation={{
                prevEl: '.btn-prev-cook',
                nextEl: '.btn-next-cook',
            }}
            modules={itemCount === 1 ? [Navigation] : itemCount === 2 ? [Grid, Navigation] : itemCount === 3 ? [Grid, Navigation] : [Grid, Navigation]}
            spaceBetween={itemCount === 1 ? 0 : 10}
            observer={true}
            observeParents={true}
            slidesPerView={itemCount === 1 ? 1 : itemCount === 2 ? 2 : itemCount === 3 ? 2 : 3}
            grid={
                itemCount >= 4
                    ? { rows: 2, fill: "column" }
                    : undefined

            }
            breakpoints={{
                0: {
                    slidesPerView: itemCount === 1 ? 1 : itemCount === 2 ? 1 : itemCount === 3 ? 1 : 1,
                    grid: itemCount >= 4 ? { rows: 2, fill: 'column' } : itemCount === 2
                        ? { rows: 2, fill: 'column' } : itemCount === 3 ? { rows: 2, fill: 'column' } : undefined,

                },
                450: {
                    slidesPerView: itemCount === 1 ? 1 : itemCount === 2 ? 1 : itemCount === 3 ? 2 : 2,
                    grid: itemCount === 2
                        ? { rows: 2, fill: 'column' }
                        : itemCount === 3
                            ? { rows: 2, fill: 'column' }
                            : { rows: 2, fill: 'column' },
                },
                600: {
                    slidesPerView: itemCount === 1 ? 1 : itemCount === 2 ? 1 : itemCount === 3 ? 2 : 3,
                    grid:
                        itemCount === 3
                            ? { rows: 2, fill: 'column' }
                            : itemCount >= 4
                                ? { rows: 2, fill: 'column' }
                                : itemCount === 2
                                    ? { rows: 2, fill: 'column' }
                                    : undefined,
                }
            }}
        >
            {findCook?.map(el => (
                <SwiperSlide key={el.ingredient_id} className='cook-slide'>
                    <ItemsIngrSwiper props={{ el, id }}></ItemsIngrSwiper>
                </SwiperSlide>
            ))}

               

        
            <Box className='btn-next-cook'>
                <ArrowRightIcon viewBox="3 3 17 17" sx={ingredinetsArrow}></ArrowRightIcon>
            </Box>
            <Box className='btn-prev-cook'>
                <ArrowLeftIcon viewBox="3 3 17 17" sx={ingredinetsArrow}></ArrowLeftIcon>
            </Box>
        </Swiper>
    );
},
(prevProps, nextProps) => {
    return prevProps.props.id === nextProps.props.id
})


IngredientSwiper.displayName = "IngredientSwiper"