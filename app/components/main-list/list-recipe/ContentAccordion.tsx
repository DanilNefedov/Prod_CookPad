import {  useAppSelector } from "@/state/hook"
import { AccordionDetails, Box, Button, Table, TableBody, TableCell, TableRow,  } from "@mui/material"
import MainTableHeader from "../MainTableHeader"
import { memo, useMemo, useState } from "react"
import { UXLoading } from "../../ui-helpers/UXLoading"
import dynamic from "next/dynamic"
import { selectIngredientsListByRecipeId } from "@/state/selectors/list-recipe"
import { accordionMain, accordionTable, accordionTableBody, accorionCell } from "@/app/(main)/(main-list)/list-recipe/styles"
import { RecipeButtons } from "./RecipeButtons"

const MainTableBody = dynamic(() => import('../MainTableBody'), {
    ssr: false, 
});



interface Props {
    _id: string,
    status:boolean
}



const ContentAccordion = memo(({ props }: { props: Props }) => {
    const {_id, status } = props   
    const ingredients_list = useAppSelector(state => selectIngredientsListByRecipeId(state, _id));

    const [sortOrder, setSortOrder] = useState<'asc' | 'desc' | null>(null);
    const [sortBy, setSortBy] = useState<string | null>(null);
 
    const sortedList = useMemo(() => {
        if (!sortBy) return ingredients_list;
        if (!ingredients_list) return null;

        return [...ingredients_list].sort((a, b) => {
            if (sortBy === 'name') {
            return sortOrder === 'asc'
                ? a.name.localeCompare(b.name)
                : b.name.localeCompare(a.name);
            } else if (sortBy === 'unit') {
            return sortOrder === 'desc'
                ? b.unit_ids.length - a.unit_ids.length
                : a.unit_ids.length - b.unit_ids.length;
            }
            return 0;
        });
    }, [sortBy, sortOrder, ingredients_list]);


    if (!ingredients_list) return null; 

    return (
        <AccordionDetails sx={accordionMain}>
            <Table
                sx={accordionTable} stickyHeader aria-label="sticky table">
                <MainTableHeader props={{
                    sortOrder,
                    setSortOrder,
                    sortBy,
                    setSortBy
                }}></MainTableHeader>

                <TableBody sx={accordionTableBody}>
                    {
                    status && ingredients_list.length === 0  ?
                        <TableRow>
                            <TableCell 
                            colSpan={999} 
                            sx={accorionCell}>
                                <UXLoading position="static"></UXLoading>
                            </TableCell>
                        </TableRow> 
                        :
                        sortedList && sortedList.map(el => (
                            <MainTableBody key={el.ingredient_id} props={{
                                ingredient_id:el.ingredient_id,
                                recipe_id:_id,
                                priority:false
                            }}></MainTableBody>
                        ))
                    }
                </TableBody>


            </Table>
            
            <RecipeButtons recipeId={_id}></RecipeButtons>

        </AccordionDetails>

    )
}, (prevProps, nextProps) => {
    return prevProps.props._id === nextProps.props._id &&
    prevProps.props.status === nextProps.props.status
});


ContentAccordion.displayName = "ContentAccordion"

export default ContentAccordion 