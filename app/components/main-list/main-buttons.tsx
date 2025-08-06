import { theme } from "@/config/ThemeMUI/theme";
import { Box, Button, IconButton, Menu, MenuItem, TableCell, useMediaQuery } from "@mui/material";
import { MouseEvent, useState } from "react";
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { AddNewUnit } from "./add-unit";
import { btnsListUnitHover, iconMenuMainBtns, mainButtonsBox, mainButtonsCell, mobileMenuMainBtns, modileMenuMainBtnsItem, styleBtnsAdaptiveMenu } from "@/app/(main)/(main-list)/style";
import { useAppDispatch, useAppSelector } from "@/state/hook";
import { deleteIngredientFetch, toggleShopIngrFetch } from "@/state/slices/list-slice";
import ShoppingBagOutlinedIcon from '@mui/icons-material/ShoppingBagOutlined';
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined';
import { usePathname } from "next/navigation";
import { deleteIngrRecipeList, shopIngrListRecipe } from "@/state/slices/list-recipe-slice";
import { ListIngrData } from "@/app/(main)/(main-list)/list/types";


interface Props{
    el: ListIngrData,
    recipe_id?:string
}


export function MainButtons({props}: {props:Props}) {
    const {el, recipe_id} = props

    const dispatch = useAppDispatch()
    const userStore = useAppSelector(state => state.user)
    const id = userStore?.user?.connection_id
    const pathName = usePathname()
    const isSmallScreen = useMediaQuery("(max-width:1150px)");
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const shopStatus = useAppSelector(state => {
        if(recipe_id) return state.listRecipe.operations.shopIngrListRecipe.loading
        return state.list.operations.toggleShopIngrFetch.loading
    })

    const open = Boolean(anchorEl);


    const handleClick = (event: MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };


    const handleClose = () => {
        setAnchorEl(null);
    };


    function toggleShopIngr(_id: string, shop_ingr: boolean) {
        if(shopStatus) return

        if (id !== '') {
            if(pathName === '/list'){
                dispatch(toggleShopIngrFetch({ _id, shop_ingr }))            
            }else if(pathName === '/list-recipe' && recipe_id){
                dispatch(shopIngrListRecipe({ ingredient_id:el.ingredient_id, connection_id:id, shop_ingr, _id:recipe_id }))
            }
        }
    }

    function deleteIngredient(_id: string) {
        if (id !== '') {
            if(pathName === '/list'){
                dispatch(deleteIngredientFetch({ _id }))
            }else if(pathName === '/list-recipe' && recipe_id){
                dispatch(deleteIngrRecipeList({ ingredient_id:el.ingredient_id, connection_id:id, _id:recipe_id }))
            }
            
        }
    }

    return (
        <TableCell className="ignore-toggle" sx={mainButtonsCell}>

            {isSmallScreen ? (
                <>
                    <IconButton
                        id="demo-positioned-button"
                        aria-controls={open ? 'demo-positioned-menu' : undefined}
                        aria-haspopup="true"
                        aria-expanded={open ? 'true' : undefined}
                        onClick={handleClick}
                        sx={mobileMenuMainBtns}
                    >
                        <MoreVertIcon sx={iconMenuMainBtns} />
                    </IconButton>

                    <Menu 
                        sx={{width:'100%'}} 
                        anchorEl={anchorEl} 
                        open={Boolean(anchorEl)} 
                        onClose={handleClose}
                        slotProps={{
                            root:{
                                sx:{
                                    '& .MuiPaper-root':{
                                        borderRadius:'10px',
                                    },
                                    '& .MuiList-root':{
                                        p:'6px 0'
                                    }
                                }
                            }
                        }}  
                    >
                        {/* <Box sx={{ display: "flex", justifyContent: "space-between" }}> */}
                        <MenuItem onClick={handleClose} sx={modileMenuMainBtnsItem}>
                            <Button 
                                onClick={() => toggleShopIngr(el.ingredient_id, el.shop_ingr)} 
                                sx={[btnsListUnitHover, styleBtnsAdaptiveMenu]}
                                
                            >
                                <ShoppingBagOutlinedIcon /> 
                                <span>Shop</span>
                            </Button>
                        </MenuItem>

                        <MenuItem sx={modileMenuMainBtnsItem}>
                            <AddNewUnit props={{ ingr: el, id, recipe_id }} />
                        </MenuItem>
                

                        <MenuItem onClick={handleClose} sx={modileMenuMainBtnsItem}>
                            <Button onClick={() => deleteIngredient(el.ingredient_id)} sx={[btnsListUnitHover, styleBtnsAdaptiveMenu]}>
                                <DeleteOutlineOutlinedIcon /> 
                                <span>Delete</span>
                            </Button>
                        </MenuItem>

                        {/* </Box> */}
                    </Menu>

                    
                </>
            ) : (
                <Box sx={mainButtonsBox}>
                    <Button 
                        onClick={() => toggleShopIngr(el.ingredient_id, el.shop_ingr)} 
                        sx={btnsListUnitHover}
                        color="grayButton"
                    >
                        <ShoppingBagOutlinedIcon />
                    </Button>

                    <AddNewUnit props={{ ingr: el, id, recipe_id, }} />

                    <Button 
                        onClick={() => deleteIngredient(el.ingredient_id)} 
                        sx={btnsListUnitHover}
                        color="grayButton"
                    >
                        <DeleteOutlineOutlinedIcon />
                    </Button>
                </Box>
            )}

        </TableCell>
    )
}