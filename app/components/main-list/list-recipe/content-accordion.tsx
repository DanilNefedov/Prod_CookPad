import {  useAppSelector } from "@/state/hook"
import { AccordionDetails, Table, TableBody, TableCell, TableRow,  } from "@mui/material"
import { theme } from "@/config/ThemeMUI/theme"
import { MainTableHeader } from "../main-table-header"
import { memo, useMemo, useState } from "react"
import { UXLoading } from "../../ui-helpers/loading"
import dynamic from "next/dynamic"

const MainTableBody = dynamic(() => import('../main-table-body'), {
    ssr: false, 
});





interface Props {
    _id: string,
    status:boolean
}



export const ContentAccordion = memo(({ props }: { props: Props }) => {
    const {_id, status } = props   
    const ingredients_list = useAppSelector(state => state.listRecipe.recipes.find(el => el._id === _id)?.ingredients_list);
    const [sortOrder, setSortOrder] = useState<'asc' | 'desc' | null>(null);
    const [sortBy, setSortBy] = useState<string | null>(null);

    

    // const ingredients_list = []

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
                    ? b.units.length - a.units.length
                    : a.units.length - b.units.length;
            }
            return 0;
        });
    }, [sortBy, sortOrder, ingredients_list]);

    if (!ingredients_list) return null; 

    
    return (
        <AccordionDetails sx={{ p: '0', overflow: 'auto', height: '100%', bgcolor: 'background.default', borderRadius: '10px' }}>

            
                <Table

                    sx={{
                        // mb:'20px',
                        minWidth: '0', '& .MuiTableCell-root': {
                            bgcolor: 'background.paper',
                            p: '7px 14px', [theme.breakpoints.down(1050)]: { p: '9px 7px' },
                            [theme.breakpoints.down(400)]: { p: '8px 3px' }
                        },
                        // bgcolor:'background.paper'
                    }} stickyHeader aria-label="sticky table">
                    <MainTableHeader props={{
                        sortOrder,
                        setSortOrder,
                        sortBy,
                        setSortBy
                    }}></MainTableHeader>

                    <TableBody sx={{ overflow: 'auto', borderTop: '2px solid rgba(255, 0, 0, 0.12)' }}>
                        {
                        status && ingredients_list.length === 0  ?
                            <TableRow>
                                <TableCell 
                                colSpan={999} 
                                sx={{
                                    backgroundColor:'transparent', 
                                    border:'0', 
                                    width:"100%",
                                    
                                }}>
                                    <UXLoading position="static"></UXLoading>
                                </TableCell>
                            </TableRow> 
                            :
                            sortedList && sortedList.map(el => (
                                <MainTableBody key={el._id} props={{
                                    ingredient_id:el._id,
                                    recipe_id:_id
                                }}></MainTableBody>
                            ))
                        }
                    </TableBody>


                </Table>
            

        </AccordionDetails>

    )
}, (prevProps, nextProps) => {
    return prevProps.props._id === nextProps.props._id &&
    prevProps.props.status === nextProps.props.status
});


ContentAccordion.displayName = "ContentAccordion"