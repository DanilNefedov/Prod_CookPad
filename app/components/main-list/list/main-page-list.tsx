'use client'
import { useAppDispatch, useAppSelector } from '@/state/hook';
import { fetchList, } from '@/state/slices/list-slice';
import { Button, Table, TableBody, TableCell, TableRow, } from '@mui/material';
import { useEffect, useMemo, useState } from 'react';
import { theme } from '@/config/ThemeMUI/theme';
import { MainTableHeader } from '../main-table-header';
import MainTableBody from '../main-table-body';
import { UXLoading } from '../../ui-helpers/loading';
import { EmptyInfo } from '../../ui-helpers/empty-info';
import { styleLink } from '../../home/header/header';


export function MainListPage() {
    const dispatch = useAppDispatch()
    const listStore = useAppSelector(state => state.list.list_ingr);
    const pageList = useAppSelector(state => state.list.page_list)
    const statusfetch = useAppSelector(state => state.list.operations.fetchList.loading)
    // const listStatus = useAppSelector(state => state.list.status)
    const userStore = useAppSelector(state => state.user)
    const id = userStore?.user?.connection_id
    const [sortOrder, setSortOrder] = useState<'asc' | 'desc' | null>(null);
    const [sortBy, setSortBy] = useState<string | null>(null);




    useEffect(() => {
        if (id !== '' && pageList === 1 && pageList !== null) {
            dispatch(fetchList({ id, page_list:pageList }));
        }
    }, [dispatch, id, pageList]);




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


    function handleMore () {
        if (id !== '' && pageList !== null) {
            dispatch(fetchList({ id, page_list:pageList }));
        }
    }

    console.log(listStore)

    return (
        <>


            <Table sx={{
                mb:'7px',
                minWidth: '0', '& .MuiTableCell-root': {
                    p: '7px 14px', [theme.breakpoints.down(1050)]: { p: '12px 7px' },
                    [theme.breakpoints.down(400)]: { p: '12px 3px' }
                },

            }} stickyHeader aria-label="sticky table">

                {/* 
                    may need to be memorialized
                    for now, the component is small.
                */}
                <MainTableHeader props={{
                    sortOrder,
                    setSortOrder,
                    sortBy,
                    setSortBy
                }}></MainTableHeader>



                <TableBody sx={{ overflow: 'auto', borderTop: '2px solid rgba(255, 0, 0, 0.12)' }}>
                    {statusfetch && listStore.length === 0 ?
                        <TableRow>
                            <TableCell sx={{ backgroundColor: 'transparent', border: '0' }}>
                                <UXLoading ></UXLoading>{/* color:'#1F2128' */}
                            </TableCell>
                        </TableRow>
                        :
                        !statusfetch && listStore.length === 0 ?
                            <TableRow>
                                <TableCell sx={{ backgroundColor: 'transparent', border: '0' }}>
                                    <EmptyInfo></EmptyInfo>
                                </TableCell>
                            </TableRow>
                            :
                            <>
                                {sortedList.map((el) => (
                                    <MainTableBody key={el._id} props={{
                                        ingredient_id: el._id,

                                    }}>
                                    </MainTableBody>
                                ))}
                            </>
                    }

                </TableBody>

            </Table>

            {
                !statusfetch && listStore.length > 0 ? 
                <Button
                    disabled={pageList === null ? true : false}
                    sx={{
                        ...styleLink, 
                        backgroundColor:"primary.dark",
                        display:'flex',
                        alignItems:'center',
                        width: '150px', 
                        height: '32.5px', 
                        m: '20px auto',
                        color:'white',
                        '@media (hover: hover) and (pointer: fine)': {
                            "&:hover":{
                                backgroundColor:"primary.main",
                            },
                        },
                        [theme.breakpoints.down("md")]: {
                            mt: '7px',
                            mb: '7px',
                            width: '90px'
                        },
                        [theme.breakpoints.down(500)]: {
                            height: '28px'
                        }
                    }}
                    onClick={() => handleMore()}
                >More</Button>
                :
                statusfetch && listStore.length > 0 ?
                <UXLoading position={'static'}></UXLoading>
                :
                <></>
                
            }
            
        </>

    )
}