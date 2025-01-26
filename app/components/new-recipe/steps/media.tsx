import { useAppDispatch, useAppSelector } from "@/state/hook";
import { Box, Button, IconButton, Tooltip, Typography } from "@mui/material";
import { ChangeEvent } from "react";
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
import { changeMedia, deleteMediaState, hasOpen, setMainMedia } from "@/state/slices/step-by-step";






export function Media() {
    const stepperState = useAppSelector(state => state.setpForm)
    const infoPageState = stepperState.steps_info.find(el => el.step === stepperState.page_step)
    const dispatch = useAppDispatch()
    // console.log(infoPageState)


    const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        // console.log(files)
        if (files && files.length > 0 && files.length <= 10) {
            // console.log(files)

            if (infoPageState) {
                const dataFiles = []

                for (let i = 0; i < files.length; i++) {
                    const file = files[i];
                    const fileBlob = new Blob([file], { type: file.type });
                    const fileUrl = URL.createObjectURL(fileBlob);
                    const fileType = file.type.split('/')[0];
                    // console.log(fileUrl, fileType)

                    dataFiles.push({ main: false, media_url: fileUrl, media_id: uuidv4(), media_type: fileType })
                }
                // console.log(dataFiles)
                dispatch(changeMedia({ media: dataFiles, error_status: true, step: infoPageState?.step }));
                dispatch(hasOpen(infoPageState?.step));
            }
        }


    };


    function deleteMedia(media_id: string) {
        if (infoPageState) {
            dispatch(deleteMediaState({ step: infoPageState?.step, media_id }))
        }
    }

    function handleMain(media_id: string) {
        if (infoPageState) {
            dispatch(setMainMedia({ step: infoPageState?.step, media_id }))
        }
    }

    console.log(infoPageState)
    return (
        <>
            <Typography variant="h6" component="h2" sx={{ textAlign: "center", mt: '25px' }}>Select media</Typography>
            <Box sx={{ p: 2, display: 'flex', justifyContent: 'center', flexDirection: 'column' }}>
                <Button component="label" variant="contained" startIcon={<CloudUploadIcon />} sx={{ maxWidth: '200px', m: '0 auto 20px' }}>
                    Upload file
                    <VisuallyHiddenInput type="file" id="media" accept="image/*, video/*" multiple onChange={(e) => handleFileChange(e)} />
                </Button>
                <Typography sx={{
                    display: infoPageState?.open && !infoPageState?.error_status ? 'block' : 'none',
                    fontSize: 13,
                    textAlign: 'center',
                    mt: 2,
                }} color={"error"} >upload the media file</Typography>



                <Swiper
                    modules={[Navigation]}
                    className="swiper-step-media-main"
                    navigation={{
                        prevEl: '.btn-prev-step-media',
                        nextEl: '.btn-next-step-media',

                    }}
                    spaceBetween={1}
                // lazy={true}
                >
                    {infoPageState?.media?.map(el => (
                        <SwiperSlide key={el.media_id} className={el.media_type === 'image' ? 'step-media-main-slide' : 'step-media-main-slide-video'} >
                            <SwiperStepMedia props={{ el }} />
                            {/* </SwiperStepMedia> */}

                            <Tooltip title="Main" >
                                <IconButton sx={{ ...btnsSwiperMedia, ...deleteMediaSwiper, }} onClick={() => handleMain(el.media_id)}>
                                    <GradeIcon sx={{ color: el.main ? 'primary.main' : 'text.primary', }} />
                                </IconButton>
                            </Tooltip>

                            <Tooltip title="Delete" >
                                <IconButton sx={{ ...btnsSwiperMedia, ...addMainMediaSwiper }} onClick={() => deleteMedia(el.media_id)}>
                                    <ClearIcon sx={{ color: 'text.primary', }} />
                                </IconButton>
                            </Tooltip>

                        </SwiperSlide>
                    ))}
                    <Box className='btn-next-step-media' sx={{borderRadius: '50%', backgroundColor: 'background.paper', width:'35px', height:'35px', right:'10px'}}> 
                        <ArrowRightIcon viewBox="3 3 17 17" sx={{ fontSize: 35, right:'1px', bottom:'1px',position:'relative'}}></ArrowRightIcon>
                    </Box>
                    <Box className='btn-prev-step-media' sx={{borderRadius: '50%', backgroundColor: 'background.paper', width:'35px', height:'35px', left:'10px'}}>
                        <ArrowLeftIcon viewBox="3 3 17 17" sx={{ fontSize: 35, right:'3px', bottom:'1px',position:'relative'}}></ArrowLeftIcon>
                    </Box>

                </Swiper>
            </Box>

        </>
    );
}