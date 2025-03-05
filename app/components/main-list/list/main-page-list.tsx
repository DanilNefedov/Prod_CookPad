'use client'
import { blockList, btnsListUnitHover, cellHeader, imgIngrList, mainIngrList, nameIngredient, sortBtnHeader } from '@/app/(main)/(main-list)/style';
import { UnitsList } from '@/app/types/types';
import { useAppDispatch, useAppSelector } from '@/state/hook';
import { deleteIngredientFetch, fetchList, toggleShopIngrFetch } from '@/state/slices/list-slice';
import AddShoppingCartIcon from '@mui/icons-material/AddShoppingCart';
import ArrowLeftIcon from '@mui/icons-material/ArrowLeft';
import ArrowRightIcon from '@mui/icons-material/ArrowRight';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import ClearIcon from '@mui/icons-material/Clear';
import { Accordion, AccordionDetails, AccordionSummary, Box, Button, Collapse, Grid2, IconButton, ListItemText, Menu, MenuItem, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Tooltip, Typography, useMediaQuery } from '@mui/material';
import { Fragment, MouseEvent, useEffect, useMemo, useState } from 'react';
import 'swiper/css';
import 'swiper/css/navigation';
import { Navigation } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';
import { AddNewUnit } from './add-unit';
import './styles.css';
import { Units } from './units';
import { theme } from '@/config/ThemeMUI/theme';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { MainButtons } from './main-buttons';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

// import { DataGrid } from "@mui/x-data-grid";
// import { Search, SearchIconWrapper, StyledInputBase } from "./search-style";


export function MainListPage() {
    const dispatch = useAppDispatch()
    const listStore = useAppSelector(state => state.list)
    const userStore = useAppSelector(state => state.user)
    const id = userStore?.user?.connection_id
    const [sortOrder, setSortOrder] = useState<'asc' | 'desc' | null>(null);
    const [sortBy, setSortBy] = useState<string | null>(null);
    const isMobile = useMediaQuery("(max-width:800px)");
    const [expandedId, setExpandedId] = useState<string | null>(null);




    useEffect(() => {
        async function fetchData() {
            if (id !== '') {
                dispatch(fetchList(id));
            }
        }
        fetchData();
    }, [dispatch, id]);

    console.log(listStore)

    const handleSort = (name: string) => {
        if (sortBy === name) {
            setSortBy(null);
            setSortOrder(null);
        } else {
            setSortBy(name);
            setSortOrder(name === 'unit' ? 'desc' : 'asc');
        }
    };



    const sortedList = useMemo(() => {
        if (!sortBy) return listStore.list_ingr;

        return [...listStore.list_ingr].sort((a, b) => {
            if (sortBy === 'name') {
                return sortOrder === 'asc'
                    ? a.name.localeCompare(b.name)
                    : b.name.localeCompare(a.name);
            } else if (sortBy === 'unit') {
                return sortOrder === 'desc'
                    ? b.units.length - a.units.length
                    : a.units.length - b.units.length;
            }
            return 0;
        });
    }, [sortBy, sortOrder, listStore.list_ingr]);


    const handleToggle = (id: string) => {
        setExpandedId((prevId) => (prevId === id ? null : id));
    };




    // console.log('MainListPageMainListPageMainListPageMainListPage')
    return (
        <Table sx={{
            minWidth: '0', '& .MuiTableCell-root': { p: '7px 14px', [theme.breakpoints.down(1050)]: { p: '5px 7px' }, 
            [theme.breakpoints.down(400)]: { p: '8px 3px' }},
            
        }} stickyHeader aria-label="sticky table">
            <TableHead sx={{
                '& .MuiTableCell-root': {
                    borderBottom: '0',
                },
            }}>
                <TableRow sx={cellHeader}>
                    <TableCell align="center">Image</TableCell>
                    <TableCell align="center" onClick={() => handleSort("name")} sx={{ cursor: 'pointer' }}>
                        <Box sx={sortBtnHeader}>
                            <Typography fontSize={'0.875rem'} sx={{ borderBottom: '0', pr: '10px' }}>
                                Name
                            </Typography>
                            <ArrowUpwardIcon sx={{ width: '16px', transition: "transform 0.3s ease", transform: `rotate(${sortOrder === 'asc' && sortBy === 'name' ? '180deg' : '0deg'})` }}></ArrowUpwardIcon>
                        </Box>

                    </TableCell>
                    {/* {isMobile ?
                        <TableCell onClick={() => handleSort("unit")} sx={{ cursor: 'pointer' }}>

                        </TableCell>
                        : */}
                        <TableCell align="center" onClick={() => handleSort("unit")} sx={{ cursor: 'pointer' }}>
                            <Box sx={sortBtnHeader}>
                                <Typography fontSize={'0.875rem'} sx={{ borderBottom: '0', pr: '10px' }}>
                                    Unit
                                </Typography>
                                <ArrowUpwardIcon sx={{ width: '16px', transition: "transform 0.3s ease", transform: `rotate(${sortOrder === 'desc' && sortBy === 'unit' ? '180deg' : '0deg'})` }}></ArrowUpwardIcon>
                            </Box>

                        </TableCell>
                    {/* } */}
                    <TableCell>
                    </TableCell>
                </TableRow>
            </TableHead>


            <TableBody sx={{ overflow: 'auto', borderTop: '2px solid rgba(255, 0, 0, 0.12)' }}>
                {sortedList.map((el) => (

                    <Fragment key={el._id}>
                        <TableRow sx={{
                            ...mainIngrList, opacity: `${el.shop_ingr ? 0.4 : 1}`,
                            '& .MuiTableCell-root': {
                                borderBottom: `${isMobile ? 'none' : '5px solid #353842'}`,
                            },

                        }}>
                            <TableCell onClick={() => { if (isMobile) handleToggle(el._id) }} sx={{ width: '73px', [theme.breakpoints.down(1050)]: { width: '30px' }, }}>
                                <Box sx={{display:'flex', alignItems:'center', justifyContent:'center'}}>
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
                                <Tooltip title={el.name} arrow>
                                    <ListItemText
                                        sx={nameIngredient}
                                        primary={el.name}
                                    />
                                </Tooltip>


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
                                                fontSize:'14px', 
                                                color:'text.disabled', 
                                                pr:'5px',
                                                overflow: 'hidden',
                                                whiteSpace: 'nowrap',
                                                textOverflow: 'ellipsis',
                                                maxWidth:'65px'
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
                                        minWidth: '0',
                                        maxWidth: '100%'
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
                                            style={{ minWidth: 0 }}
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
                                    </TableCell>
                            }

                            <MainButtons props={{ el }}></MainButtons>



                        </TableRow>

                        {
                            isMobile ?
                                <TableRow sx={{
                                    ...mainIngrList, opacity: `${el.shop_ingr ? 0.4 : 1}`, p: "0",
                                    transition: 'height 300ms ease,',
                                }}>
                                    <TableCell colSpan={4} sx={{
                                        p: "0 !important", border: 'none',
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
                                                    style={{ minWidth: 0 }}
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


                ))
                }

            </TableBody>

        </Table>




    )
}