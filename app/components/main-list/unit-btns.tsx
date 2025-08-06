import { Button, MenuItem } from "@mui/material";
import ShoppingBagOutlinedIcon from '@mui/icons-material/ShoppingBagOutlined';
import { unitButton, unitMenuItem } from "@/app/(main)/(main-list)/style";
import { useAppDispatch, useAppSelector } from "@/state/hook";
import { shallowEqual } from "react-redux";
import { usePathname } from "next/navigation";
import { changeAmountFetch, deleteUnitIngrFetch, shopUnitUpdate } from "@/state/slices/list-slice";
import { deleteUnitListRecipe, newAmountListRecipe, shopUnitListRecipe } from "@/state/slices/list-recipe-slice";
import { memo, useCallback, useState } from "react";
import EditIcon from '@mui/icons-material/Edit';
import CheckIcon from '@mui/icons-material/Check';
import { evaluate } from "mathjs";
import { CalcUnit } from "./calc-unit";
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined';
import { useUnitContext } from "@/config/unit-context/unit-context";


interface Props {
    isInsideMenu:boolean, 
    state_shop:boolean,
    handleOpenInput:(value: string) => void
    isIputOpen:string
    newAmount:string
}


export const UnitBtns = memo(({isInsideMenu, state_shop, handleOpenInput, isIputOpen, newAmount}:Props) => {
    const { recipe_id, ingredient_id, unit_id } = useUnitContext();
    
    const userStore = useAppSelector(state => state.user);
    const id = userStore?.user?.connection_id;
    const pathName = usePathname();
    const dispatch = useAppDispatch();
    
    function toggleShopUnit(_id: string | undefined, shop_unit: boolean | undefined) {
        // if (state_shop) return

        if (id !== '' && shop_unit !== undefined && _id) {
            if (pathName === '/list') {
                dispatch(shopUnitUpdate({ ingredient_id: ingredient_id, unit_id: _id, shop_unit }))
            }
            else if (pathName === '/list-recipe' && recipe_id) {
                dispatch(shopUnitListRecipe({ connection_id: id, ingredient_id: ingredient_id, unit_id: _id, shop_unit, _id: recipe_id }))
            }

        }
    }


    const confirmAmount = useCallback((_id: string | undefined, ingredientId: string) => {
        if(newAmount === '0') return

        const numberAmount = evaluate(newAmount)

        if (id !== '' && _id) {//numberAmount !== thisUnit?.amount
            if (pathName === '/list') {
                dispatch(changeAmountFetch({ ingredient_id: ingredientId, unit_id: _id, amount: numberAmount }));
            } else if (pathName === '/list-recipe' && recipe_id) {
                dispatch(newAmountListRecipe({ connection_id: id, ingredient_id: ingredientId, unit_id: _id, amount: numberAmount, _id: recipe_id }))
            }

            handleOpenInput('')
        }
        // dispatch(openInput(''));
    }, [id, newAmount, pathName, dispatch, recipe_id]);


    function deleteUnitIngr(ingredient_id: string, unit_id: string | undefined) {
        if (id !== '' && unit_id) {
            if (pathName === '/list') {
                dispatch(deleteUnitIngrFetch({ ingredient_id, unit_id }))
            }
            else if (pathName === '/list-recipe' && recipe_id) {
                dispatch(deleteUnitListRecipe({ ingredient_id, connection_id: id, unit_id, _id: recipe_id }))
            }

        }
    }
    
    
    // console.log(isIputOpen, unit_id)
    const wrap = (node: React.ReactNode) => isInsideMenu ? (
        <MenuItem sx={unitMenuItem}> 
        {/* onClick={handleClose} */}
            {node}
        </MenuItem>
    ) : (
        <>{node}</>
    );

    return(
        // unitData !== null && thisUnit?._id ?
        <>
            {wrap(
                <Button
                    onClick={() => toggleShopUnit(unit_id, state_shop)}//thisUnit?.shop_unit
                    sx={unitButton}
                    color="blackBtn"
                >
                    <ShoppingBagOutlinedIcon color="primary" />
                </Button>
            )}

            {wrap(
                isIputOpen !== unit_id ? (
                    <Button
                        onClick={() => {
                            console.log(unit_id)
                            handleOpenInput(unit_id)
                            // dispatch(openInput(unit_id))
                        }}
                        sx={unitButton}
                        color="blackBtn"
                    >
                        <EditIcon color="primary" />
                    </Button>
                ) : (
                    <Button
                        onClick={() => confirmAmount(unit_id, ingredient_id)}
                        sx={unitButton}
                        color="blackBtn"
                    >
                        <CheckIcon color="primary" />
                    </Button>
                )
            )}

            {wrap(
                <CalcUnit/>
            )}

            {wrap(
                <Button
                    onClick={() => deleteUnitIngr(ingredient_id, unit_id)}
                    sx={unitButton}
                    color="blackBtn"
                >
                    <DeleteOutlineOutlinedIcon color="primary" />
                </Button>
            )}

        </>
        
    )
},(prevProps, nextProps) => {
    return prevProps.isInsideMenu === nextProps.isInsideMenu &&
    prevProps.state_shop === nextProps.state_shop &&
    prevProps.isIputOpen === nextProps.isIputOpen && 
    prevProps.newAmount === nextProps.newAmount
})


