import { theme } from "@/config/ThemeMUI/theme";
import { Box, Button, IconButton, Menu, MenuItem, TableCell, useMediaQuery } from "@mui/material";
import { MouseEvent, useState } from "react";
import MoreVertIcon from '@mui/icons-material/MoreVert';
import AddShoppingCartIcon from '@mui/icons-material/AddShoppingCart';
import ClearIcon from '@mui/icons-material/Clear';
import { AddNewUnit } from "./add-unit";
import { btnsListUnitHover, styleBtnsAdaptiveMenu } from "@/app/(main)/(main-list)/style";
import { useAppDispatch, useAppSelector } from "@/state/hook";
import { deleteIngredientFetch, toggleShopIngrFetch } from "@/state/slices/list-slice";
import { IListObj } from "@/app/types/types";
import ShoppingBagOutlinedIcon from '@mui/icons-material/ShoppingBagOutlined';
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined';


interface DataProps{
    el: IListObj
}


export function MainButtons({props}: {props:DataProps}) {
    const {el} = props

    const dispatch = useAppDispatch()
    const userStore = useAppSelector(state => state.user)
    const id = userStore?.user?.connection_id


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
            dispatch(toggleShopIngrFetch({ _id, shop_ingr }))
        }
    }

    function deleteIngredient(_id: string) {
        if (id !== '') {
            console.log(_id)
            dispatch(deleteIngredientFetch({ _id }))
        }
    }
    
    return (


        <TableCell sx={{ width: '155px', [theme.breakpoints.down(1050)]: { width: "30px" } }}>



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

                        <MenuItem onClick={(e) => {
                            e.preventDefault()
                            handleClose
                        }} >
                            <AddNewUnit props={{ ingr: el, id, handleClose }} />
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
                <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                    <Button onClick={() => toggleShopIngr(el._id, el.shop_ingr)} sx={btnsListUnitHover}>
                        <ShoppingBagOutlinedIcon />
                    </Button>

                    <AddNewUnit props={{ ingr: el, id }} />

                    <Button onClick={() => deleteIngredient(el._id)} sx={btnsListUnitHover}>
                        <DeleteOutlineOutlinedIcon />
                    </Button>
                </Box>
            )}

        </TableCell>
    )
}