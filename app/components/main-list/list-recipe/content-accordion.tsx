import { IListObj, UnitsList } from "@/app/types/types"
import { useAppDispatch, useAppSelector } from "@/state/hook"
import { AccordionDetails, Box, Button, List, ListItem, ListItemAvatar, ListItemText, Table, TableBody, useMediaQuery } from "@mui/material"
import { Swiper, SwiperSlide } from "swiper/react"
import { Units } from "../list/units"
import 'swiper/css';
import 'swiper/css/navigation';
import { Navigation } from 'swiper/modules';
import './swiper-list-recipe.css';
import { blockSwiperAccordion, btnsListUnitHover, contentAccordionList, imgIngrList, nameIngredient } from "@/app/(main)/(main-list)/style"
import ArrowRightIcon from '@mui/icons-material/ArrowRight';
import ArrowLeftIcon from '@mui/icons-material/ArrowLeft';
import { AddNewUnit } from "../list/add-unit"
import ShoppingBagOutlinedIcon from '@mui/icons-material/ShoppingBagOutlined';
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined';
import { deleteIngrRecipeList, shopIngrListRecipe } from "@/state/slices/list-recipe-slice"
import { theme } from "@/config/ThemeMUI/theme"
import { MainTableHeader } from "../main-table-header"
import { useMemo, useState } from "react"
import { MainTableBody } from "../main-table-body"



interface dataProps {
    ingredients_list: IListObj[],
    connection_id: string,
    recipe_id: string
}



export function ContentAccordion({ props }: { props: dataProps }) {
    const { ingredients_list, connection_id, recipe_id } = props
    const dispatch = useAppDispatch()
    // const listStore = useAppSelector(state => state.list)
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



    // function deleteIngredient(ingredient_id: string) {
    //     console.log('deleteIngredient')
    //     if (connection_id !== '') {
    //         //     console.log(ingredient_id, id)
    //         dispatch(deleteIngrRecipeList({ ingredient_id, connection_id, recipe_id }))
    //     }
    // }

    // function toggleShopIngr(ingredient_id: string, shop_ingr: boolean) {
    //     console.log('toggleShopIngr')
    //     if (connection_id !== '') {
    //         //     console.log(ingredient_id, id)
    //         dispatch(shopIngrListRecipe({ ingredient_id, connection_id, shop_ingr, recipe_id }))
    //     }
    // }

    // console.log(sortedList)
    return (
        <AccordionDetails sx={{ overflow: 'auto', height: '100%', bgcolor: 'background.default', borderRadius: '0 0 20px 20px' }}>
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
                    {sortedList.map(el => (
                        <MainTableBody key={el._id}  props={{
                            el
                        }}></MainTableBody>
                    ))}
                </TableBody>


            </Table>
        </AccordionDetails>

    )
}
// {ingredients_list.map((el) => (
//                     <ListItem key={el._id} sx={{ ...contentAccordionList, opacity: `${el.shop_ingr ? 0.4 : 1}` }}>

//                         <ListItemAvatar sx={{ ...imgIngrList, display: 'block', width: '45px', height: '45px', mr:'10px' }}>
//                             <Box component={'img'} src={el.media !== '' ? el.media : 'images/load-ingr.svg'} alt={el.name} sx={imgIngrList}></Box>
//                         </ListItemAvatar>
//                         <Box sx={{ maxWidth: '150px', width: '100%', mr:'10px' }}>
//                             <ListItemText
//                                 sx={nameIngredient}
//                                 primary={el.name}
//                             />
//                         </Box >
//                         <Box sx={{ ...blockSwiperAccordion, display: 'block', mr:'10px' }}>
//                             <Swiper
//                                 navigation={{
//                                     prevEl: '.custom-prev-recipe-list',
//                                     nextEl: '.custom-next-recipe-list',

//                                 }}
//                                 className="swiper-recipe-list"
//                                 slidesPerView={'auto'}
//                                 modules={[Navigation]}
//                                 spaceBetween={10}
//                             >
//                                 {el.units.map((elem: UnitsList) => (
//                                     <SwiperSlide key={elem._id} className="slide-recipe-list">
//                                         <Units el={el} elem={elem} id={connection_id} recipe_id={recipe_id} />
//                                     </SwiperSlide>


//                                 ))}

//                                 <div className="custom-prev-recipe-list ">
//                                     <ArrowLeftIcon></ArrowLeftIcon>
//                                 </div>
//                                 <div className="custom-next-recipe-list ">
//                                     <ArrowRightIcon></ArrowRightIcon>
//                                 </div>
//                             </Swiper>
//                         </Box >
//                         <Box sx={{ width: 'auto', }}>
//                             <Button onClick={() => toggleShopIngr(el._id, el.shop_ingr)} sx={btnsListUnitHover}>
//                                 <ShoppingBagOutlinedIcon></ShoppingBagOutlinedIcon>
//                             </Button >

//                             <AddNewUnit props={{ ingr: el, id: connection_id, recipe_id }}></AddNewUnit>

//                             <Button onClick={() => deleteIngredient(el._id)} sx={btnsListUnitHover}>
//                                 <DeleteOutlineOutlinedIcon></DeleteOutlineOutlinedIcon>
//                             </Button>
//                         </Box >
//                     </ListItem>
//                 ))
//                 }