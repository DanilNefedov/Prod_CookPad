'use client';

import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { Box, Collapse, Menu, MenuItem, useMediaQuery } from "@mui/material";
import IconButton from '@mui/material/IconButton';
import FavoriteIcon from '@mui/icons-material/Favorite';
import Link from "next/link";
import { arrowSwiper, boxTypeRecipe, cardBottom, containerMenu, containerMobileMenu, contentPostionAbsolute, 
    cookBtn, desktopBotInfo, headerCard, headerMove, mainCard, mobileBottomInfo, mobileButtons, 
    mobileMenu, 
    typeRecipe} from "@/app/(main)/home/styles";
import ArrowRightIcon from '@mui/icons-material/ArrowRight';
import ArrowLeftIcon from '@mui/icons-material/ArrowLeft';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css'; 
import 'swiper/css/navigation';
import './swiper-media.css';
import { Navigation, Virtual } from 'swiper/modules';
import { memo, useState } from "react";
import { useAppDispatch, useAppSelector } from '@/state/hook';
import { setFavoriteRecipe } from '@/state/slices/recipe-slice';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { newListRecipe } from '@/state/slices/list-recipe-slice';
import { arrowFullTemplate, favoriteBtnActive, favoriteBtnDesactive, textMaxWidth } from '@/app/styles';
import SwiperMediaCard from './SwiperMediaCard';





interface Props {
    recipe_id: string,
    id: string
}




export const CardContentBlock = memo(({ props }: { props: Props }) => {
    const { recipe_id, id } = props
    const recipe = useAppSelector((state) => state.recipe.recipes.find((el) => el.recipe_id === recipe_id));
    const isFavoriteLoading = useAppSelector((state) => state.recipe.operations.setFavoriteRecipe.loading);
    const isListLoading = useAppSelector((state) => state.listRecipe.operations.newListRecipe.loading);

    const dispatch = useAppDispatch();
    const isMobile = useMediaQuery('(max-width:799px)');

    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const openAdaptive = Boolean(anchorEl);
    const [ellipsisEnabled, setEllipsisEnabled] = useState(true);

    const handleClick = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleCloseAdaptive = () => {
        setAnchorEl(null);
    };


    const handlerFavorite = (recipe_id: string, favorite: boolean | undefined): void => {
        if (isFavoriteLoading) return

        if (recipe_id && id !== '' && favorite !== undefined) {
            const data = { recipe_id, favorite }
            dispatch(setFavoriteRecipe(data))
        }
    }

    function addToList() {
        if (isListLoading) return

        if (id !== '' && recipe_id) {
            dispatch(newListRecipe({ connection_id: id, recipe_id: recipe_id }))
        }
    }


    return (
        <Card sx={mainCard}>
            <Box sx={boxTypeRecipe}>
                <Typography component="p" sx={[textMaxWidth,typeRecipe]}>
                    {recipe?.recipe_type}
                </Typography>
            </Box>

            {isMobile && 
                <Box sx={containerMobileMenu}>
                    <IconButton
                        aria-label="more"
                        id="long-button"
                        aria-controls={openAdaptive ? 'long-menu' : undefined}
                        aria-expanded={openAdaptive ? 'true' : undefined}
                        aria-haspopup="true"
                        onClick={handleClick}
                        sx={mobileMenu}
                    >
                        <MoreVertIcon sx={{ width: '100%', height: '100%' }} viewBox='1 1 22 22'/>
                    </IconButton>
                    <Menu
                        id="long-menu"
                        MenuListProps={{
                            'aria-labelledby': 'long-button',
                        }}
                        anchorEl={anchorEl}
                        open={openAdaptive}
                        onClose={handleCloseAdaptive}
                        sx={containerMenu}
                    >
                        <MenuItem onClick={handleCloseAdaptive} sx={mobileButtons}>
                            <Button href={`/cook/${recipe_id}`} component={Link} sx={cookBtn}>Cook</Button>
                        </MenuItem>

                        <MenuItem onClick={handleCloseAdaptive} sx={mobileButtons}>
                            <Button onClick={() => addToList()} sx={cookBtn}>To List</Button>
                        </MenuItem>

                    </Menu>
                </Box>
                    
            }

            <Swiper 
                modules={[Navigation, Virtual]}
                virtual
                slidesPerView={1}
                className="swiper-media-main"
                navigation={{
                    prevEl: '.btn-prev-media',
                    nextEl: '.btn-next-media',

                }}
                spaceBetween={1}
            // lazy={true}
            >
                {recipe?.media
                    .slice()
                    .sort((a, b) => Number(b.main) - Number(a.main))
                    .map((el, index) => (
                        <SwiperSlide key={el.media_id} className="media-main-slide" virtualIndex={index}>
                            <SwiperMediaCard props={{ el, name: recipe?.name, priority: index === 0 }} />
                        </SwiperSlide>
                    )
                )}


                <Box className='btn-next-media' sx={arrowFullTemplate}>
                    <ArrowRightIcon viewBox="2 2 20 20" sx={arrowSwiper}></ArrowRightIcon>
                </Box>
                <Box className='btn-prev-media' sx={arrowFullTemplate}>
                    <ArrowLeftIcon viewBox="3 2 20 20" sx={arrowSwiper}></ArrowLeftIcon>
                </Box>
            </Swiper>



            <CardContent sx={[contentPostionAbsolute, cardBottom,]}>
                <Box sx={[mobileBottomInfo, {gap:ellipsisEnabled ? '7px' : 0}]}>
                    <Collapse in={!ellipsisEnabled} collapsedSize={isMobile ? 21 : 24} timeout={400}>
                        <Typography 
                            onClick={() => setEllipsisEnabled(prev => !prev)}
                            gutterBottom 
                            component="h2" 
                            sx={[headerCard, headerMove(ellipsisEnabled)]}
                        >
                            {recipe?.name}
                        </Typography>
                    </Collapse>
                    

                        {isMobile && 
                            <IconButton
                                sx={[{ padding: '0', display:ellipsisEnabled ? 'block' : 'none' },]}
                                aria-label="add to favorites"
                                onClick={() => handlerFavorite(recipe_id, recipe?.favorite)}
                            >
                                <FavoriteIcon sx={recipe?.favorite ? favoriteBtnActive : favoriteBtnDesactive} />
                            </IconButton>
                        }
                </Box>
            
                {!isMobile &&
                    <Box sx={desktopBotInfo}>
                        <Button
                            component={Link}
                            href={`/cook/${recipe_id}?name=${recipe?.name}`}
                            sx={cookBtn}
                        >Cook</Button>
                        <Button onClick={() => addToList()} sx={[cookBtn,{mr:isMobile ? '0' : '24px'}]}>To List</Button>
                        <IconButton
                            sx={{ padding: '0' }}
                            aria-label="add to favorites"
                            onClick={() => handlerFavorite(recipe_id, recipe?.favorite)}
                        >
                            <FavoriteIcon sx={recipe?.favorite ? favoriteBtnActive : favoriteBtnDesactive} />
                        </IconButton>

                    </Box>
                }

            </CardContent>
        </Card>
    )
}, (prevProps, nextProps) => {
    return  prevProps.props.recipe_id === nextProps.props.recipe_id &&
            prevProps.props.id === nextProps.props.id
});


CardContentBlock.displayName = "CardContentBlock"