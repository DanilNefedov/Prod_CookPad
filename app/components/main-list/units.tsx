import { blockUnits, btnsListUnitHover, inputUnitList, unitBtnsImg } from "@/app/(main)/(main-list)/style"
import { useAppDispatch, useAppSelector } from "@/state/hook"
import { Box, Button, ListItemText, TextField } from "@mui/material"
import { usePathname } from "next/navigation"
import { ChangeEvent, memo, useCallback, useState } from "react"
import EditIcon from '@mui/icons-material/Edit';
import CheckIcon from '@mui/icons-material/Check';
import { CalcUnit } from "./calc-unit"
import { changeAmountFetch, deleteUnitIngrFetch, shopUnitUpdate } from "@/state/slices/list-slice"
import { evaluate, } from "mathjs"
import { theme } from "@/config/ThemeMUI/theme"
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined';
import ShoppingBagOutlinedIcon from '@mui/icons-material/ShoppingBagOutlined';
import { deleteUnitListRecipe, newAmountListRecipe, shopUnitListRecipe } from "@/state/slices/list-recipe-slice"
import { handleAmountChange } from "./function"
import { shallowEqual } from "react-redux"
import { UnitsList } from "@/app/types/types"



const Units = memo(({ ingredient_id, unit_id, recipe_id }: { ingredient_id: string, unit_id: string, recipe_id?: string }) => {
    const unitData = useAppSelector(state => {
        let thisIngredient;
        if (recipe_id) {
            thisIngredient = state.listRecipe.recipes
                .find(el => el._id === recipe_id)
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

    const userStore = useAppSelector(state => state.user); 
    const pathName = usePathname();
    const dispatch = useAppDispatch();
    const id = userStore?.user?.connection_id;
    const [editAmount, setEditAmount] = useState<string | null | undefined>(null);    
    const thisUnit = unitData?.unitInfo;
    const [amount, setAmount] = useState<string>(thisUnit ? thisUnit.amount.toString() : '0');

    const shopStatus = useAppSelector(state => {
        if(recipe_id) return state.listRecipe.operations.shopUnitListRecipe.loading
        return state.list.operations.shopUnitUpdate.loading
    })



   


    function deleteUnitIngr(ingredient_id: string, unit_id: string | undefined) {
        if (id !== '' && unit_id) {
            if(pathName === '/list'){
                dispatch(deleteUnitIngrFetch({ ingredient_id, unit_id }))
            }
            else if(pathName === '/list-recipe' && recipe_id){
                dispatch(deleteUnitListRecipe({ ingredient_id, connection_id: id, unit_id, _id:recipe_id }))
            }
            
        }
    }


    const confirmAmount = useCallback((_id: string | undefined, ingredientId:string) => {
        const numberAmount = evaluate(amount)

        if (id !== '' && numberAmount !== thisUnit?.amount && _id ) {
            if (pathName === '/list') {
                dispatch(changeAmountFetch({ ingredient_id:ingredientId, unit_id: _id, amount: numberAmount }));
            }else if(pathName === '/list-recipe' && recipe_id){
                dispatch(newAmountListRecipe({connection_id: id, ingredient_id:ingredientId, unit_id: _id, amount: numberAmount, _id:recipe_id }))
            }   
        } 
        setEditAmount(null);
    }, [id, amount, pathName, dispatch, recipe_id, thisUnit?.amount]);
    

   
    
    const handleAmount = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const resIntupChange = handleAmountChange(e.target.value)

        setAmount(resIntupChange);
    }
    


    function toggleShopUnit(_id: string | undefined, shop_unit: boolean | undefined) {
        if(shopStatus) return

        if (id !== '' && unitData && shop_unit !== undefined && _id) {
            if(pathName === '/list'){
                dispatch(shopUnitUpdate({ ingredient_id: unitData.ingredientId, unit_id: _id, shop_unit }))
            }
            else if(pathName === '/list-recipe' && recipe_id){
                dispatch(shopUnitListRecipe({ connection_id: id, ingredient_id: unitData.ingredientId, unit_id: _id, shop_unit, _id:recipe_id}))
            }
            
        }
    }

    if (!unitData || unitData === undefined || !unitData.unitInfo) return null;


    return (
        <Box key={thisUnit?._id} sx={{...blockUnits, opacity:`${thisUnit?.shop_unit ? 0.4 : 1}`, 
        backgroundColor:pathName ==='/list' ? 'background.paper' : 'background.default'}}>
            {editAmount && editAmount === thisUnit?._id ?
                <TextField 
                    onKeyDown={(e) => {
                        if (['-', '+', 'e'].includes(e.key)) {
                            e.preventDefault();
                        }

                        if (e.key === 'Enter') {
                            e.preventDefault(); 
                            confirmAmount(thisUnit?._id, unitData.ingredientId); 
                        }
                    }}
                    
                    type="number"
                    value={amount.toString()}
                    sx={inputUnitList}
                    onChange={(e) => handleAmount(e)}
                />
                :
                <ListItemText sx={{ paddingRight: '4px', [theme.breakpoints.down(1050)]: { '& span':{fontSize:'14px'}} }} primary={thisUnit?.amount} />
            }

            <ListItemText
                sx={{ mr: '10px', flex:'none', [theme.breakpoints.down(1050)]: { '& span':{fontSize:'14px'}}}}
                primary={thisUnit?.choice}
            />

            <Button onClick={() => toggleShopUnit(thisUnit?._id, thisUnit?.shop_unit)} sx={{ ...unitBtnsImg, ...btnsListUnitHover, minWidth: '0' }}>
                <ShoppingBagOutlinedIcon sx={{ width: '18px' }}></ShoppingBagOutlinedIcon>
            </Button>


            {editAmount !== thisUnit?._id ?
                <Button onClick={() => setEditAmount(thisUnit?._id)} sx={{ ...unitBtnsImg, ...btnsListUnitHover, minWidth: '0' }}>
                    <EditIcon sx={{ width: '18px' }}></EditIcon>
                </Button>
                :
                <Button onClick={() => confirmAmount(thisUnit?._id, unitData.ingredientId)} sx={{ ...unitBtnsImg, ...btnsListUnitHover, minWidth: '0' }}>
                    <CheckIcon sx={{ width: '18px' }}></CheckIcon>
                </Button>
            }
            <CalcUnit props={{ elem:thisUnit as UnitsList, id, ingredient_id:unitData.ingredientId, amount, setAmount, recipe_id }}></CalcUnit>
            {/* <Convert props={{ elem, id, ingredient_id: el._id, editAmount, recipe_id }}></Convert> */}
           
            <Button onClick={() => deleteUnitIngr(unitData.ingredientId, thisUnit?._id)} sx={{ ...unitBtnsImg, ...btnsListUnitHover, minWidth: '0' }}>
                <DeleteOutlineOutlinedIcon></DeleteOutlineOutlinedIcon>
            </Button>
        </Box>
    )
}, (prevProps, nextProps) => {
    const isRecipeIdEqual = 
        ('recipe_id' in prevProps && 'recipe_id' in nextProps)
        ? prevProps.recipe_id === nextProps.recipe_id
        : true;

    return prevProps.ingredient_id=== nextProps.ingredient_id && 
           prevProps.unit_id === nextProps.unit_id &&
           isRecipeIdEqual;
});


Units.displayName = "Units"


export default Units