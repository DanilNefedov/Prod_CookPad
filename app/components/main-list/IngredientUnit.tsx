import { iconMenuMainBtns, unitAmountText, unitButton2, unitChoiceText, unitsContainer } from "@/app/(main)/(main-list)/styles"
import { useUnitContext } from "@/config/unit-context/UnitContext"
import { useAppDispatch, useAppSelector } from "@/state/hook"
import { newAmountListRecipe } from "@/state/slices/list-recipe-slice"
import { changeAmountFetch } from "@/state/slices/list-slice"
import CheckIcon from '@mui/icons-material/Check'
import MoreVertIcon from '@mui/icons-material/MoreVert'
import { Box, Button, IconButton, ListItemText, Menu, TextField, useMediaQuery } from "@mui/material"
import { evaluate, } from "mathjs"
import { usePathname } from "next/navigation"
import { ChangeEvent, useCallback, useState } from "react"
import { handleAmountChange } from "../../helpers/input-unit"
import UnitBtns from "./UnitBtns"


export function IngredientUnit (){
    const { recipe_id, ingredient_id, unit_id } = useUnitContext();
    
    const choice = useAppSelector(state =>
        recipe_id ? state.listRecipe.units[unit_id]?.choice : state.list.units[unit_id]?.choice
    );
    const shop_unit = useAppSelector(state =>
        recipe_id ? state.listRecipe.units[unit_id]?.shop_unit : state.list.units[unit_id]?.shop_unit
    );
    const amount = useAppSelector(state =>
        recipe_id ? state.listRecipe.units[unit_id]?.amount : state.list.units[unit_id]?.amount
    );

    const userStore = useAppSelector(state => state.user);
    const pathName = usePathname();
    const dispatch = useAppDispatch();
    const id = userStore?.user?.connection_id;
    
    const [isIputOpen, setIsIputOpen] = useState<string>('')
    const [newAmount, setNewAmount] = useState<string>('');


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
        // const numberAmount = amount
        if(newAmount === '0') return

        const numberAmount = evaluate(newAmount)

        if (id !== '' && _id ) {//numberAmount !== thisUnit?.amount
            if (pathName === '/list') {
                dispatch(changeAmountFetch({ ingredient_id: ingredientId, unit_id: _id, amount: numberAmount }));
            } else if (pathName === '/list-recipe' && recipe_id) {
                dispatch(newAmountListRecipe({ connection_id: id, ingredient_id: ingredientId, unit_id: _id, amount: numberAmount, _id: recipe_id }))
            }
        }
        setIsIputOpen('')
        setNewAmount('')
        // setEditAmount(null);
    }, [id, newAmount, amount, pathName, dispatch, recipe_id, ]);//thisUnit?.amount




    const handleAmount = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        // if(e.target.value.trim() === '') return
        const sanitized = handleAmountChange(e.target.value);
        setNewAmount(sanitized);
        // setAmount(sanitized);
    }

    
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
                        value={newAmount !== '' ? newAmount : amount}//thisUnit?.amount.toString()
                        onChange={(e) => handleAmount(e)}
                    />

                    {isMobile && 
                        <Button
                            onClick={() => confirmAmount(unit_id, ingredient_id)}//thisUnit?._id  unitData.ingredientId
                            sx={unitButton2}
                            color='blackBtn'
                        >
                            <CheckIcon color='primary'></CheckIcon>
                        </Button>
                    }
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
                                        borderRadius: '10px',
                                        backgroundColor: pathName === '/list' ? 'background.paper' : 'background.default'
                                    }
                                }
                            }
                        }}

                    >
                        <UnitBtns 
                            isInsideMenu={true}
                            state_shop={shop_unit} 
                            handleOpenInput={handleOpenInput}
                            confirmAmount={confirmAmount}
                            isIputOpen={isIputOpen}
                            newAmount={newAmount}
                        ></UnitBtns>
                    </Menu>
                </>

                :
                <UnitBtns 
                    isInsideMenu={false} 
                    state_shop={shop_unit}
                    handleOpenInput={handleOpenInput}
                    confirmAmount={confirmAmount}
                    isIputOpen={isIputOpen}
                    newAmount={newAmount}
                ></UnitBtns>
            }
        </Box>
    )
}

