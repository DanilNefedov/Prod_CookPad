import { amountNewUnit, btnsListUnitHover, btnsModal, modalContainer, styleBtnsAdaptiveMenu } from "@/app/(main)/(main-list)/style";
import { IListObj, NewUnitObj } from "@/app/types/types";
import { useAppDispatch } from "@/state/hook";
import { Autocomplete, Box, Button, ListItem, Modal, TextField, Typography, useMediaQuery } from "@mui/material";
import { usePathname } from "next/navigation";
import { ChangeEvent, useState } from "react";
import AddIcon from '@mui/icons-material/Add';
import { secondTextInput } from "@/app/main-styles";
import CheckIcon from '@mui/icons-material/Check';
import ClearIcon from '@mui/icons-material/Clear';
import { evaluate } from "mathjs";
import { addNewUnit } from "@/state/slices/list-slice";
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import { theme } from "@/config/ThemeMUI/theme";

interface PropsData {
    ingr: IListObj;
    id: string;
    recipe_id?: string,
    handleClose?: () => void
}

export function AddNewUnit({ props }: { props: PropsData }) {
    const { ingr, id, recipe_id, handleClose } = props;
    const [open, setOpen] = useState<boolean>(false)
    const dispatch = useAppDispatch()
    const [amount, setAmount] = useState<string>('0')
    const [unit, setUnit] = useState<string>('');
    const pathName = usePathname()
    const isSmallScreen = useMediaQuery("(max-width:800px)");

    console.log('2')
    // const uuid = uuidv4();
    // const { el, _id} = ingr

    // function handleAmount(e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    //     console.log('handleAmount')
    //     // const value = e.target.value;
    //     const value = e.target.value === '' ? '0' : e.target.value;
    //     // Регулярное выражение: Число от 0 до 9999.9999 (не более 4 знаков после точки)
    //     const regex = /^(?:\d{1,4})(?:\.\d{0,4})?$/;

    //     if (value === '' || regex.test(value)) {
    //         setAmount(value);
    //     }
    //     // if (value === '' || (!isNaN(parseFloat(value)) && parseFloat(value) >= 0 && parseFloat(value) <= 999)) {
    //     //     setAmount(parseFloat(value))
    //     // }
    // };

    function handleAmount(e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
        let inputValue = e.target.value;

        inputValue = inputValue.replace(/[^0-9.,]/g, "");

        inputValue = inputValue.replace(",", ".");

        if (inputValue === "") {
            inputValue = "0";
        }

        if (inputValue === ".") {
            inputValue = "0.";
        }

        if (inputValue.length > 1 && inputValue.startsWith("0") && !inputValue.startsWith("0.")) {
            inputValue = inputValue.slice(1);
        }

        const dotCount = (inputValue.match(/\./g) || []).length;
        if (dotCount > 1) {
            inputValue = inputValue.slice(0, inputValue.lastIndexOf("."));
        }

        const match = inputValue.match(/^(\d{0,4})(\.\d{0,4})?/);
        inputValue = match ? match[0] : "0";

        setAmount(inputValue);
    }



    function confirmAmount(ingredient_id: string) {

        if (id !== '') {
            const numericAmount = evaluate(amount);

            const newUnit = {
                shop_unit: false,
                choice: unit,
                amount: numericAmount,
            }
            if (pathName === '/list') {
                setOpen(false)
                dispatch(addNewUnit({ ingredient_id, new_unit: newUnit }))
            }


            //     if (typeof amount === 'number' && unit !== null) {
            //         if (isNaN(amount)) {
            //             const newUnit = {
            //                 shop_unit:false,
            //                 choice:unit,
            //                 amount:0,
            //                 _id:uuidv4()
            //             }
            //             if(pathName === '/list'){
            //                 dispatch(addNewUnit({ connection_id: id,  ingredient_id, updated_unit:newUnit }))
            //             }else if(pathName === '/list-recipe' && recipe_id){
            //                 dispatch(newUnitListRecipe({connection_id: id,  ingredient_id, updated_unit:newUnit, recipe_id}))
            //             }

            //             setOpen(false)
            //             // console.log(0, unit)
            //         } else {
            //             const newUnit = {
            //                 shop_unit:false,
            //                 choice:unit,
            //                 amount:amount,
            //                 _id:uuidv4()
            //             }
            //             if(pathName === '/list'){
            //                 dispatch(addNewUnit({ connection_id: id,  ingredient_id, updated_unit:newUnit }))
            //             }else if(pathName === '/list-recipe' && recipe_id){
            //                 dispatch(newUnitListRecipe({connection_id: id,  ingredient_id, updated_unit:newUnit, recipe_id}))
            //             }
            //             setOpen(false)
            //             // console.log(amount, unit)
            //         }
            //     } else {
            //         console.log('add error handler for inputs')
            //     }
        }

    }

    // console.log(amount)


    return (
        <>
            <Button onClick={(e) => {
                handleClose
                setOpen(true)
            }} sx={isSmallScreen ? [btnsListUnitHover, styleBtnsAdaptiveMenu] : btnsListUnitHover}>
                <AddCircleOutlineIcon></AddCircleOutlineIcon>
                {/* <AddIcon fontSize="large" sx={{width:'30px', height:'100%', display:'block',}} ></AddIcon>  */}
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