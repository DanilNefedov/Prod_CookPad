import { useAppDispatch, useAppSelector } from "@/state/hook";
import { Box, Button, IconButton, Tooltip, Typography } from "@mui/material";
import { ChangeEvent, useState } from "react";
import { v4 as uuidv4 } from 'uuid';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import GradeIcon from '@mui/icons-material/Grade';
import ClearIcon from '@mui/icons-material/Clear';
import ArrowRightIcon from '@mui/icons-material/ArrowRight';
import ArrowLeftIcon from '@mui/icons-material/ArrowLeft';
import { Swiper, SwiperSlide } from 'swiper/react';
import React from "react";
import 'swiper/css';
import 'swiper/css/navigation';
import './swiper-styles-media.css';
import { Navigation } from 'swiper/modules';
import { VisuallyHiddenInput, addMainMediaSwiper, btnsSwiperMedia, deleteMediaSwiper } from "@/app/(main)/new-recipe/style";
import { SwiperStepMedia } from "./swiper-media";
import { theme } from "@/config/ThemeMUI/theme";
import { changeMedia, deleteMediaState, setMainMedia } from "@/state/slices/stepper/media";
import { updateError } from "@/state/slices/stepper/error-open";






export function Media() {
    const numbStep = 3
    const pageState = useAppSelector(state => state.mediaSlice)
    const statusPage = useAppSelector(state => state.statusSlice.steps[numbStep])
    const [helperError, setHelperError] = useState<string>('')
    const dispatch = useAppDispatch()


    const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (files && files.length > 0 && files.length <= 10) {
            setHelperError('')
            if (pageState) {
                const dataFiles = []

                for (let i = 0; i < files.length; i++) {
                    const file = files[i];
                    const fileBlob = new Blob([file], { type: file.type });
                    const fileUrl = URL.createObjectURL(fileBlob);
                    const fileType = file.type.split('/')[0];

                    dataFiles.push({ main: false, media_url: fileUrl, media_id: uuidv4(), media_type: fileType })
                }
                dispatch(changeMedia({ media: dataFiles,}));
                dispatch(updateError({error:false, step:numbStep}))
            }
        }else{
            setHelperError('1 to 10 media files')
        }


    };


    function deleteMedia(media_id: string) {
        if(pageState.media.length <= 1){
            dispatch(updateError({error:true, step:numbStep}))
        }
        dispatch(deleteMediaState(media_id))
    }

    function handleMain(media_id: string) {
        // if (pageState) {
            dispatch(setMainMedia(media_id))
        // }
    }

    console.log('Media')
    return (
        <>
            <Typography variant="h6" component="h2" sx={{ textAlign: "center", mt: '25px', [theme.breakpoints.down('md')]: { fontSize: '18px', mt: '10px' } }}>Select media</Typography>
            <Box sx={{ p: 2, display: 'flex', justifyContent: 'center', flexDirection: 'column', [theme.breakpoints.down('md')]: { p: '10px' } }}>
                <Button component="label" variant="contained" startIcon={<CloudUploadIcon />} sx={{
                    maxWidth: '200px', m: '0 auto 20px',
                    [theme.breakpoints.down('md')]: {
                        padding: '5px 10px',
                        fontSize: '12px',

                    }

                }}>
                    Upload file
                    <VisuallyHiddenInput type="file" id="media" accept="image/*, video/*" multiple onChange={(e) => handleFileChange(e)} />
                </Button>
                <Typography sx={{
                    display: statusPage.open && statusPage.error_status.value ? 'block' : 'none',
                    fontSize: 13,
                    textAlign: 'center',
                    mt: 2,
                    [theme.breakpoints.down('md')]: {
                        mt: "0"
                    }
                }} color={"error"} >Upload the media file</Typography>


                <Typography sx={{
                    display: helperError !== '' ? 'block' : 'none',
                    fontSize: 13,
                    textAlign: 'center',
                    mt: 2,
                    [theme.breakpoints.down('md')]: {
                        mt: "0"
                    }
                }} color={"error"} >{helperError}</Typography>

                <Swiper
                    modules={[Navigation]}
                    className="swiper-step-media-main"
                    navigation={{
                        prevEl: '.btn-prev-step-media',
                        nextEl: '.btn-next-step-media',

                    }}
                    spaceBetween={1}
                    style={{display:pageState.media.length !== 0 ? 'block' : 'none'}}
                // lazy={true}
                >
                    {pageState.media.map(el => (
                        <SwiperSlide key={el.media_id} className={el.media_type === 'image' ? 'step-media-main-slide' : 'step-media-main-slide-video'} >
                            <SwiperStepMedia props={{ el }} />
                            {/* </SwiperStepMedia> */}

                            <Tooltip title="Main" >
                                <IconButton sx={{
                                    ...btnsSwiperMedia, ...addMainMediaSwiper, 
                                    p:'4px',
                                    width: '26px',
                                    height: '26px',
                                    [theme.breakpoints.down(500)]: {
                                        width: '18px',
                                        height: '18px',
                                    }
                                }} onClick={() => handleMain(el.media_id)}>
                                    <GradeIcon sx={{
                                        color: el.main ? 'primary.main' : 'text.primary', 
                                        width: '20px',
                                        height: '20px',
                                        [theme.breakpoints.down(500)]: {
                                            width: '14px',
                                            height: '14px'
                                        }
                                    }} />
                                </IconButton>
                            </Tooltip>

                            <Tooltip title="Delete" >
                                <IconButton sx={{
                                    ...btnsSwiperMedia, ...deleteMediaSwiper, 
                                    p:'4px',
                                    width: '26px',
                                    height: '26px',
                                    [theme.breakpoints.down(500)]: {
                                        width: '18px',
                                        height: '18px'
                                    }
                                }} onClick={() => deleteMedia(el.media_id)}>
                                    <ClearIcon sx={{
                                        color: 'text.primary', 
                                        width: '20px',
                                        height: '20px',
                                        [theme.breakpoints.down(500)]: {
                                            width: '14px',
                                            height: '14px'
                                        }
                                    }} />
                                </IconButton>
                            </Tooltip>

                        </SwiperSlide>
                    ))}
                    <Box className='btn-next-step-media' sx={{
                        cursor:"pointer",
                        borderRadius: '50%', backgroundColor: 'background.paper', 
                        width: '26px',
                        height: '26px', 
                        right: '10px',
                        [theme.breakpoints.down(500)]: {
                            width: '18px',
                            height: '18px',
                            
                        }

                    }}>
                        <ArrowRightIcon viewBox="3 3 17 17" sx={{
                            fontSize: 35,  position: 'relative',
                            width: '24px',
                            height: '24px',
                            [theme.breakpoints.down(500)]: {
                                width: '15px',
                                height: '15px',
                                right:"-1px",
                            }
                        }}></ArrowRightIcon>
                    </Box>
                    <Box className='btn-prev-step-media' sx={{
                        cursor:"pointer",
                        borderRadius: '50%', backgroundColor: 'background.paper',
                        width: '26px',
                        height: '26px',  
                        left: '10px',
                        [theme.breakpoints.down(500)]: {
                            width: '18px',
                            height: '18px'
                        }
                    }}>
                        <ArrowLeftIcon viewBox="3 3 17 17" sx={{
                            fontSize: 35, right: '1px', position: 'relative',
                            width: '24px',
                            height: '24px',
                            [theme.breakpoints.down(500)]: {
                                width: '15px',
                                height: '15px',
                                right: '0px'
                            }
                        }}></ArrowLeftIcon>
                    </Box>

                </Swiper>
            </Box>

        </>
    );
}