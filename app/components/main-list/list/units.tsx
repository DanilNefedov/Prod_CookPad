import { blockUnits, btnsListUnitHover, inputUnitList, unitBtnsImg } from "@/app/(main)/(main-list)/style"
import { IListObj, UnitsList } from "@/app/types/types"
import { useAppDispatch, useAppSelector } from "@/state/hook"
import { Box, Button, ListItemText, TextField } from "@mui/material"
import { usePathname } from "next/navigation"
import { ChangeEvent, memo, useCallback, useMemo, useState } from "react"
import AddShoppingCartIcon from '@mui/icons-material/AddShoppingCart';
import EditIcon from '@mui/icons-material/Edit';
import CheckIcon from '@mui/icons-material/Check';
import ClearIcon from '@mui/icons-material/Clear';
import { CalcUnit } from "./calc-unit"
import { changeAmountFetch, deleteUnitIngrFetch, shopUnitUpdate } from "@/state/slices/list-slice"
import { bignumber, e, evaluate, parse } from "mathjs"
import { theme } from "@/config/ThemeMUI/theme"
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined';
import ShoppingBagOutlinedIcon from '@mui/icons-material/ShoppingBagOutlined';
import { deleteUnitListRecipe, newAmountListRecipe, shopUnitListRecipe } from "@/state/slices/list-recipe-slice"
import { handleAmountChange } from "../function"
import { shallowEqual } from "react-redux"



export const Units = memo(({ ingredient_id, unit_id, recipe_id }: { ingredient_id: string, unit_id: string, recipe_id?: string }) => {
    const userStore = useAppSelector(state => state.user)
    const id = userStore?.user?.connection_id

    const unitData = useAppSelector(state => {
        let thisIngredient;
        if (recipe_id) {
            thisIngredient = state.listRecipe.recipes
                .find(el => el.recipe_id === recipe_id)
                ?.ingredients_list.find(ing => ing._id === ingredient_id);
        } else {
            thisIngredient = state.list.list_ingr.find(el => el._id === ingredient_id);
        }
        
        if (!thisIngredient) return null;
        return {
            unitInfo: thisIngredient.units.find(el => el._id === unit_id),
            ingredientId: thisIngredient._id,
        };
    }, shallowEqual); 
    
    if (!unitData || !unitData.unitInfo) return null;
    
    const thisUnit = unitData.unitInfo;
    
    const [editAmount, setEditAmount] = useState<string | null>(null);
    const [amount, setAmount] = useState<string>(thisUnit.amount.toString());
    const pathName = usePathname();
    const dispatch = useAppDispatch();



    function deleteUnitIngr(ingredient_id: string, unit_id: string) {
        if (id !== '') {
            if(pathName === '/list'){
                dispatch(deleteUnitIngrFetch({ ingredient_id, unit_id }))
            }
            else if(pathName === '/list-recipe' && recipe_id){
                console.log({ingredient_id, connection_id: id, unit_id, recipe_id})
                dispatch(deleteUnitListRecipe({ ingredient_id, connection_id: id, unit_id, recipe_id }))
            }
            
        }
    }


    const confirmAmount = useCallback((_id: string) => {
        const numberAmount = evaluate(amount)

        if (id !== '' && numberAmount !== thisUnit.amount) {
            if (pathName === '/list') {
                dispatch(changeAmountFetch({ ingredient_id: unitData.ingredientId, unit_id: _id, amount: numberAmount }));
            }else if(pathName === '/list-recipe' && recipe_id){
                // console.log(numberAmount)
                dispatch(newAmountListRecipe({connection_id: id, ingredient_id: unitData.ingredientId, unit_id: _id, amount: numberAmount, recipe_id }))
            }   
        } 
        setEditAmount(null);
    }, [id, amount, pathName, dispatch]);
    

   
    
    const handleAmount = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const resIntupChange = handleAmountChange(e.target.value)

        setAmount(resIntupChange);
    }
    


    function toggleShopUnit(_id: string, shop_unit: boolean) {
        console.log('toggleShopUnit')
        if (id !== '' && unitData) {
            if(pathName === '/list'){
                dispatch(shopUnitUpdate({ ingredient_id: unitData.ingredientId, unit_id: _id, shop_unit }))
            }
            else if(pathName === '/list-recipe' && recipe_id){
                dispatch(shopUnitListRecipe({ connection_id: id, ingredient_id: unitData.ingredientId, unit_id: _id, shop_unit, recipe_id}))
            }
            
        }
    }



    
    return (
        <Box key={thisUnit._id} sx={{...blockUnits, opacity:`${thisUnit.shop_unit ? 0.4 : 1}`, 
        backgroundColor:pathName ==='/list' ? 'background.paper' : 'background.default'}}>
            {editAmount === thisUnit._id ?
                <TextField 
                    onKeyDown={(e) => {
                        if (['-', '+', 'e'].includes(e.key)) {
                            e.preventDefault();
                        }

                        if (e.key === 'Enter') {
                            e.preventDefault(); 
                            confirmAmount(thisUnit._id); 
                        }
                    }}
                    
                    type="number"
                    value={amount.toString()}
                    sx={inputUnitList}
                    onChange={(e) => handleAmount(e)}
                />
                :
                <ListItemText sx={{ paddingRight: '4px', [theme.breakpoints.down(1050)]: { '& span':{fontSize:'14px'}} }} primary={thisUnit.amount} />
            }

            <ListItemText
                sx={{ mr: '10px', flex:'none', [theme.breakpoints.down(1050)]: { '& span':{fontSize:'14px'}}}}
                primary={thisUnit.choice}
            />

            <Button onClick={() => toggleShopUnit(thisUnit._id, thisUnit.shop_unit)} sx={{ ...unitBtnsImg, ...btnsListUnitHover, minWidth: '0' }}>
                <ShoppingBagOutlinedIcon sx={{ width: '18px' }}></ShoppingBagOutlinedIcon>
            </Button>


            {editAmount !== thisUnit._id ?
                <Button onClick={() => setEditAmount(thisUnit._id)} sx={{ ...unitBtnsImg, ...btnsListUnitHover, minWidth: '0' }}>
                    <EditIcon sx={{ width: '18px' }}></EditIcon>
                </Button>
                :
                <Button onClick={() => confirmAmount(thisUnit._id)} sx={{ ...unitBtnsImg, ...btnsListUnitHover, minWidth: '0' }}>
                    <CheckIcon sx={{ width: '18px' }}></CheckIcon>
                </Button>
            }
            <CalcUnit props={{ elem:thisUnit, id, ingredient_id:unitData.ingredientId, amount, setAmount, recipe_id }}></CalcUnit>
            {/* <Convert props={{ elem, id, ingredient_id: el._id, editAmount, recipe_id }}></Convert> */}
           
            <Button onClick={() => deleteUnitIngr(unitData.ingredientId, thisUnit._id)} sx={{ ...unitBtnsImg, ...btnsListUnitHover, minWidth: '0' }}>
                <DeleteOutlineOutlinedIcon></DeleteOutlineOutlinedIcon>
            </Button>
        </Box>
    )
}, (prevProps, nextProps) => {
    return prevProps.ingredient_id=== nextProps.ingredient_id && 
           prevProps.unit_id === nextProps.unit_id &&
           prevProps.recipe_id === nextProps.recipe_id;
});