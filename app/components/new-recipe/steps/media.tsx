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
import { actionBtnIcons, actionButtons, containerMediaStep, deleteBtn, errorMedia, 
    helperText, infoMediaStep, mainBtn, swiperArrowsBox } from "@/app/(main)/new-recipe/style";
import { SwiperStepMedia } from "./SwiperMedia";
import { changeMedia, deleteMediaState, setMainMedia } from "@/state/slices/stepper/media";
import { updateError } from "@/state/slices/stepper/error-open";
import { arrowFullTemplate, columnCenter, headerSteps, InputForMedia } from "@/app/styles";
import { arrowSwiper } from "@/app/(main)/home/styles";






export function Media() {
    const numbStep = 3
    const pageState = useAppSelector(state => state.mediaSlice)
    const statusPage = useAppSelector(state => state.statusStepSlice.steps[numbStep])
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

    return (
        <>
            <Typography variant="h6" component="h2" sx={headerSteps}>Select media</Typography>
            <Box sx={[containerMediaStep, columnCenter]}>
                <Button component="label" variant="contained" startIcon={<CloudUploadIcon />} 
                sx={infoMediaStep}>
                    Upload file
                    <Box
                        component="input"
                        type="file" 
                        id="media" 
                        accept="image/*, video/*" 
                        multiple 
                        onChange={(e) => handleFileChange(e)} 
                        name="image"
                        sx={InputForMedia}
                    />
                </Button>
                <Typography 
                    sx={[
                        {display: statusPage.open && statusPage.error_status.value ? 'block' : 'none',},
                        errorMedia
                    ]} 
                    color={"error"} 
                >Upload the media file</Typography>


                <Typography sx={[
                    {display: helperError !== '' ? 'block' : 'none'},
                    helperText
                    ]} color={"error"} >{helperError}</Typography>

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
                            <SwiperStepMedia el={ el } />
                            {/* </SwiperStepMedia> */}

                            <Tooltip title="Main" >
                                <IconButton 
                                sx={[
                                    actionButtons,
                                    mainBtn
                                ]}
                                onClick={() => handleMain(el.media_id)}>
                                    <GradeIcon sx={[
                                        {color: el.main ? 'primary.main' : 'text.primary'},
                                        actionBtnIcons
                                    ]} />
                                </IconButton>
                            </Tooltip>

                            <Tooltip title="Delete" >
                                <IconButton sx={[
                                    actionButtons,
                                    deleteBtn
                                ]} onClick={() => deleteMedia(el.media_id)}>
                                    <ClearIcon sx={[
                                        {color:'text.primary'},
                                        actionBtnIcons
                                    ]} />
                                </IconButton>
                            </Tooltip>

                        </SwiperSlide>
                    ))}
                    <Box className='btn-next-step-media' sx={[
                        arrowFullTemplate,
                        swiperArrowsBox
                    ]}>
                        <ArrowRightIcon viewBox="2 2 20 20" sx={arrowSwiper}></ArrowRightIcon>
                    </Box>
                    <Box className='btn-prev-step-media' sx={[
                        arrowFullTemplate,
                        swiperArrowsBox
                    ]}>
                        <ArrowLeftIcon viewBox="2 2 20 20" sx={arrowSwiper}></ArrowLeftIcon>
                    </Box>

                </Swiper>
            </Box>

        </>
    );
}