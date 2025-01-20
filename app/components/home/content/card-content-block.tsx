import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { Box, CardHeader, Modal } from "@mui/material";
import IconButton from '@mui/material/IconButton';
import FavoriteIcon from '@mui/icons-material/Favorite';
import AvTimerIcon from '@mui/icons-material/AvTimer';
import Link from "next/link";
import { bottomTypeFavCard, contentPostionAbsolute, cookBtn, favoriteBtnActive, favoriteBtnDesactive, mainCard } from "@/app/(main)/home/style";
import ArrowRightIcon from '@mui/icons-material/ArrowRight';
import ArrowLeftIcon from '@mui/icons-material/ArrowLeft';
import DeleteIcon from '@mui/icons-material/Delete';



import { Swiper, SwiperSlide } from 'swiper/react';
// Import Swiper styles
import 'swiper/css';
import 'swiper/css/navigation';

import './swiper-media.css';

// import required modules
import { Navigation } from 'swiper/modules';
import { useState } from "react";
import { TempalateRecipe } from "@/app/types/types";
import { useAppDispatch } from '@/state/hook';
import { SwiperMediaCard } from './swiper-media-card';
import { deleteRecipe, setFavoriteRecipe } from '@/state/slices/recipe-slice';



interface propsData extends TempalateRecipe {
    id: string
}

export function CardContentBlock({ props }: { props: propsData }) {
    const { recipe_id, media, name, time, recipe_type, description, favorite, id } = props
    const dispatch = useAppDispatch()
    const [open, setOpen] = useState(false);
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);


    const handlerFavorite = (recipe_id: string, favorite: boolean): void => {
        if (recipe_id && id !== '') {
            const data = { connection_id: id, recipe_id, favorite }
            dispatch(setFavoriteRecipe(data))
        }
    }

    function addToList() {
        if (id !== '' && recipe_id) {
            // dispatch(newListRecipe({ connection_id: id, recipe_id: recipe_id }))
        }
    }

    function handleDelete(recipe_id: string) {
        if (id !== '' && recipe_id) {
            dispatch(deleteRecipe({recipe_id, connection_id:id}))
        }
    }


    return (
        <Card sx={mainCard}>
            <CardContent sx={contentPostionAbsolute}>
                <Box
                    display="flex"
                    justifyContent="space-between"
                    alignItems="center"
                >
                    <CardHeader
                        title={name}
                        sx={{
                            padding: '0',
                        }}
                        titleTypographyProps={{
                            fontSize: '16px',
                            textTransform: 'capitalize',
                        }}
                        
                    />

                    <Box display="flex" alignItems="center">
                        <AvTimerIcon
                            sx={{
                                fontSize: "20px",
                                height: '20px',
                                mr: '3px',
                            }}
                        />
                        <Typography
                            variant="subtitle2"
                            sx={{ lineHeight: '0' }}
                        >
                            {`${time.hours === '' ? '00' : time.hours}:${time.minutes === '' ? '00' : time.minutes}h`}
                        </Typography>
                    </Box>
                </Box>
            </CardContent>


            <Swiper
                modules={[Navigation]}
                className="swiper-media-main"
                navigation={{
                    prevEl: '.btn-prev-media',
                    nextEl: '.btn-next-media',

                }}
                spaceBetween={1}
            // lazy={true}
            >
                {media.map(el => (
                    <SwiperSlide key={el.media_id} className='media-main-slide'>
                        <SwiperMediaCard props={{ el, name }}></SwiperMediaCard>
                    </SwiperSlide>

                ))}

                <Box className='btn-next-media'>
                    <ArrowRightIcon viewBox="3 3 17 17" sx={{ fontSize: 35, opacity: '0.5' }}></ArrowRightIcon>
                </Box>
                <Box className='btn-prev-media'>
                    <ArrowLeftIcon viewBox="3 3 17 17" sx={{ fontSize: 35, opacity: '0.5' }}></ArrowLeftIcon>
                </Box>
            </Swiper>
            {/* <CardMedia
                component='img'
                alt={name as string}
                sx={mainCardImg}
                src={media as string}
            /> */}


            <CardContent sx={{ ...contentPostionAbsolute, bottom: '0' }}>
                <Box sx={bottomTypeFavCard}>
                    <Typography gutterBottom component="p" mb='0' sx={{ fontSize: "15px", color: '#B7BED3', lineHeight: '0' }}>
                        type:{recipe_type}
                    </Typography>
                    <IconButton sx={{ padding: '0' }} aria-label="add to favorites" onClick={() => handlerFavorite(recipe_id, favorite)}>
                        {favorite ? <FavoriteIcon sx={favoriteBtnActive} /> : <FavoriteIcon sx={favoriteBtnDesactive} />}
                    </IconButton>
                </Box>
                <Box>
                    <Typography gutterBottom pb='8px' component="p" m='0' fontSize={15}>
                        {description}
                    </Typography>
                </Box>

                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Button href={`/cook/${recipe_id}`} component={Link} size="small" sx={cookBtn}>Cook</Button>
                    <Button onClick={() => addToList()} size="small" sx={cookBtn}>To List</Button>
                    <Button onClick={handleOpen} size="small" sx={{ minWidth: '0', p: '0', color: `${open ? 'primary.dark' : 'text.disabled'}`, '&:hover': { backgroundColor: 'transparent' } }}>
                        <DeleteIcon></DeleteIcon>
                    </Button>


                    <Modal
                        open={open}
                        onClose={handleClose}
                        aria-labelledby="modal-modal-title"
                        aria-describedby="modal-modal-description"
                    >
                        <Box sx={{
                            position: 'absolute' as 'absolute',
                            top: '50%',
                            left: '50%',
                            transform: 'translate(-50%, -50%)',
                            width: 400,
                            bgcolor: 'background.paper',
                            boxShadow: 24,
                            p: 4,
                            display: "flex",
                            flexDirection: 'column',
                            alignItems: 'center'
                        }}>
                            <Typography id="modal-modal-description" sx={{ mt: 2 }}>
                                Confirming the deletion of the prescription?
                            </Typography>
                            <Box sx={{ mt: '10px', justifyContent: "space-around", width: '300px', display: 'flex' }}>
                                <Button
                                    onClick={() => handleDelete(recipe_id)}
                                    sx={{
                                        minWidth: '0',
                                        p: '3px 15px',
                                        color: 'text.primary',
                                        backgroundColor: 'background.default',
                                        "&:hover": {
                                            backgroundColor: 'primary.dark'
                                        }
                                    }}>Yes</Button>
                                <Button
                                    onClick={handleClose}
                                    sx={{
                                        minWidth: '0',
                                        p: '3px 15px',
                                        color: 'text.primary',
                                        backgroundColor: 'background.default',
                                        "&:hover": {
                                            backgroundColor: 'primary.dark'
                                        }
                                    }}>No</Button>
                            </Box>
                        </Box>
                    </Modal>

                </Box>

            </CardContent>
        </Card>
    )
}