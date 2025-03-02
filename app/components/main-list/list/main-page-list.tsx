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
import { Box, Button, ListItemText, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from '@mui/material';
import { useEffect, useMemo, useState } from 'react';
import 'swiper/css';
import 'swiper/css/navigation';
import { Navigation } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';
import { AddNewUnit } from './add-unit';
import './styles.css';
import { Units } from './units';
// import { DataGrid } from "@mui/x-data-grid";
// import { Search, SearchIconWrapper, StyledInputBase } from "./search-style";


export function MainListPage() {
    const dispatch = useAppDispatch()
    const listStore = useAppSelector(state => state.list)
    const userStore = useAppSelector(state => state.user)
    const id = userStore?.user?.connection_id
    const [sortOrder, setSortOrder] = useState<'asc' | 'desc' | null>(null);
    const [sortBy, setSortBy] = useState<string | null>(null);


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

    function deleteIngredient(_id: string) {
        if (id !== '') {
            console.log(_id)
            dispatch(deleteIngredientFetch({ _id }))
        }
    }

    function toggleShopIngr(_id: string, shop_ingr: boolean) {
        if (id !== '') {
            dispatch(toggleShopIngrFetch({ _id, shop_ingr }))
        }
    }


    // console.log('MainListPageMainListPageMainListPageMainListPage')
    return (

        <Table sx={{ minWidth: 700, '& .MuiTableCell-root': { p: '7px 14px' }, }} stickyHeader aria-label="sticky table">
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
                    <TableCell align="center" onClick={() => handleSort("unit")} sx={{ cursor: 'pointer' }}>
                        <Box sx={sortBtnHeader}>
                            <Typography fontSize={'0.875rem'} sx={{ borderBottom: '0', pr: '10px' }}>
                                Unit
                            </Typography>
                            <ArrowUpwardIcon sx={{ width: '16px', transition: "transform 0.3s ease", transform: `rotate(${sortOrder === 'asc' && sortBy === 'unit' ? '180deg' : '0deg'})` }}></ArrowUpwardIcon>
                        </Box>

                    </TableCell>
                    <TableCell>
                    </TableCell>
                </TableRow>
            </TableHead>


            <TableBody sx={{ overflow: 'auto', borderTop: '2px solid rgba(255, 0, 0, 0.12)' }}>
                {sortedList.map((el) => (
                    <TableRow key={el._id} sx={{ ...mainIngrList, opacity: `${el.shop_ingr ? 0.4 : 1}` }}>
                        <TableCell>
                            <Box component={'img'} src={el.media !== '' ? el.media : 'images/load-ingr.svg'} alt={el.name} sx={imgIngrList}></Box>
                        </TableCell>
                        <TableCell sx={{
                            maxWidth: '200px',
                            width: '200px',
                            overflow: 'hidden',
                            whiteSpace: 'nowrap',
                            textOverflow: 'ellipsis'
                        }}>
                            <ListItemText
                                sx={nameIngredient}
                                primary={el.name}
                            />
                        </TableCell>
                        <TableCell sx={{ position: 'relative', '& .slide-list': { width: 'auto' } }}>
                            <Swiper
                                navigation={{
                                    prevEl: '.custom-prev-list',
                                    nextEl: '.custom-next-list',

                                }}
                                className="swiper-list"
                                slidesPerView={'auto'}
                                modules={[Navigation]}
                                spaceBetween={10}
                            >
                                {el.units.map((elem: UnitsList) => (
                                    <SwiperSlide key={elem._id} className="slide-list">
                                        <Units el={el} elem={elem} id={id} />
                                    </SwiperSlide>


                                ))}

                                <div className="custom-prev-list ">
                                    <ArrowLeftIcon></ArrowLeftIcon>
                                </div>
                                <div className="custom-next-list ">
                                    <ArrowRightIcon></ArrowRightIcon>
                                </div>
                            </Swiper>
                        </TableCell>
                        <TableCell sx={{ ml: 'auto' }}>
                            <Button onClick={() => toggleShopIngr(el._id, el.shop_ingr)} sx={btnsListUnitHover}>
                                <AddShoppingCartIcon ></AddShoppingCartIcon>
                            </Button>

                            <AddNewUnit props={{ ingr: el, id }}></AddNewUnit>

                            <Button onClick={() => deleteIngredient(el._id)} sx={btnsListUnitHover}>
                                <ClearIcon></ClearIcon>
                            </Button>
                        </TableCell>
                    </TableRow>
                ))
                }

            </TableBody>

        </Table>



    )
}