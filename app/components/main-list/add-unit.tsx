import { amountNewUnit, btnsListUnitHover, btnsModal, modalContainer, styleBtnsAdaptiveMenu } from "@/app/(main)/(main-list)/style";
import { IListObj } from "@/app/types/types";
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

interface Props {
    ingr: IListObj;
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
    const isSmallScreen = useMediaQuery("(max-width:800px)");


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
            <Button onClick={() => {            
                setOpen(true)
            }} sx={isSmallScreen ? [btnsListUnitHover, styleBtnsAdaptiveMenu] : btnsListUnitHover}>
                <AddCircleOutlineIcon></AddCircleOutlineIcon>
                {isSmallScreen ? <span>New</span> : <></>}

            </Button>
            <Modal
                open={open}
                onClose={() => {
                    setOpen(false)
                    setAmount('0')
                }}
            // sx={{maxWidth:'500px'}}
            >
                <Box sx={modalContainer}
                >
                    <Typography sx={{
                        textAlign: 'center', [theme.breakpoints.down('md')]: {
                            fontSize: '14px'
                        }
                    }}>Add a new Unit to {ingr.name}</Typography>
                    <Box sx={{
                        display: "flex", justifyContent: 'center', p: '20px 0', '& .MuiFormControl-root .MuiInputBase-root .MuiInputBase-input': {
                            p: '10px',
                            [theme.breakpoints.down('md')]: {
                                fontSize: '14px',
                                p: '7px 10px'
                            }
                        },
                        [theme.breakpoints.down('md')]: {
                            flexDirection: "column",
                            alignItems: 'center',
                            p: '15px 0'
                        }
                    }}>
                        <TextField
                            onKeyDown={(e) => {
                                if (['-', '+', 'e'].includes(e.key)) {
                                    e.preventDefault();
                                }
                            }}
                            value={amount}
                            onChange={(e) => handleAmount(e)}
                            sx={{
                                ...secondTextInput, ...amountNewUnit,
                                [theme.breakpoints.down('md')]: {
                                    width: '100%'
                                }
                            }}
                        ></TextField>
                        <Autocomplete
                            freeSolo
                            options={ingr.list}
                            sx={{
                                ...secondTextInput, width: '120px', '& .MuiInputBase-root ': {
                                    p: '0 39px 0 0'
                                },
                                [theme.breakpoints.down('md')]: {
                                    width: '100%',
                                    m: '7px 0',
                                    '& .MuiAutocomplete-listbox .MuiListItem-root': {
                                        minHeight: '0'
                                    }
                                }
                            }}
                            slotProps={{
                                popper: {
                                    sx: {
                                        '& ul': { bgcolor: 'background.default' },
                                        '& .MuiAutocomplete-listbox .MuiListItem-root': {
                                            minHeight: '0'
                                        }
                                    }
                                },

                            }}
                            renderOption={(props, option) => {
                                return (
                                    <ListItem {...props} key={option} sx={{

                                        bgcolor: 'background.default',
                                        borderWidth: '0 0 1px',
                                        borderStyle: "solid",
                                        borderColor: 'background.paper',

                                        [theme.breakpoints.down('md')]: {
                                            p: "5px",
                                            fontSize: '14px',
                                        },

                                    }}>
                                        {option}
                                    </ListItem>

                                )
                            }}
                            renderInput={(params) => (
                                <TextField
                                    placeholder="Units"
                                    sx={{ height: '100%', }}
                                    {...params}
                                />
                            )}
                            onInputChange={(event, newValue) => {
                                setUnit(newValue);
                            }}
                            value={unit}
                        />

                        <Box sx={{
                            display: 'flex', [theme.breakpoints.down('md')]: {
                                width: '100%',
                                justifyContent: 'space-around',

                                gap: '25px'
                            }
                        }}>
                            <Button onClick={() => confirmAmount(ingr._id)}
                                sx={btnsModal}
                            >
                                <CheckIcon sx={{ color: 'text.secondary' }}></CheckIcon>
                            </Button>
                            <Button onClick={() => {
                                setOpen(false)
                            }}
                                sx={btnsModal}
                            >
                                <ClearIcon sx={{ color: 'text.secondary' }}></ClearIcon>
                            </Button>
                        </Box>

                    </Box>

                </Box>

            </Modal>
        </>
    )
}