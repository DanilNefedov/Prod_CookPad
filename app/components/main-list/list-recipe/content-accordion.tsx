import { IListObj, UnitsList } from "@/app/types/types"
import { useAppDispatch, useAppSelector } from "@/state/hook"
import { AccordionDetails, Box, Button, List, ListItem, ListItemAvatar, ListItemText, Table, TableBody, useMediaQuery } from "@mui/material"
import { Swiper, SwiperSlide } from "swiper/react"
import { Units } from "../list/units"
import 'swiper/css';
import 'swiper/css/navigation';
import { Navigation } from 'swiper/modules';
// import '../list/styles.css';
import { blockSwiperAccordion, btnsListUnitHover, contentAccordionList, imgIngrList, nameIngredient } from "@/app/(main)/(main-list)/style"
import ArrowRightIcon from '@mui/icons-material/ArrowRight';
import ArrowLeftIcon from '@mui/icons-material/ArrowLeft';
import { AddNewUnit } from "../list/add-unit"
import ShoppingBagOutlinedIcon from '@mui/icons-material/ShoppingBagOutlined';
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined';
import { deleteIngrRecipeList, shopIngrListRecipe } from "@/state/slices/list-recipe-slice"
import { theme } from "@/config/ThemeMUI/theme"
import { MainTableHeader } from "../main-table-header"
import { memo, useMemo, useState } from "react"
import { MainTableBody } from "../main-table-body"



interface dataProps {
    recipe_id: string
}



export const ContentAccordion = memo(({ props }: { props: dataProps }) => {
    const {recipe_id } = props
    const ingredients_list = useAppSelector(state => state.listRecipe.recipes.find(el => el.recipe_id === recipe_id)?.ingredients_list)
    if(!ingredients_list) return null 
    const [sortOrder, setSortOrder] = useState<'asc' | 'desc' | null>(null);
    const [sortBy, setSortBy] = useState<string | null>(null);



    const sortedList = useMemo(() => {
        if (!sortBy) return ingredients_list;

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
                        {sortedList.map(el => (
                            <MainTableBody key={el._id} props={{
                                ingredient_id:el._id,
                                recipe_id
                            }}></MainTableBody>
                        ))}
                    </TableBody>


                </Table>
            

        </AccordionDetails>

    )
}, (prevProps, nextProps) => {
    return prevProps.props.recipe_id === nextProps.props.recipe_id;
});