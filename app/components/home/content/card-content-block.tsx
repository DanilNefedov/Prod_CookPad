import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { Box, CardHeader, Menu, MenuItem, useMediaQuery } from "@mui/material";
import IconButton from '@mui/material/IconButton';
import FavoriteIcon from '@mui/icons-material/Favorite';
import AvTimerIcon from '@mui/icons-material/AvTimer';
import Link from "next/link";
import { arrowSwiper, cardBottom, contentPostionAbsolute, cookBtn, descriptionText, headerCard, headerCardTitle, mainCard, timeIcon, typeRecipeText } from "@/app/(main)/home/styles";
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
import { theme } from '@/config/ThemeMUI/theme';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { newListRecipe } from '@/state/slices/list-recipe-slice';
import dynamic from 'next/dynamic';
import { arrowFullTemplate, betweenCenter, centerFlexBlock, favoriteBtnActive, favoriteBtnDesactive, textMaxWidth } from '@/app/styles';


const SwiperMediaCard = dynamic(() => import('./swiper-media-card'), {
    ssr: false, 
    loading: () => <div style={{ height: 200 }}>loading...</div>,
});

 

interface Props {
    recipe_id:string,
    id:string
}




export const CardContentBlock = memo(({ props }: { props: Props }) => {
    const { recipe_id, id} = props
    const recipe = useAppSelector((state) =>
        state.recipe.recipes.find((el) => el.recipe_id === recipe_id)
    );
    const isFavoriteLoading = useAppSelector(
        (state) => state.recipe.operations.setFavoriteRecipe.loading
    );
    const isListLoading = useAppSelector(
        (state) => state.listRecipe.operations.newListRecipe.loading
    );

    const dispatch = useAppDispatch();
    const isMobile = useMediaQuery('(max-width:500px)');

    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const openAdaptive = Boolean(anchorEl);

    const handleClick = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleCloseAdaptive = () => {
        setAnchorEl(null);
    };


    const handlerFavorite = (recipe_id: string, favorite: boolean | undefined): void => {
        if(isFavoriteLoading) return

        if (recipe_id && id !== '' && favorite !== undefined) {
            const data = { recipe_id, favorite }
            dispatch(setFavoriteRecipe(data))
        }
    }
   
    function addToList() {
        if(isListLoading) return

        if (id !== '' && recipe_id) {
            dispatch(newListRecipe({ connection_id: id, recipe_id: recipe_id }))
        }
    }

    

    return (
        <Card sx={mainCard}>
            <CardContent sx={contentPostionAbsolute}>
                <Box sx={betweenCenter}>
                    <CardHeader
                        title={recipe?.name}
                        sx={headerCard}
                        slotProps={{
                            title: {
                                sx: [textMaxWidth, headerCardTitle],
                            },
                        }}
                    />

                    <Box sx={centerFlexBlock}>
                        <AvTimerIcon sx={timeIcon}/>
                        <Typography
                            variant="body2"
                            sx={{
                                [theme.breakpoints.down("md")]: {
                                    fontSize: '12px'
                                },
                            }}
                        >
                            {`${recipe?.time.hours === '' ? '00' : recipe?.time.hours}:${recipe?.time.minutes === '' ? '00' : recipe?.time.minutes}h`}
                        </Typography>
                    </Box>
                </Box>
            </CardContent>

            <Swiper
                modules={[Navigation, Virtual ]}
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
                            <SwiperMediaCard props={{ el, name:recipe?.name }} />
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
            

            
            <CardContent sx={[contentPostionAbsolute, cardBottom]}>
                <Box sx={[betweenCenter, {bottom:'0'}]}>
                    <Typography gutterBottom component="p" sx={typeRecipeText}>
                        {"type: " + recipe?.recipe_type}
                    </Typography>
                    <IconButton 
                        sx={{padding: '0'}} 
                        aria-label="add to favorites" 
                        onClick={() => handlerFavorite(recipe_id, recipe?.favorite)}
                    >
                        {recipe?.favorite ? <FavoriteIcon sx={favoriteBtnActive} /> : <FavoriteIcon sx={favoriteBtnDesactive} />}
                    </IconButton>
                </Box>
                <Box>
                    <Typography gutterBottom
                        sx={[textMaxWidth, descriptionText]}
                    >
                        {recipe?.description}
                    </Typography>
                </Box>

                    {/* FINISHED */}

                {/* <Box sx={{ display: 'flex', justifyContent: 'space-between' }}> */}
                {isMobile ? <>
                    <IconButton
                        aria-label="more"
                        id="long-button"
                        aria-controls={openAdaptive ? 'long-menu' : undefined}
                        aria-expanded={openAdaptive ? 'true' : undefined}
                        aria-haspopup="true"
                        onClick={handleClick}
                        sx={{color: '#8E94A4', position:'absolute', top:'30px', right:'6px', width:'20px', height:'18px', padding:'0'}}
                    >
                        <MoreVertIcon sx={{width:'100%', height:'100%'}}/>
                    </IconButton>
                    <Menu
                        id="long-menu"
                        MenuListProps={{
                            'aria-labelledby': 'long-button',
                        }}
                        anchorEl={anchorEl}
                        open={openAdaptive}
                        onClose={handleCloseAdaptive}
                        slotProps={{
                            paper: {
                                style: {
                                    maxHeight: 48 * 4.5,
                                    width: '8ch',
                                },
                            },
                        }}
                    >
                        <MenuItem onClick={handleCloseAdaptive} sx={{minHeight:'auto', justifyContent:'center', p:'4px 7px'}}>
                            <Button href={`/cook/${recipe_id}`} component={Link} size="small" sx={cookBtn}>Cook</Button>
                        </MenuItem>

                        <MenuItem onClick={handleCloseAdaptive} sx={{minHeight:'auto', justifyContent:'center', p:'4px 7px'}}>
                            <Button onClick={() => addToList()} size="small" sx={cookBtn}>To List</Button>
                        </MenuItem>

                    </Menu>
                </>
                :
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                        <Link 
                        href={{
                            pathname: `/cook/${recipe_id}`,
                            query: { name:recipe?.name },
                        }}
                        className='cookLinkMainContent'
                        >Cook</Link>
                    <Button onClick={() => addToList()} size="small" sx={cookBtn}>To List</Button>
                    
                </Box>
                }

            </CardContent>
        </Card>
    )
}
,(prevProps, nextProps) => {
    
    
    return prevProps.props.recipe_id === nextProps.props.recipe_id &&
    prevProps.props.id === nextProps.props.id
   
});


CardContentBlock.displayName = "CardContentBlock"