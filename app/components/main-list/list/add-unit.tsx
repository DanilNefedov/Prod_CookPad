import { amountNewUnit, btnsListUnitHover, btnsModal, modalContainer } from "@/app/(main)/(main-list)/style";
import { IListObj } from "@/app/types/types";
import { useAppDispatch } from "@/state/hook";
import { Autocomplete, Box, Button, Modal, TextField, Typography } from "@mui/material";
import { usePathname } from "next/navigation";
import { ChangeEvent, useState } from "react";
import AddIcon from '@mui/icons-material/Add';
import { secondTextInput } from "@/app/main-styles";
import CheckIcon from '@mui/icons-material/Check';
import ClearIcon from '@mui/icons-material/Clear';



interface PropsData {
    ingr: IListObj;
    id: string | null;
    recipe_id?:string
}

export function AddNewUnit({ props }: { props: PropsData }) {
    const { ingr, id, recipe_id } = props;
    const [open, setOpen] = useState<boolean>(false)
    const dispatch = useAppDispatch()
    const [amount, setAmount] = useState<number | string>(0)
    const [unit, setUnit] = useState<string | null>(null);
    const pathName = usePathname()

    // const uuid = uuidv4();
    // const { el, _id} = ingr

    function handleAmount(e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
        console.log('handleAmount')
        // const value = e.target.value;
        // if (value === '' || (!isNaN(parseFloat(value)) && parseFloat(value) >= 0 && parseFloat(value) <= 999)) {
        //     setAmount(parseFloat(value))
        // }
    };

    function confirmAmount(ingredient_id: string) {
        console.log('confirmAmount')
        // // console.log(amount, unit)
        // if (id && id !== null) {
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
        // }

    }

    // console.log(amount)
    return (
        <>
            <Button onClick={() => setOpen(true)} sx={btnsListUnitHover}>
                <AddIcon></AddIcon>
            </Button>
            <Modal
                open={open}
                onClose={() => setOpen(false)}
            // sx={{maxWidth:'500px'}}
            >
                <Box sx={modalContainer}
                >
                    <Typography sx={{ textAlign: 'center' }}>Add a new Unit to {ingr.name}</Typography>
                    <Box sx={{ display: "flex", justifyContent:'center', p:'20px 0'}}>
                        <TextField type="number" 
                        value={typeof amount === 'number' && !isNaN(amount) ? amount.toString() : ''} 
                        onChange={(e) => handleAmount(e)}
                        sx={{...secondTextInput, ...amountNewUnit}}
                        ></TextField>
                        <Autocomplete
                            options={ingr.list}
                            sx={{...secondTextInput, ...amountNewUnit, width:'120px'}}
                            renderOption={(props, option) => {
                                return (
                                    <li {...props} key={option}>
                                        {option}
                                    </li>
                                )
                            }}
                            renderInput={(params) => (
                                <TextField
                                    placeholder="Units"
                                    sx={{height:'100%'}}
                                    {...params}
                                />
                            )}
                            onChange={(event, newValue) => {
                                setUnit(newValue !== null ? newValue : null);
                            }}
                            value={unit}
                        />

                        <Button onClick={() => confirmAmount(ingr._id)} 
                        sx={btnsModal}
                        >
                            <CheckIcon sx={{color:'text.secondary'}}></CheckIcon>
                        </Button>
                        <Button onClick={() => setOpen(false)}
                        sx={btnsModal}
                        >
                            <ClearIcon sx={{color:'text.secondary'}}></ClearIcon>
                        </Button>
                    </Box>



                </Box>


            </Modal>
        </>

    )
}