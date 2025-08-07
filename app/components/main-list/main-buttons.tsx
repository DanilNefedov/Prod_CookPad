import { theme } from "@/config/ThemeMUI/theme";
import { Box, Button, IconButton, Menu, MenuItem, TableCell, useMediaQuery } from "@mui/material";
import { memo, MouseEvent, useState } from "react";
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
import { useUnitContext } from "@/config/unit-context/unit-context";
import { shallowEqual } from "react-redux";


interface Props{
    ingredient_id: string,
    recipe_id?:string
    ingredient_shop:boolean
}

const MainButtons = memo((props: Props) => {// 
    const {ingredient_id, recipe_id, ingredient_shop} = props
// export function MainButtons({props}: {props:Props}) {
    // const shop_ingr = useAppSelector(state => state.list.ingredients[ingredient_id].shop_ingr)
    

    const dispatch = useAppDispatch()
    const userStore = useAppSelector(state => state.user)
    const id = userStore?.user?.connection_id
    const pathName = usePathname()
    const isSmallScreen = useMediaQuery("(max-width:1150px)");
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    // const shopStatus = useAppSelector(state => {
    //     if(recipe_id) return state.listRecipe.operations.shopIngrListRecipe.loading
    //     return state.list.operations.toggleShopIngrFetch.loading
    // }, shallowEqual)

    const [shopStatus, setShopStatus] = useState<boolean>(false)
    const open = Boolean(anchorEl);


    const handleClick = (event: MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };


    const handleClose = () => {
        setAnchorEl(null);
    };


    function toggleShopIngr(_id: string, shop_ingr: boolean) {
        if(shopStatus) return
        setShopStatus(true)

        if (id !== '') {
            if(pathName === '/list'){
                dispatch(toggleShopIngrFetch({ _id, shop_ingr })).finally(() =>{setShopStatus(false)})     
            }else if(pathName === '/list-recipe' && recipe_id){
                dispatch(shopIngrListRecipe({ ingredient_id:ingredient_id, connection_id:id, shop_ingr, _id:recipe_id })).finally(() =>{setShopStatus(false)})    
            }
        }
    }

    function deleteIngredient(_id: string) {
        if (id !== '') {
            if(pathName === '/list'){
                dispatch(deleteIngredientFetch({ _id }))
            }else if(pathName === '/list-recipe' && recipe_id){
                dispatch(deleteIngrRecipeList({ ingredient_id:ingredient_id, connection_id:id, _id:recipe_id }))
            }
            
        }
    }
    console.log('main-btns')

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
                                onClick={() => toggleShopIngr(ingredient_id, ingredient_shop)} 
                                sx={[btnsListUnitHover, styleBtnsAdaptiveMenu]}
                                
                            >
                                <ShoppingBagOutlinedIcon /> 
                                <span>Shop</span>
                            </Button>
                        </MenuItem>

                        <MenuItem sx={modileMenuMainBtnsItem}>
                            {/* <AddNewUnit props={{ ingr: thisIngredient, id, recipe_id }} /> */}
                        </MenuItem>
                

                        <MenuItem onClick={handleClose} sx={modileMenuMainBtnsItem}>
                            <Button onClick={() => deleteIngredient(ingredient_id)} sx={[btnsListUnitHover, styleBtnsAdaptiveMenu]}>
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
                        onClick={() => toggleShopIngr(ingredient_id, ingredient_shop)} 
                        sx={btnsListUnitHover}
                        color="grayButton"
                    >
                        <ShoppingBagOutlinedIcon />
                    </Button>

                    {/* <AddNewUnit props={{ ingr: thisIngredient, id, recipe_id, }} /> */}

                    <Button 
                        onClick={() => deleteIngredient(ingredient_id)} 
                        sx={btnsListUnitHover}
                        color="grayButton"
                    >
                        <DeleteOutlineOutlinedIcon />
                    </Button>
                </Box>
            )}

        </TableCell>
    )
},
(prevProps, nextProps) => {
    return prevProps.recipe_id === nextProps.recipe_id && 
    prevProps.ingredient_id === nextProps.ingredient_id && 
    prevProps.ingredient_shop === nextProps.ingredient_shop
}
)

MainButtons.displayName = "MainButtons"


export default MainButtons