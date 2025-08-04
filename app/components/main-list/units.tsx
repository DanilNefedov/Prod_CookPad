import { iconMenuMainBtns, unitAmountText, unitButton2, unitChoiceText, unitsContainer } from "@/app/(main)/(main-list)/style"
import { useAppDispatch, useAppSelector } from "@/state/hook"
import { Box, Button, IconButton, ListItemText, Menu, TextField, useMediaQuery } from "@mui/material"
import { usePathname } from "next/navigation"
import { ChangeEvent, memo, useCallback, useEffect, useState } from "react"
import CheckIcon from '@mui/icons-material/Check';
import { changeAmountFetch} from "@/state/slices/list-slice"
import { evaluate, } from "mathjs"
import { newAmountListRecipe } from "@/state/slices/list-recipe-slice"
import { handleAmountChange } from "../../helpers/input-unit"
import { shallowEqual } from "react-redux"
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { UnitBtns } from "./unit-btns"
import { UnitRecipeIds } from "@/app/(main)/(main-list)/list/types"
import { editAmount, recordIds } from "@/state/slices/list-context"



export const Unit = memo(({recipe_id, ingredient_id, unit_id}:UnitRecipeIds) => {
    const amount = useAppSelector(state => state.listContext.input_value.value)
    const openInput = useAppSelector(state => state.listContext.input_value.open_input)
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

    const userStore = useAppSelector(state => state.user);
    const pathName = usePathname();
    const dispatch = useAppDispatch();
    const id = userStore?.user?.connection_id;
    const thisUnit = unitData?.unitInfo;
    
    // const [amount, setAmount] = useState<string>(thisUnit ? thisUnit.amount.toString() : '0');
    // const [editAmount, setEditAmount] = useState<string | null | undefined>(null);


    const isMobile = useMediaQuery("(max-width:600px)");
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const open = Boolean(anchorEl);
    const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = useCallback(() => {
        setAnchorEl(null);
    }, []);


    useEffect(() => {
        dispatch(recordIds({recipe_id, ingredient_id, unit_id}))
    },[recipe_id, ingredient_id, unit_id])

    const confirmAmount = useCallback((_id: string | undefined, ingredientId: string) => {
        if(amount === null) return

        const numberAmount = evaluate(amount)

        if (id !== '' && numberAmount !== thisUnit?.amount && _id) {
            if (pathName === '/list') {
                dispatch(changeAmountFetch({ ingredient_id: ingredientId, unit_id: _id, amount: numberAmount }));
            } else if (pathName === '/list-recipe' && recipe_id) {
                dispatch(newAmountListRecipe({ connection_id: id, ingredient_id: ingredientId, unit_id: _id, amount: numberAmount, _id: recipe_id }))
            }
        }
        // setEditAmount(null);
    }, [id, amount, pathName, dispatch, recipe_id, thisUnit?.amount]);




    const handleAmount = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const sanitized = handleAmountChange(e.target.value);
        dispatch(editAmount(sanitized))
        // setAmount(sanitized);
    }

    
    console.log(openInput)
    return !unitData?.unitInfo ? null : (
        <Box key={thisUnit?._id}
            sx={[
                unitsContainer,
                {
                    opacity: `${thisUnit?.shop_unit ? 0.4 : 1}`,
                    backgroundColor: pathName === '/list' ? 'background.paper' : 'background.default'
                }
            ]}
        >
            {/* editAmount && editAmount === thisUnit?._id */}
            { openInput ?
                <Box sx={{ position: 'relative' }}>
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
                        value={amount === null ? thisUnit?.amount.toString() : amount}
                        onChange={(e) => handleAmount(e)}
                    />

                    <Button
                        onClick={() => confirmAmount(thisUnit?._id, unitData.ingredientId)}
                        sx={unitButton2}
                        color='blackBtn'
                    >
                        <CheckIcon color='primary'></CheckIcon>
                    </Button>
                </Box>

                :
                <ListItemText sx={unitAmountText} primary={thisUnit?.amount} />
            }

            <ListItemText
                sx={unitChoiceText}
                primary={thisUnit?.choice}
            />


            {isMobile ?
                
                <>
                    <IconButton
                        id="demo-positioned-button"
                        aria-controls={open ? 'demo-positioned-menu' : undefined}
                        aria-haspopup="true"

                        aria-expanded={open ? 'true' : undefined}
                        onClick={handleClick}
                    // sx={mobileMenuMainBtns}
                    >
                        <MoreVertIcon sx={iconMenuMainBtns} color="primary" />
                    </IconButton>
                    <Menu
                        id="basic-menu"
                        anchorEl={anchorEl}
                        open={open}
                        // open
                        onClose={handleClose}
                        slotProps={{
                            root: {
                                sx: {
                                    '& .MuiPaper-root': {
                                        borderRadius: '10px'
                                    }
                                }
                            }
                        }}

                    >
                        <UnitBtns 
                            isInsideMenu={true} 
                            amount ={amount}
                        ></UnitBtns>
                    </Menu>
                </>

                :

                <UnitBtns 
                    isInsideMenu={false} 
                    amount={amount}
                ></UnitBtns>
                // <>
                //     <Button
                //         onClick={() => toggleShopUnit(thisUnit?._id, thisUnit?.shop_unit)}
                //         sx={unitButton}
                //         color='blackBtn'
                //     >
                //         <ShoppingBagOutlinedIcon color='primary'></ShoppingBagOutlinedIcon>
                //     </Button>
                //     {editAmount !== thisUnit?._id ?
                //     <Button
                //         onClick={() => setEditAmount(thisUnit?._id)}
                //         sx={unitButton}
                //         color='blackBtn'
                //     >
                //         <EditIcon color='primary'></EditIcon>
                //     </Button>
                //     :
                //     <Button
                //         onClick={() => confirmAmount(thisUnit?._id, unitData.ingredientId)}
                //         sx={unitButton}
                //         color='blackBtn'
                //     >
                //         <CheckIcon color='primary'></CheckIcon>
                //     </Button>}
                            
                //     <CalcUnit props={{ elem: thisUnit as UnitsId, id, ingredient_id: unitData.ingredientId, amount, setAmount, recipe_id }}></CalcUnit>

                //     <Button
                //         onClick={() => deleteUnitIngr(unitData.ingredientId, thisUnit?._id)}
                //         sx={unitButton}
                //         color='blackBtn'
                //     >
                //         <DeleteOutlineOutlinedIcon color='primary'></DeleteOutlineOutlinedIcon>
                //     </Button>       
                // </>
            }
        </Box>
    )
})

Unit.displayName = "Unit"