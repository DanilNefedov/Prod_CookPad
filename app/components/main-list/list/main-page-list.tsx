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
import { Accordion, AccordionDetails, AccordionSummary, Box, Button, CircularProgress, Collapse, Grid2, IconButton, ListItemText, Menu, MenuItem, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Tooltip, Typography, useMediaQuery } from '@mui/material';
import { Fragment, memo, MouseEvent, useEffect, useMemo, useState } from 'react';
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
import { MainTableHeader } from '../main-table-header';
import { MainTableBody } from '../main-table-body';
import { UXLoading } from '../../ux-helpers/loading';

// import { DataGrid } from "@mui/x-data-grid";
// import { Search, SearchIconWrapper, StyledInputBase } from "./search-style";


export function MainListPage() {
    const dispatch = useAppDispatch()
    const listStore = useAppSelector(state => state.list.list_ingr);
    const listStatus = useAppSelector(state => state.list.status)
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





    const sortedList = useMemo(() => {
        if (!sortBy) return listStore;

        return [...listStore].sort((a, b) => {
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
    }, [sortBy, sortOrder, listStore]);



    return (
        <Table sx={{
            minWidth: '0', '& .MuiTableCell-root': {
                p: '7px 14px', [theme.breakpoints.down(1050)]: { p: '9px 7px' },
                [theme.breakpoints.down(400)]: { p: '8px 3px' }
            },

        }} stickyHeader aria-label="sticky table">

            <MainTableHeader props={{
                sortOrder,
                setSortOrder,
                sortBy,
                setSortBy
            }}></MainTableHeader>



            <TableBody sx={{ overflow: 'auto', borderTop: '2px solid rgba(255, 0, 0, 0.12)' }}>
                {listStatus && listStore.length === 0?
                    <TableRow>
                        <TableCell sx={{backgroundColor:'transparent', border:'0'}}>
                            <UXLoading props={{color:'#1F2128'}}></UXLoading>
                        </TableCell>
                    </TableRow>
                    :
                    sortedList.map((el) => (
                        <MainTableBody key={el._id} props={{
                            ingredient_id: el._id,

                        }}>
                        </MainTableBody>
                    ))

                }

            </TableBody>
            


        </Table>




    )
}