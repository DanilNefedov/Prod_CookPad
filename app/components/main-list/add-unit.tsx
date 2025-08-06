import { amountNewUnit, btnsListUnitHover, btnsModal, modalContainer, modalInputButton, modalInputButtonsBox, modalInputContainer, modalTextNewUnit, styleBtnsAdaptiveMenu } from "@/app/(main)/(main-list)/style";
import { useAppDispatch } from "@/state/hook";
import { Autocomplete, Box, Button, ListItem, Modal, TextField, Typography, useMediaQuery } from "@mui/material";
import { usePathname } from "next/navigation";
import { ChangeEvent, useState } from "react";
import { secondTextInput } from "@/app/main-styles";
import CheckIcon from '@mui/icons-material/Check';
import ClearIcon from '@mui/icons-material/Clear';
import { evaluate } from "mathjs";
import { addNewUnit } from "@/state/slices/list-slice";
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import { theme } from "@/config/ThemeMUI/theme";
import { handleAmountChange } from "../../helpers/input-unit";
import { newUnitListRecipe } from "@/state/slices/list-recipe-slice";
import { ListIngrData } from "@/app/(main)/(main-list)/list/types";
import { autoCompliteItems, autocompliteMenuItem, paperMenu, weightItemList } from "@/app/(main)/new-recipe/style";
import { centerFlexBlock } from "@/app/styles";

interface Props {
    ingr: ListIngrData;
    id: string;
    recipe_id?: string,
}

export function AddNewUnit({ props }: { props: Props }) {
    const { ingr, id, recipe_id, } = props;
    const [open, setOpen] = useState<boolean>(false)
    const dispatch = useAppDispatch()
    const [amount, setAmount] = useState<string>('0')
    const [unit, setUnit] = useState<string>('');
    const pathName = usePathname()
    const isSmallScreen = useMediaQuery("(max-width:1150px)");


    function handleAmount(e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
        const formattedValue = handleAmountChange(e.target.value)

        setAmount(formattedValue);
    }

    
    function confirmAmount(ingredient_id: string) {
        if (id === "") return;

        const numericAmount = evaluate(amount);

        const newUnit = {
            shop_unit: false,
            choice: unit,
            amount: numericAmount,
        }
        
        setAmount('0')
        setUnit('')

        if (pathName === '/list') {
            setOpen(false)
            dispatch(addNewUnit({ ingredient_id, new_unit: newUnit }))
        }else if(pathName === '/list-recipe' && recipe_id){
            setOpen(false)
            dispatch(newUnitListRecipe({connection_id: id,  ingredient_id, updated_unit:newUnit, _id:recipe_id}))
        }

    }


    return (
        <>
            <Button 
                onClick={() => { setOpen(true)}} 
                sx={isSmallScreen ? [btnsListUnitHover, styleBtnsAdaptiveMenu] : btnsListUnitHover}
                color="grayButton"
            >
                <AddCircleOutlineIcon></AddCircleOutlineIcon>
                {isSmallScreen ? <span>New</span> : <></>}

            </Button>
            <Modal
                open={open}
                // open
                onClose={() => {
                    setOpen(false)
                    setAmount('0')
                }}
            >
                <Box sx={modalContainer}>
                    <Typography sx={modalTextNewUnit}>Add a new Unit to {ingr.name}</Typography>
                    <Box sx={[modalInputContainer, centerFlexBlock]}>
                        <TextField
                            onKeyDown={(e) => {
                                if (['-', '+', 'e'].includes(e.key)) {
                                    e.preventDefault();
                                }
                            }}
                            value={amount}
                            onChange={(e) => handleAmount(e)}
                        ></TextField>
                        <Autocomplete
                            freeSolo
                            options={ingr.list}
                            sx={[autoCompliteItems, weightItemList, 
                                {'& .MuiInputBase-input': {
                                    p: '5.5px 10px 9.5px'}
                                }]}
                            slotProps={{
                                popper: {
                                    sx: paperMenu
                                },

                            }}
                            renderOption={(props, option) => {
                                return (
                                    <ListItem 
                                    {...props} 
                                    key={option} 
                                    sx={autocompliteMenuItem}
                                    >
                                        {option}
                                    </ListItem>

                                )
                            }}
                            renderInput={(params) => (
                                <TextField
                                    label="Units"
                                    variant="outlined"
                                    autoComplete="off"
                                    slotProps={{
                                        inputLabel: {
                                            sx: {
                                                fontSize: '16px',
                                                lineHeight: '18px',
                                            },
                                        },
                                    }}
                                    {...params}
                                />
                            )}
                            onInputChange={(event, newValue) => {
                                setUnit(newValue);
                            }}
                            value={unit}
                        />

                        <Box sx={modalInputButtonsBox}>
                            <Button 
                                onClick={() => confirmAmount(ingr.ingredient_id)}
                                color="blackBtn"
                                sx={modalInputButton}                            
                            >
                                <CheckIcon sx={{ color: 'text.disabled' }}></CheckIcon>
                            </Button>
                            <Button 
                                onClick={() => { setOpen(false)}}
                                color="blackBtn"
                                sx={modalInputButton}
                            >
                                <ClearIcon sx={{ color: 'text.disabled' }}></ClearIcon>
                            </Button>
                        </Box>

                    </Box>

                </Box>

            </Modal>
        </>
    )
}