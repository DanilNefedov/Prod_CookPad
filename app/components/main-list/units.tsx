import { iconMenuMainBtns, unitAmountText, unitButton2, unitChoiceText, unitsContainer } from "@/app/(main)/(main-list)/style"
import { useUnitContext } from "@/config/unit-context/unit-context"
import { useAppDispatch, useAppSelector } from "@/state/hook"
import { newAmountListRecipe } from "@/state/slices/list-recipe-slice"
import { changeAmountFetch } from "@/state/slices/list-slice"
import CheckIcon from '@mui/icons-material/Check'
import MoreVertIcon from '@mui/icons-material/MoreVert'
import { Box, Button, IconButton, ListItemText, Menu, TextField, useMediaQuery } from "@mui/material"
import { evaluate, } from "mathjs"
import { usePathname } from "next/navigation"
import { ChangeEvent, memo, useCallback, useEffect, useMemo, useState } from "react"
import { handleAmountChange } from "../../helpers/input-unit"
import { UnitBtns } from "./unit-btns"
import { RootState } from "@/state/store"
import { shallowEqual } from "react-redux"



export const Unit = memo(() => {
    const { recipe_id, ingredient_id, unit_id } = useUnitContext();
    // const isIputOpen = useAppSelector(state => state.listContext.input_value.open_input)
    // const memoizedSelector = useMemo(() => selectUnitData(recipe_id, ingredient_id, unit_id), [recipe_id, ingredient_id, unit_id]);
    // const unitData = useAppSelector(memoizedSelector); 
    // const unitData = useAppSelector(useCallback(
    //     (state: RootState) => { 
    //         const ingredient = recipe_id
    //             ? state.listRecipe.recipes
    //                 .find(recipe => recipe._id === recipe_id)?.ingredients_list.find(ingr => ingr._id === ingredient_id)
    //             : state.list.list_ingr.find(ingr => ingr._id === ingredient_id);
    //         const unitInfo = ingredient?.units.find(unit => unit._id === unit_id);
    //         return {
    //             state_amount: unitInfo?.amount ?? 0,
    //             state_shop: unitInfo?.shop_unit ?? false,
    //             state_choice: unitInfo?.choice ?? ''
    //         };
    //     },
    //     [recipe_id, ingredient_id, unit_id]
    // ), shallowEqual);
    const unitData = useAppSelector(state => state.list.units[unit_id])


    const userStore = useAppSelector(state => state.user);
    const pathName = usePathname();
    const dispatch = useAppDispatch();
    const id = userStore?.user?.connection_id;
    const {amount, choice, shop_unit} = unitData;
    
    const [isIputOpen, setIsIputOpen] = useState<string>('')
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

    const handleOpenInput = useCallback((value:string) => {
        setIsIputOpen(value);
    }, []);


    const confirmAmount = useCallback((_id: string | undefined, ingredientId: string) => {
        const numberAmount = amount
        // const numberAmount = evaluate(amount)

        if (id !== '' && _id) {//numberAmount !== thisUnit?.amount
            if (pathName === '/list') {
                dispatch(changeAmountFetch({ ingredient_id: ingredientId, unit_id: _id, amount: numberAmount }));
            } else if (pathName === '/list-recipe' && recipe_id) {
                dispatch(newAmountListRecipe({ connection_id: id, ingredient_id: ingredientId, unit_id: _id, amount: numberAmount, _id: recipe_id }))
            }
        }
        // setEditAmount(null);
    }, [id, amount, pathName, dispatch, recipe_id, ]);//thisUnit?.amount




    const handleAmount = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const sanitized = handleAmountChange(e.target.value);
        // setAmount(sanitized);
    }

    
    console.log(recipe_id, ingredient_id, unit_id )
    return (
        <Box 
        key={unit_id}
            sx={[
                unitsContainer,
                {
                    opacity: `${shop_unit ? 0.4 : 1}`,
                    backgroundColor: pathName === '/list' ? 'background.paper' : 'background.default'
                }
            ]}
        >
            {/* editAmount && editAmount === thisUnit?._id */}
            { isIputOpen === unit_id ?
                <Box sx={{ position: 'relative' }}>
                    <TextField
                        onKeyDown={(e) => {
                            if (['-', '+', 'e'].includes(e.key)) {
                                e.preventDefault();
                            }

                            if (e.key === 'Enter') {
                                e.preventDefault();
                                confirmAmount(unit_id, ingredient_id);//thisUnit?._id  unitData.ingredientId
                            }
                        }}

                        type="number"
                        value={unitData.amount !== null ? amount.toString() : amount}//thisUnit?.amount.toString()
                        onChange={(e) => handleAmount(e)}
                    />

                    <Button
                        onClick={() => confirmAmount(unit_id, ingredient_id)}//thisUnit?._id  unitData.ingredientId
                        sx={unitButton2}
                        color='blackBtn'
                    >
                        <CheckIcon color='primary'></CheckIcon>
                    </Button>
                </Box>

                :
                <ListItemText sx={unitAmountText} primary={amount} />//thisUnit?.amount
            }

            <ListItemText
                sx={unitChoiceText}
                primary={choice}//thisUnit?.choice
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
                        {/* <UnitBtns 
                            isInsideMenu={true}
                            state_shop={shop_unit} 
                            handleOpenInput={handleOpenInput}
                        ></UnitBtns> */}
                    </Menu>
                </>

                :
                            <></>
                // <UnitBtns 
                //     isInsideMenu={false} 
                //     state_shop={shop_unit}
                //     handleOpenInput={handleOpenInput}
                // ></UnitBtns>




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