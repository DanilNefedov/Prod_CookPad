import { theme } from "@/config/ThemeMUI/theme";
import { Box, Button, IconButton, Menu, MenuItem, TableCell, useMediaQuery } from "@mui/material";
import { MouseEvent, useState } from "react";
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { AddNewUnit } from "./add-unit";
import { btnsListUnitHover, styleBtnsAdaptiveMenu } from "@/app/(main)/(main-list)/style";
import { useAppDispatch, useAppSelector } from "@/state/hook";
import { deleteIngredientFetch, toggleShopIngrFetch } from "@/state/slices/list-slice";
import { IListObj } from "@/app/types/types";
import ShoppingBagOutlinedIcon from '@mui/icons-material/ShoppingBagOutlined';
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined';
import { usePathname } from "next/navigation";
import { deleteIngrRecipeList, shopIngrListRecipe } from "@/state/slices/list-recipe-slice";


interface DataProps{
    el: IListObj,
    recipe_id?:string
}


export function MainButtons({props}: {props:DataProps}) {
    const {el, recipe_id} = props

    const dispatch = useAppDispatch()
    const userStore = useAppSelector(state => state.user)
    const id = userStore?.user?.connection_id
    const pathName = usePathname()
    const isSmallScreen = useMediaQuery("(max-width:800px)");
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const open = Boolean(anchorEl);


    const handleClick = (event: MouseEvent<HTMLElement>) => {
      setAnchorEl(event.currentTarget);
    };


    const handleClose = () => {
      setAnchorEl(null);
    };


    function toggleShopIngr(_id: string, shop_ingr: boolean) {
        if (id !== '') {
            if(pathName === '/list'){
                dispatch(toggleShopIngrFetch({ _id, shop_ingr }))            
            }else if(pathName === '/list-recipe' && recipe_id){
                dispatch(shopIngrListRecipe({ ingredient_id:el._id, connection_id:id, shop_ingr, _id:recipe_id }))
            }
        }
    }

    function deleteIngredient(_id: string) {
        if (id !== '') {
            if(pathName === '/list'){
                dispatch(deleteIngredientFetch({ _id }))
            }else if(pathName === '/list-recipe' && recipe_id){
                dispatch(deleteIngrRecipeList({ ingredient_id:el._id, connection_id:id, _id:recipe_id }))
            }
            
        }
    }

    return (
        <TableCell className="ignore-toggle" sx={{  [theme.breakpoints.down(1050)]: { width: "30px" } }}>

            {isSmallScreen ? (
                <>
                    <IconButton
                        id="demo-positioned-button"
                        aria-controls={open ? 'demo-positioned-menu' : undefined}
                        aria-haspopup="true"
                        aria-expanded={open ? 'true' : undefined}
                        onClick={handleClick}
                        sx={{ color: '#8E94A4', maxWidth: '20px', width: '20px', height: '25px', padding: '0' }}
                    >
                        <MoreVertIcon sx={{ width: '100%', height: '100%' }} />
                    </IconButton>

                    <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleClose}>
                        {/* <Box sx={{ display: "flex", justifyContent: "space-between" }}> */}
                        <MenuItem onClick={handleClose} >
                            <Button onClick={() => toggleShopIngr(el._id, el.shop_ingr)} sx={[btnsListUnitHover, styleBtnsAdaptiveMenu]}>
                                <ShoppingBagOutlinedIcon /> 
                                <span>Shop</span>
                            </Button>
                        </MenuItem>

                        <MenuItem  >
                            <AddNewUnit props={{ ingr: el, id, recipe_id }} />
                        </MenuItem>
                

                        <MenuItem onClick={handleClose} >
                            <Button onClick={() => deleteIngredient(el._id)} sx={[btnsListUnitHover, styleBtnsAdaptiveMenu]}>
                                <DeleteOutlineOutlinedIcon /> 
                                <span>Delete</span>
                            </Button>
                        </MenuItem>

                        {/* </Box> */}
                    </Menu>

                    
                </>
            ) : (
                <Box sx={{ display: "flex", justifyContent: "space-between", maxWidth:'130px', width:'100%', minWidth:'0' }}>
                    <Button onClick={() => toggleShopIngr(el._id, el.shop_ingr)} sx={btnsListUnitHover}>
                        <ShoppingBagOutlinedIcon />
                    </Button>

                    <AddNewUnit props={{ ingr: el, id, recipe_id, }} />

                    <Button onClick={() => deleteIngredient(el._id)} sx={btnsListUnitHover}>
                        <DeleteOutlineOutlinedIcon />
                    </Button>
                </Box>
            )}

        </TableCell>
    )
}