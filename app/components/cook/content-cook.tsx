"use client"

import { containerContentRecipe } from "@/app/(main)/cook/[recipe_id]/styles";
import { useAppDispatch, useAppSelector } from "@/state/hook";
import { setFavoriteRecipe } from "@/state/slices/recipe-slice";
import { Box, IconButton, Typography } from "@mui/material";
import FavoriteIcon from '@mui/icons-material/Favorite';
import { favoriteBtnActive, favoriteBtnDesactive } from "@/app/(main)/home/style";
import { Swiper, SwiperSlide } from 'swiper/react';
// Import Swiper styles
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/grid';
import './styles.css';
import { Navigation, Virtual } from "swiper/modules";
// Import Swiper styles
import ArrowRightIcon from '@mui/icons-material/ArrowRight';
import ArrowLeftIcon from '@mui/icons-material/ArrowLeft';
// import { SwiperMediaCook } from "./swiper-media";
import { useEffect } from "react";
import { fetchCook } from "@/state/slices/cook-slice";
import { usePathname } from "next/navigation";
import { theme } from "@/config/ThemeMUI/theme";
import { IngredientSwiper } from "./ingredient-swiper";
import dynamic from "next/dynamic";


const SwiperMediaCook = dynamic(() => import('./swiper-media'), {
    ssr: false,
});


