import { IListObj, UnitsList } from "@/app/types/types"
import { useAppDispatch } from "@/state/hook"
import { AccordionDetails, Box, Button, List, ListItem, ListItemAvatar, ListItemText } from "@mui/material"
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
import { shopIngrListRecipe } from "@/state/slices/list-recipe-slice"



interface dataProps {
    ingredients_list: IListObj[],
    connection_id: string,
    recipe_id: string
}



export function ContentAccordion({ props }: { props: dataProps }) {
    const { ingredients_list, connection_id, recipe_id } = props
    const dispatch = useAppDispatch()


    function deleteIngredient(ingredient_id: string) {
        console.log('deleteIngredient')
        // if (id && id !== null) {
        //     console.log(ingredient_id, id)
        //     dispatch(deleteIngrRecipeList({ ingredient_id, connection_id: id, recipe_id }))
        // }
    }

    function toggleShopIngr(ingredient_id: string, shop_ingr: boolean) {
        console.log('toggleShopIngr')
        if (connection_id !== '') {
        //     console.log(ingredient_id, id)
            dispatch(shopIngrListRecipe({ ingredient_id, connection_id, shop_ingr, recipe_id }))
        }
    }


    return (
        <AccordionDetails sx={{overflow:'auto', height:'100%', bgcolor:'background.default', borderRadius:'0 0 20px 20px'}}>

            {ingredients_list.map((el) => (
                <List key={el._id} sx={{ ...contentAccordionList, opacity: `${el.shop_ingr ? 0.4 : 1}` }}>

                    <ListItemAvatar sx={{ ...imgIngrList, display: 'block', width:'35px', height:'35px' }}>
                        <Box component={'img'} src={el.media !== '' ? el.media : 'images/load-ingr.svg'} alt={el.name} sx={imgIngrList}></Box>
                    </ListItemAvatar>
                    <ListItem sx={{ maxWidth: '150px', width: '100%' }}>
                        <ListItemText
                            sx={nameIngredient}
                            primary={el.name}
                        />
                    </ListItem >
                    <ListItem sx={{ ...blockSwiperAccordion, display: 'block' }}>
                        <Swiper
                            navigation={{
                                prevEl: '.custom-prev-recipe-list',
                                nextEl: '.custom-next-recipe-list',

                            }}
                            className="swiper-recipe-list"
                            slidesPerView={'auto'}
                            modules={[Navigation]}
                            spaceBetween={10}
                        >
                            {el.units.map((elem: UnitsList) => (
                                <SwiperSlide key={elem._id} className="slide-recipe-list">
                                    <Units el={el} elem={elem} id={connection_id} recipe_id={recipe_id} />
                                </SwiperSlide>


                            ))}

                            <div className="custom-prev-recipe-list ">
                                <ArrowLeftIcon></ArrowLeftIcon>
                            </div>
                            <div className="custom-next-recipe-list ">
                                <ArrowRightIcon></ArrowRightIcon>
                            </div>
                        </Swiper>
                    </ListItem >
                    <ListItem sx={{ width: 'auto' }}>
                        <Button onClick={() => toggleShopIngr(el._id, el.shop_ingr)} sx={btnsListUnitHover}>
                            <ShoppingBagOutlinedIcon></ShoppingBagOutlinedIcon>
                        </Button >

                        <AddNewUnit props={{ ingr: el, id: connection_id, recipe_id }}></AddNewUnit>

                        <Button onClick={() => deleteIngredient(el._id)} sx={btnsListUnitHover}>
                            <DeleteOutlineOutlinedIcon></DeleteOutlineOutlinedIcon>
                        </Button>
                    </ListItem >
                </List>
            ))
            }


        </AccordionDetails>

    )
}