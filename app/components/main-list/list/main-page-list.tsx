'use client'
import { useAppDispatch, useAppSelector } from '@/state/hook';
import { fetchList, } from '@/state/slices/list-slice';
import { Button, Table, TableBody, TableCell, TableRow, } from '@mui/material';
import { useEffect, useMemo, useState } from 'react';
import { MainTableHeader } from '../main-table-header';
import MainTableBody from '../main-table-body';
import { UXLoading } from '../../ui-helpers/loading';
import { EmptyInfo } from '../../ui-helpers/empty-info';
import { containerInfo, moreButton, table, tableBody } from '@/app/(main)/(main-list)/list/styles';


export function MainListPage() {
    const dispatch = useAppDispatch()
    const ingredients = useAppSelector((state) => state.list.list_ingr);
    const currentPage = useAppSelector((state) => state.list.page_list);
    const isLoading = useAppSelector((state) => state.list.operations.fetchList.loading);
    const id = useAppSelector((state) => state.user.user.connection_id);
    const [sortOrder, setSortOrder] = useState<'asc' | 'desc' | null>(null);
    const [sortBy, setSortBy] = useState<string | null>(null);




    useEffect(() => {
        if (id !== '' && currentPage === 1 && currentPage !== null) {
            dispatch(fetchList({ id, page_list: currentPage }));
        }
    }, [dispatch, id, currentPage]);




    const sortedList = useMemo(() => {
        if (!sortBy) return ingredients;

        return [...ingredients].sort((a, b) => {
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
    }, [sortBy, sortOrder, ingredients]);


    function handleMore() {
        if (id !== '' && currentPage !== null) {
            dispatch(fetchList({ id, page_list: currentPage }));
        }
    }


    return (
        <>
            <Table sx={table} stickyHeader aria-label="sticky table">
                
                {/* 
                    may need to be memorialized
                    for now, the component is small.
                */}

                {isLoading && ingredients.length === 0 ?
                    <TableBody>
                        <TableRow>
                            <TableCell sx={containerInfo}>
                                <UXLoading ></UXLoading>
                            </TableCell>
                        </TableRow>
                    </TableBody>

                    :
                    !isLoading && ingredients.length === 0 ?
                        <TableBody>
                            <TableRow>
                                <TableCell sx={containerInfo}>
                                    <EmptyInfo></EmptyInfo>
                                </TableCell>
                            </TableRow>
                        </TableBody>    
                        :
                        <>
                            <MainTableHeader props={{
                                sortOrder,
                                setSortOrder,
                                sortBy,
                                setSortBy
                            }}></MainTableHeader>

                            <TableBody sx={tableBody}>
                                {sortedList.map((el) => ( 
                                    <MainTableBody key={el._id} props={{
                                        ingredient_id: el._id,

                                    }}>
                                    </MainTableBody>
                                ))}
                            </TableBody>
                        </>
                }

            </Table>


            {
                !isLoading && ingredients.length > 0 ?
                    <Button
                        disabled={currentPage === null ? true : false}
                        color='blackRedBtn'
                        onClick={() => handleMore()}
                        sx={moreButton}
                    >More</Button>
                    :
                    isLoading && ingredients.length > 0 ?
                        <UXLoading position={'static'}></UXLoading>
                        :
                        <></>

            }

        </>

    )
}