import { blockUnits, btnsListUnitHover, inputUnitList, unitBtnsImg } from "@/app/(main)/(main-list)/style"
import { IListObj, UnitsList } from "@/app/types/types"
import { useAppDispatch } from "@/state/hook"
import { Box, Button, ListItemText, TextField } from "@mui/material"
import { usePathname } from "next/navigation"
import { ChangeEvent, useState } from "react"
import AddShoppingCartIcon from '@mui/icons-material/AddShoppingCart';
import EditIcon from '@mui/icons-material/Edit';
import CheckIcon from '@mui/icons-material/Check';
import ClearIcon from '@mui/icons-material/Clear';
import { CalcUnit } from "./calc-unit"



export function Units({ el, elem, id, recipe_id }: { el: IListObj, elem: UnitsList, id: string, recipe_id?: string}) {
    const [editAmount, setEditAmount] = useState<string | null>(null)
    // const [amount, setAmount] = useState<number | string>(elem.amount)
    const [amount, setAmount] = useState<string | number>(elem.amount);

    const pathName = usePathname()
    const dispatch = useAppDispatch()


    


    function deleteUnitIngr(ingredient_id: string, unit_id: string) {
        console.log('deleteUnitIngr')
        // if (id && id !== null) {
        //     console.log(ingredient_id, id)
        //     if(pathName === '/list'){
        //         dispatch(deleteUnitIngrFetch({ ingredient_id, connection_id: id, unit_id }))
        //     }else if(pathName === '/list-recipe' && recipe_id){
        //         dispatch(deleteUnitListRecipe({ ingredient_id, connection_id: id, unit_id, recipe_id }))
        //     }
            
        // }
    }


    function confirmAmount(_id: string) {
        console.log('confirmAmount')
        // setEditAmount(null);

        // if (id !== null && id && amount !== elem.amount) {
        //     if (amount === '' || isNaN(parseFloat(amount.toString()))) {
        //         if(pathName === '/list'){
        //             dispatch(changeAmountFetch({ connection_id: id, ingredient_id: el.ingredient_id, unit_id: _id, amount: 0 }))
        //         }else if(pathName === '/list-recipe' && recipe_id){
        //             dispatch(newAmountListRecipe({connection_id: id, ingredient_id: el.ingredient_id, unit_id: _id, amount: 0, recipe_id }))
        //         }
                
        //     } else {
        //         if(pathName === '/list'){
        //             dispatch(changeAmountFetch({ connection_id: id, ingredient_id: el.ingredient_id, unit_id: _id, amount: parseFloat(amount.toString()) || 0 }))
        //         }else if(pathName === '/list-recipe' && recipe_id){
        //             dispatch(newAmountListRecipe({connection_id: id, ingredient_id: el.ingredient_id, unit_id: _id, amount: parseFloat(amount.toString()) || 0, recipe_id }))
        //         }
                
        //     }
        // }

    }


    function handleAmount(e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
        console.log('handleAmount')
        // const value = e.target.value;
        // if (value === '' || (!isNaN(parseFloat(value)) && parseFloat(value) >= 0 && parseFloat(value) <= 999)) {
        //     // if(pathName === '/list'){
        //         setAmount(value);
        //     // }
            
        // }
    };

    function toggleShopUnit(_id: string, shop_unit: boolean) {
        console.log('toggleShopUnit')
        // if (id !== null && id) {
        //     if(pathName === '/list'){
        //         dispatch(toggleUnitFetch({ connection_id: id, ingredient_id: el.ingredient_id, unit_id: _id, shop_unit }))
        //     }else if(pathName === '/list-recipe' && recipe_id){
        //         dispatch(shopUnitListRecipe({ connection_id: id, ingredient_id: el.ingredient_id, unit_id: _id, shop_unit, recipe_id}))

        //     }
            
        // }
    }



    // console.log(amount)
    return (
        <Box key={elem._id} sx={{...blockUnits, opacity:`${elem.shop_unit ? 0.4 : 1}`, backgroundColor:pathName ==='/list' ? 'background.paper' : 'background.default'}}>
            {editAmount === elem._id ?
                <TextField type="number"
                    value={amount.toString()}
                    sx={inputUnitList}
                    onChange={(e) => handleAmount(e)}
                />
                :
                <ListItemText sx={{ paddingRight: '4px' }} primary={elem.amount} />
            }

            <ListItemText
                sx={{ mr: '10px', flex:'none'}}
                primary={elem.choice}
            />

            <Button onClick={() => toggleShopUnit(elem._id, elem.shop_unit)} sx={{ ...unitBtnsImg, ...btnsListUnitHover, minWidth: '0' }}>
                <AddShoppingCartIcon sx={{ width: '18px' }}></AddShoppingCartIcon>
            </Button>


            {editAmount !== elem._id ?
                <Button onClick={() => setEditAmount(elem._id)} sx={{ ...unitBtnsImg, ...btnsListUnitHover, minWidth: '0' }}>
                    <EditIcon sx={{ width: '18px' }}></EditIcon>
                </Button>
                :
                <Button onClick={() => confirmAmount(elem._id)} sx={{ ...unitBtnsImg, ...btnsListUnitHover, minWidth: '0' }}>
                    <CheckIcon sx={{ width: '18px' }}></CheckIcon>
                </Button>
            }
            <CalcUnit props={{elem, id, ingredient_id: el._id, setAmount, recipe_id}}></CalcUnit>
            {/* <Convert props={{ elem, id, ingredient_id: el._id, editAmount, recipe_id }}></Convert> */}
           
            <Button onClick={() => deleteUnitIngr(el._id, elem._id)} sx={{ ...unitBtnsImg, ...btnsListUnitHover, minWidth: '0' }}>
                <ClearIcon></ClearIcon>
            </Button>
        </Box>
    )
}