export function ContentCook() {

    const dispatch = useAppDispatch()
    const cookStore = useAppSelector(state => state.cook)
    const userStore = useAppSelector(state => state.user)
    const favoriteStatus = useAppSelector(state => state.recipe.operations.setFavoriteRecipe.loading)

    const pathName = usePathname()

    const segments = pathName.split("/");
    const recipe_id = segments[2];

    const id = userStore.user.connection_id
    const findCook = cookStore.recipes.find(el => el.recipe_id === recipe_id)


    useEffect(() => {
        if (!findCook && userStore.user.connection_id !== '') {
            dispatch(fetchCook({ id, recipe_id }))
        }

    }, [id, recipe_id, dispatch, findCook, userStore.user.connection_id]);


    const handlerFavorite = ({ recipe_id }: { recipe_id: string | undefined }): void => {
        if(favoriteStatus) return

        if (recipe_id !== '' && recipe_id) {
            if (findCook && id !== '') {
                const data = { connection_id: id, recipe_id, favorite: findCook?.favorite }
                dispatch(setFavoriteRecipe(data))
            }
        }
    }

    return (
        <Box sx={containerContentRecipe}>
            <Box sx={{
                height: '100%', overflow: 'auto', [theme.breakpoints.down("md")]: {
                    p: '5px 15px',
                    overflow: 'hidden',
                    position:'relative'
                }
            }}>
            

                <Box sx={{
                    display: 'flex', height: 'auto', justifyContent: 'center', gap: '10px',
                    '& .swiper':{
                        marginLeft: 0,
                        marginRight: 0,
                        m:'0 auto'
                    },
                    [theme.breakpoints.down(700)]: {
                        display: 'block',
                        gap: '0'
                    }
                }}>


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
                        {findCook?.media.map((el, index) => (
                            <SwiperSlide virtualIndex={index} key={el.media_id} className={el.media_type === 'image' ? 'cook-media-main-slide' : 'cook-media-main-slide-video'} >
                                <SwiperMediaCook props={{ el }}></SwiperMediaCook>
                            </SwiperSlide>

                        ))}

                        <Box className='btn-next-cook-media' sx={{
                            borderRadius: '50%', backgroundColor: 'background.paper', width: '35px', height: '35px', right: "5px", cursor: 'pointer',
                            [theme.breakpoints.down("md")]: {
                                width: '25px',
                                height: '25px'
                            },
                        }}>
                            <ArrowRightIcon viewBox="3 3 17 17" sx={{
                                fontSize: 35, position: "relative", right: '1px', top: '-1px', width: '100%', height: '100%',
                                [theme.breakpoints.down("md")]: {
                                    right: '0', top: '-1px',
                                },
                            }}></ArrowRightIcon>
                        </Box>
                        <Box className='btn-prev-cook-media' sx={{
                            borderRadius: '50%', backgroundColor: 'background.paper', width: '35px', height: '35px', left: '5px', cursor: 'pointer',
                            [theme.breakpoints.down("md")]: {
                                width: '25px',
                                height: '25px'
                            },
                        }}>
                            <ArrowLeftIcon viewBox="3 3 17 17" sx={{
                                fontSize: 35, position: "relative", left: '-2px', top: '-1px', width: '100%', height: '100%',
                                [theme.breakpoints.down("md")]: {
                                    left: '-2px',
                                },
                            }}></ArrowLeftIcon>
                        </Box>
                    </Swiper>


                    <Box sx={{
                        maxWidth: "464px", width: '100%', pr: '20px', [theme.breakpoints.down("md")]: {
                            pr: '5px',
                            mt: '20px'
                        },
                    }}>
                        <Typography align="center" variant="h2" fontSize={'2rem'} sx={{
                            wordWrap: "break-word", wordBreak: 'break-all',
                            [theme.breakpoints.down("md")]: {
                                fontSize: '18px'
                            },
                        }}>{findCook?.name}</Typography>
                        <Typography variant="body1" sx={{
                            [theme.breakpoints.down("md")]: {
                                fontSize: '14px'
                            },
                        }}
                        >Type: {findCook?.recipe_type}</Typography>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', m: '10px 0' }}>
                            <Typography color={'text.secondary'} sx={{
                                [theme.breakpoints.down("md")]: {
                                    fontSize: '14px'
                                },
                            }}
                            >Time: {findCook?.time.hours}h : {findCook?.time.minutes}m</Typography>
                            <IconButton sx={{ padding: '0' }} aria-label="add to favorites" onClick={() => handlerFavorite({ recipe_id: findCook?.recipe_id })}>
                                {findCook?.favorite ? <FavoriteIcon sx={favoriteBtnActive} /> : <FavoriteIcon sx={favoriteBtnDesactive} />}
                            </IconButton>

                        </Box>
                        <Typography sx={{
                            wordWrap: "break-word", wordBreak: 'break-all', [theme.breakpoints.down("md")]: {
                                fontSize: '14px'
                            },
                        }} variant="body1"
                        >Description: {findCook?.description}</Typography>
                    </Box>
                </Box>

                <Box sx={{
                    maxWidth: '938px', m: '0 auto', p: "0 20px", [theme.breakpoints.down(700)]: {
                        p: "0"
                    },
                }}>
                    <Typography variant="h3" sx={{
                        fontSize: '1.4rem',
                        mt: '40px',
                        [theme.breakpoints.down("md")]: {
                            mt: '20px',
                            fontSize: '18px',

                        },

                    }} align="center">Ingredients</Typography>
                    <Box sx={{ '& .swiper': { position: 'static', m: '0 15px' }, p: '0', position: 'relative' }}>
            
                        {findCook?.ingredients && findCook?.ingredients.length > 0 ?
                        <IngredientSwiper props={{findCook:findCook.ingredients, id}}></IngredientSwiper>
                        :
                        <></>
                        
                        }
                        
                    </Box>
                    <Box>
                        <Typography variant="h3" 
                        sx={{
                            textAlign:'center',
                            fontSize:'1.4rem',
                            mt:'30px',
                            [theme.breakpoints.down("md")]: {
                                fontSize:'18px',
                                mt:'20px',
                            }
                        }}
                        >Instruction</Typography>
                        <Typography variant="body1" sx={{ wordWrap: 'break-word',wordBreak: 'break-all', mt: '5px', [theme.breakpoints.down("md")]: {
                            fontSize: '14px'
                        }, }}>{findCook?.instruction}</Typography>
                    </Box>
                </Box>
            </Box>

        </Box >
    )
}