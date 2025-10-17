'use client'
import { useAppDispatch, useAppSelector } from '@/state/hook';
import { fetchList, } from '@/state/slices/list-slice';
import { Button, Table, TableBody, TableCell, TableRow, } from '@mui/material';
import { useEffect, useMemo, useState } from 'react';
import MainTableBody from '../MainTableBody';
import { UXLoading } from '../../ui-helpers/UXLoading';
import { EmptyInfo } from '../../ui-helpers/EmptyInfo';
import { containerInfo, moreButton, table, tableBody } from '@/app/(main)/(main-list)/list/styles';
import MainTableHeader from '../MainTableHeader';
import { SkeletonTable } from './SkeletonTable';
import { SkeletonHeader } from './SkeletonHeader';
import { AddNewIngredient } from './new-ingr-window/AddNewIngredient';


export function MainListPage() {
    const dispatch = useAppDispatch()
    const currentPage = useAppSelector((state) => state.list.page_list);
    const queueIngredints = useAppSelector(state => state.list.queue_ingredients)

    const ingredientsMap = useAppSelector((state) => state.list.ingredients);

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
        const ingredientArray = queueIngredints
            .map(id => ingredientsMap[id])
            .filter(Boolean);

        if (!sortBy) return ingredientArray;

        return [...ingredientArray].sort((a, b) => {
            if (sortBy === 'name') {
                return sortOrder === 'asc'
                    ? a.name.localeCompare(b.name)
                    : b.name.localeCompare(a.name);
            } else if (sortBy === 'unit') {
                const aUnitCount = a.unit_ids.length;
                const bUnitCount = b.unit_ids.length;
                return sortOrder === 'desc'
                    ? bUnitCount - aUnitCount
                    : aUnitCount - bUnitCount;
            }
            return 0;
        });
    }, [sortBy, sortOrder, ingredientsMap, queueIngredints]);



    function handleMore() {
        if (id !== '' && currentPage !== null) {
            dispatch(fetchList({ id, page_list: currentPage }));
        }
    }

    const skeletonDataMemo = useMemo(() => [
        { count: 3, widths: [312, 287, 250] },
        { count: 7, widths: [300, 270, 310, 280, 330, 290, 260] },
        { count: 1, widths: [320] },
        { count: 10, widths: [250, 260, 270, 280, 290, 300, 310, 320, 330, 340] },
        { count: 4, widths: [300, 310, 320, 330] },
        { count: 6, widths: [290, 300, 310, 320, 330, 340] },
        { count: 2, widths: [280, 300] },
        { count: 5, widths: [260, 270, 280, 290, 300] },
        { count: 8, widths: [250, 260, 270, 280, 290, 300, 310, 320] },
        { count: 9, widths: [260, 270, 280, 290, 300, 310, 320, 330, 340] },
        { count: 3, widths: [300, 310, 320] },
        { count: 7, widths: [250, 260, 270, 280, 290, 300, 310] },
    ], []);


    console.log(useAppSelector((state) => state.list))

    return (
        <>
            <Table sx={table} stickyHeader aria-label="sticky table">
                
                {/* 
                    may need to be memorialized
                    for now, the component is small.
                */}

                {isLoading && queueIngredints.length === 0
                    ?
                    <>
                        <SkeletonHeader></SkeletonHeader>
                        {skeletonDataMemo.map((block, idx) => (
                            <SkeletonTable
                                key={idx}
                                count={block.count}
                                widths={block.widths}
                            />
                        ))}
                    </>
                    
                    :
                    !isLoading && queueIngredints.length === 0 ?

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
                                {sortedList.map((el, indx) => ( 
                                    <MainTableBody
                                        key={el.ingredient_id}
                                        props={{ ingredient_id: el.ingredient_id, priority:indx === 0}} 
                                    />
                                ))}
                            </TableBody>
                        </>
                }

            </Table>

            <AddNewIngredient></AddNewIngredient>

            {
                !isLoading && Object.keys(ingredientsMap).length > 0 ?
                    <Button
                        disabled={currentPage === null ? true : false}
                        color='blackRedBtn'
                        onClick={() => handleMore()}
                        sx={moreButton}
                    >More</Button>
                    :
                    isLoading && Object.keys(ingredientsMap).length > 0 ?
                        <UXLoading position={'static'}></UXLoading>
                        :
                        <></>

            }

        </>

    )
}