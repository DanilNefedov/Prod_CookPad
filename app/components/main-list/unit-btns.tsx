import { Button, MenuItem } from "@mui/material";
import ShoppingBagOutlinedIcon from '@mui/icons-material/ShoppingBagOutlined';
import { unitButton, unitMenuItem } from "@/app/(main)/(main-list)/style";
import { useAppDispatch, useAppSelector } from "@/state/hook";
import { shallowEqual } from "react-redux";
import { usePathname } from "next/navigation";
import { changeAmountFetch, deleteUnitIngrFetch, shopUnitUpdate } from "@/state/slices/list-slice";
import { deleteUnitListRecipe, newAmountListRecipe, shopUnitListRecipe } from "@/state/slices/list-recipe-slice";
import { useCallback, useState } from "react";
import EditIcon from '@mui/icons-material/Edit';
import CheckIcon from '@mui/icons-material/Check';
import { evaluate } from "mathjs";
import { CalcUnit } from "./calc-unit";
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined';
import { openInput } from "@/state/slices/list-context";


interface Props {
    isInsideMenu:boolean, 
    amount:string | null
}


export function UnitBtns ({isInsideMenu, amount}:Props) {
    const recipeIds = useAppSelector(state => state.listContext.unit_info)
    const {ingredient_id, unit_id, recipe_id} = recipeIds
    const unitData = useAppSelector(state => {
        let ingredient;

        if (recipe_id) {
            ingredient = state.listRecipe.recipes
                .find(recipe => recipe._id === recipe_id)
                ?.ingredients_list.find(ingr => ingr._id === ingredient_id);
        } else {
            ingredient = state.list.list_ingr.find(ingr => ingr._id === ingredient_id);
        }

        if (!ingredient) return null;

        const unitInfo = ingredient.units.find(unit => unit._id === unit_id);
        const ingredientId = ingredient._id;

        return { unitInfo, ingredientId };
    }, shallowEqual);

    const thisUnit = unitData?.unitInfo;
    const shopStatus = useAppSelector(state => {
        return recipe_id
            ? state.listRecipe.operations.shopUnitListRecipe.loading
            : state.list.operations.shopUnitUpdate.loading;
    });
    const userStore = useAppSelector(state => state.user);
    const id = userStore?.user?.connection_id;
    const pathName = usePathname();
    const dispatch = useAppDispatch();
    const [editAmount, setEditAmount] = useState<string | null | undefined>(null);
    const [amount1, setAmount] = useState<string>(thisUnit ? thisUnit.amount.toString() : '0');


    


    function toggleShopUnit(_id: string | undefined, shop_unit: boolean | undefined) {
        if (shopStatus) return

        if (id !== '' && unitData && shop_unit !== undefined && _id) {
            if (pathName === '/list') {
                dispatch(shopUnitUpdate({ ingredient_id: unitData.ingredientId, unit_id: _id, shop_unit }))
            }
            else if (pathName === '/list-recipe' && recipe_id) {
                dispatch(shopUnitListRecipe({ connection_id: id, ingredient_id: unitData.ingredientId, unit_id: _id, shop_unit, _id: recipe_id }))
            }

        }
    }


    const confirmAmount = useCallback((_id: string | undefined, ingredientId: string) => {
        const numberAmount = evaluate(amount)

        if (id !== '' && numberAmount !== thisUnit?.amount && _id) {
            if (pathName === '/list') {
                dispatch(changeAmountFetch({ ingredient_id: ingredientId, unit_id: _id, amount: numberAmount }));
            } else if (pathName === '/list-recipe' && recipe_id) {
                dispatch(newAmountListRecipe({ connection_id: id, ingredient_id: ingredientId, unit_id: _id, amount: numberAmount, _id: recipe_id }))
            }
        }
        setEditAmount(null);
    }, [id, amount, pathName, dispatch, recipe_id, thisUnit?.amount]);


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
    
    

    const wrap = (node: React.ReactNode) => isInsideMenu ? (
        <MenuItem sx={unitMenuItem}> 
        {/* onClick={handleClose} */}
            {node}
        </MenuItem>
    ) : (
        <>{node}</>
    );

    return(
        unitData !== null && thisUnit?._id ?
        <>
            {wrap(
                <Button
                    onClick={() => toggleShopUnit(thisUnit?._id, thisUnit?.shop_unit)}
                    sx={unitButton}
                    color="blackBtn"
                >
                    <ShoppingBagOutlinedIcon color="primary" />
                </Button>
            )}

            {wrap(
                editAmount !== thisUnit?._id ? (
                    <Button
                        onClick={() => dispatch(openInput(true))}
                        sx={unitButton}
                        color="blackBtn"
                    >
                        <EditIcon color="primary" />
                    </Button>
                ) : (
                    <Button
                        onClick={() => confirmAmount(thisUnit?._id, unitData?.ingredientId)}
                        sx={unitButton}
                        color="blackBtn"
                    >
                        <CheckIcon color="primary" />
                    </Button>
                )
            )}

            {wrap(
                <CalcUnit
                    props={{
                        elem: thisUnit,
                        id: thisUnit._id,
                        ingredient_id: unitData.ingredientId,
                        amount,
                        setAmount,
                        recipe_id,
                    }}
                />
            )}

            {wrap(
                <Button
                    onClick={() => deleteUnitIngr(unitData.ingredientId, thisUnit._id)}
                    sx={unitButton}
                    color="blackBtn"
                >
                    <DeleteOutlineOutlinedIcon color="primary" />
                </Button>
            )}

        </>
        :
        null
    )
}