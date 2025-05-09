'use client'
import { useAppDispatch, useAppSelector } from '@/state/hook';
import { fetchList, } from '@/state/slices/list-slice';
import { Box, Table, TableBody, TableCell,TableRow, Typography,} from '@mui/material';
import { useEffect, useMemo, useState } from 'react';
import { theme } from '@/config/ThemeMUI/theme';
import { MainTableHeader } from '../main-table-header';
import { MainTableBody } from '../main-table-body';
import { UXLoading } from '../../ux-helpers/loading';
import { EmptyInfo } from '../../ux-helpers/empty-info';


export function MainListPage() {
    const dispatch = useAppDispatch()
    const listStore = useAppSelector(state => state.list.list_ingr);
    const listStatus = useAppSelector(state => state.list.status)
    const userStore = useAppSelector(state => state.user)
    const id = userStore?.user?.connection_id
    const [sortOrder, setSortOrder] = useState<'asc' | 'desc' | null>(null);
    const [sortBy, setSortBy] = useState<string | null>(null);




    useEffect(() => {
        // async function fetchData() {
        if (id !== '') {
            dispatch(fetchList(id));
        }
        // }
        // fetchData();
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
                {listStatus && listStore.length === 0 ?
                    <TableRow>
                        <TableCell sx={{backgroundColor:'transparent', border:'0'}}>
                            <UXLoading ></UXLoading>{/* color:'#1F2128' */}
                        </TableCell>
                    </TableRow>
                    :
                        !listStatus && listStore.length === 0 ?
                        <TableRow>
                            <TableCell sx={{backgroundColor:'transparent', border:'0'}}>
                                <EmptyInfo></EmptyInfo>
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