import { Box, Collapse, ListItemText, TableCell, TableRow, Tooltip, Typography, useMediaQuery } from "@mui/material"
import { Fragment, useState } from "react"
import { MainButtons } from "./list/main-buttons"
import { imgIngrList, mainIngrList, nameIngredient } from "@/app/(main)/(main-list)/style"
import { Swiper, SwiperSlide } from "swiper/react"
import { Units } from "./list/units"
import { IListObj, UnitsList } from "@/app/types/types"
import { theme } from "@/config/ThemeMUI/theme"
import { useAppSelector } from "@/state/hook"
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import 'swiper/css';
import 'swiper/css/navigation';
import { Navigation } from 'swiper/modules';
import './list/styles.css';
import ArrowLeftIcon from '@mui/icons-material/ArrowLeft';
import ArrowRightIcon from '@mui/icons-material/ArrowRight';
import { usePathname } from "next/navigation"



interface DataProps {
    el: IListObj,
    recipe_id?: string
}

export function MainTableBody({props}: {props:DataProps}) {
    const {el, recipe_id} = props
    const userStore = useAppSelector(state => state.user)
    const id = userStore?.user?.connection_id

    const isMobile = useMediaQuery("(max-width:800px)");
    const [expandedId, setExpandedId] = useState<string | null>(null);
    const pathName = usePathname()
    




    const handleToggle = (id: string) => {
        setExpandedId((prevId) => (prevId === id ? null : id));
    }



    return (
        <Fragment >
            <TableRow sx={{
                ...mainIngrList, opacity: `${el.shop_ingr ? 0.4 : 1}`,
                '& .MuiTableCell-root': {
                    borderBottom: `${isMobile ? 'none' : '5px solid '}`,
                    borderColor: `${pathName === '/list-recipe' ? '#1F2128' : '#353842'}`
                },

            }}>
                <TableCell onClick={() => { if (isMobile) handleToggle(el._id) }} sx={{ width: '73px', [theme.breakpoints.down(1050)]: { width: '30px' }, }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <Box component={'img'} src={el.media !== '' ? el.media : 'images/load-ingr.svg'} alt={el.name} sx={imgIngrList}></Box>
                    </Box>
                </TableCell>
                <TableCell onClick={() => { if (isMobile) handleToggle(el._id) }} sx={{
                    maxWidth: '150px',
                    width: '150px',
                    [theme.breakpoints.down(1050)]: {
                        maxWidth: '100px',
                        width: '100px',
                    },

                }}>

                    {isMobile ?
                        <ListItemText
                            sx={nameIngredient}
                            primary={el.name}
                        />
                        :
                        <Tooltip title={el.name} sx={{ display: isMobile ? 'block' : 'none' }} arrow>
                            <ListItemText
                                sx={nameIngredient}
                                primary={el.name}
                            />
                        </Tooltip>
                    }


                </TableCell>


                {
                    isMobile ?
                        <TableCell onClick={() => { if (isMobile) handleToggle(el._id) }} sx={{
                            position: 'relative', '& .slide-list-unit': { width: 'auto' }, '& .swiper-list-unit': {
                                position: 'static',
                                m: '0',
                                ml: '7px',
                                mr: '7px'
                            }
                        }}>

                            <Box sx={{ display: "flex", alignItems: "center", justifyContent: 'end' }}>
                                <Typography sx={{
                                    fontSize: '14px',
                                    color: 'text.disabled',
                                    pr: '5px',
                                    overflow: 'hidden',
                                    whiteSpace: 'nowrap',
                                    textOverflow: 'ellipsis',
                                    maxWidth: '65px'
                                }}>×{el.units.length}</Typography>
                                <ExpandMoreIcon sx={{
                                    transition: "transform 0.3s ease",
                                    transform: expandedId === el._id ? "rotate(180deg)" : "rotate(0deg)",
                                    color: 'text.disabled'
                                }}></ExpandMoreIcon>
                            </Box>
                        </TableCell>

                        :
                        <TableCell sx={{
                            position: 'relative', '& .slide-list-unit': { width: 'auto' }, '& .swiper-list-unit': {
                                position: 'static',
                                m: '0',
                                ml: '7px',
                                mr: '7px'
                            },
                            maxWidth:"0px", /*     DO NOT CHANGE!     */
                            width: '100%'
                        }}>
                            <Swiper
                                navigation={{
                                    prevEl: '.custom-prev-list-unit',
                                    nextEl: '.custom-next-list-unit',

                                }}
                                className="swiper-list-unit"
                                slidesPerView={'auto'}
                                modules={[Navigation]}
                                spaceBetween={10}
                                style={{ 
                                //    width:'100%'
                                }}
                            >
                                {el.units.map((elem: UnitsList) => (
                                    <SwiperSlide key={elem._id} className="slide-list-unit">
                                        <Units el={el} elem={elem} id={id} recipe_id={recipe_id}/>
                                    </SwiperSlide>


                                ))}

                                <div className="custom-prev-list-unit ">
                                    <ArrowLeftIcon></ArrowLeftIcon>
                                </div>
                                <div className="custom-next-list-unit ">
                                    <ArrowRightIcon></ArrowRightIcon>
                                </div>
                            </Swiper>

                            
                        </TableCell>
                }

                <MainButtons props={{ el, recipe_id }}></MainButtons>



            </TableRow>

            {
                isMobile ?
                    <TableRow sx={{
                        ...mainIngrList, opacity: `${el.shop_ingr ? 0.4 : 1}`, p: "0",
                        transition: 'height 300ms ease,',
                        
                    }}>
                        <TableCell colSpan={4} sx={{
                            p: "0 !important", border: 'none',
                            minWidth: 0, width: '100%'
                        }}>
                            <Collapse in={expandedId === el._id} timeout={300}>
                                <Box sx={{
                                    position: 'relative', '& .slide-list-unit': { width: 'auto' }, '& .swiper-list-unit': {
                                        position: 'static',

                                        margin: '0 auto 15px'
                                    },
                                    overflow: 'hidden',
                                    transition: 'max-height 300ms ease',
                                    maxHeight: expandedId === el._id ? '75px' : '0',
                                }}>
                                    <Swiper
                                        navigation={{
                                            prevEl: '.custom-prev-list-unit',
                                            nextEl: '.custom-next-list-unit',

                                        }}
                                        className="swiper-list-unit adaptive-list-unit-swiper"
                                        slidesPerView={'auto'}
                                        modules={[Navigation]}
                                        spaceBetween={10}
                                        style={{ 
                                            // width:'100%'
                                        }}
                                    >
                                        {el.units.map((elem: UnitsList) => (
                                            <SwiperSlide key={elem._id} className="slide-list-unit">
                                                <Units el={el} elem={elem} id={id} />
                                            </SwiperSlide>


                                        ))}

                                        <div className="custom-prev-list-unit ">
                                            <ArrowLeftIcon></ArrowLeftIcon>
                                        </div>
                                        <div className="custom-next-list-unit ">
                                            <ArrowRightIcon></ArrowRightIcon>
                                        </div>
                                    </Swiper>
                                </Box>

                            </Collapse>
                        </TableCell>
                    </TableRow>
                    :
                    <></>

            }

        </Fragment>
    )
}