'use client'

import { UnitsList } from "@/app/types/types";
import { useAppDispatch } from "@/state/hook";
import { Dispatch } from "@reduxjs/toolkit";
import { usePathname } from "next/navigation";
import { SetStateAction, useState } from "react";
import { create, all } from 'mathjs'
import { Box, Button, Menu, MenuItem, TextField } from "@mui/material";
import { btnsListUnitHover, calcInput, containerCalcBtns, containerCalcGrid, menuCalc, unitBtnsImg } from "@/app/(main)/(main-list)/style";
import CalculateIcon from '@mui/icons-material/Calculate';
import EditIcon from '@mui/icons-material/Edit';
import BackspaceIcon from '@mui/icons-material/Backspace';



interface DataProps {
    elem: UnitsList;
    id: string;
    ingredient_id: string;
    setAmount: (value: string | number | ((prev: string | number) => string | number)) => void;
    recipe_id?: string;
}




export function CalcUnit({ props }: { props: DataProps }) {
    const { elem, id, ingredient_id, setAmount, recipe_id } = props
    const [currentValue, setCurrentValue] = useState<string>(`${elem.amount.toString()}`);
    const [isParenthesisOpen, setIsParenthesisOpen] = useState<number>(0);
    const pathName = usePathname()
    const dispatch = useAppDispatch()

    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const open = Boolean(anchorEl);
    const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
        setAnchorEl(null);
        setCurrentValue(elem.amount.toString())
    };


    const btnValues = [
        ["C", "( )", "/",],
        ["7", "8", "9", "*"],
        ["4", "5", "6", "-"],
        ["1", "2", "3", "+"],
        ["%", "0", ".", "="],
    ];

    const math = create(all, {
        number: 'BigNumber',
        precision: 10
    })

    function cleanArea() {
        console.log('cleanArea')
        // if (currentValue !== '') {
        //     const newCurrentValue = currentValue.slice(0, -1);
        //     setCurrentValue(newCurrentValue);
        // }
    }

    function handlCalc(btn: string) {
        console.log('handlCalc')
        // if (btn === "=") {
        //     const result = math.evaluate(currentValue);
        //     setCurrentValue(result.toString());
        //     setAmount(result.toString())
        // } else if (btn === "( )") {
        //     const lastChar = currentValue[currentValue.length - 1];
        //     if (isParenthesisOpen === 0 || lastChar === "(" || currentValue.length === 0) {
        //         setCurrentValue(prevValue => prevValue + "(");
        //         setIsParenthesisOpen(isParenthesisOpen + 1);
        //     } else {
        //         setCurrentValue(prevValue => prevValue + ")");
        //         setIsParenthesisOpen(isParenthesisOpen - 1);
        //     }
        // } else if (btn === "C") {
        //     setCurrentValue(elem.amount.toString());
        // }else {
        //     setCurrentValue(prevValue => prevValue + btn);
        // }

    }

    // console.log(currentValue)
    function updateAmountCalc() {
        console.log('updateAmountCalc')
        // const result = math.evaluate(currentValue);
        // setCurrentValue(result.toString());
        // setAmount(result.toString())

        // if(result.toString() !== 'Infinity' && result.toString() !== 'NaN'){
        //     // console.log(result.toString())
        //     if(id && id !== null){
        //         const newAmount = parseFloat(result.toString())
        //         if(pathName === '/list'){
        //             dispatch(changeAmountFetch({ connection_id: id, ingredient_id: ingredient_id, unit_id: elem._id, amount: newAmount }))
        //         }else if(pathName === '/list-recipe' && recipe_id){
        //             dispatch(newAmountListRecipe({connection_id: id, ingredient_id: ingredient_id, unit_id: elem._id, amount: newAmount, recipe_id }))
        //         }

        //     }
        // }
    }
    return (
        <>
            <Button
                id="basic-button"
                aria-controls={open ? 'basic-menu' : undefined}
                aria-haspopup="true"
                aria-expanded={open ? 'true' : undefined}
                onClick={handleClick}
                sx={{ ...unitBtnsImg, ...btnsListUnitHover, minWidth: '0' }}
            >
                <CalculateIcon></CalculateIcon>
            </Button>

            <Menu
                id="basic-menu"
                anchorEl={anchorEl}
                open={open}
                onClose={handleClose}
                MenuListProps={{
                    'aria-labelledby': 'basic-button',
                }}
                sx={menuCalc}
            >
                <Box
                    component={MenuItem}
                    sx={{
                        ...containerCalcGrid,
                        cursor: 'auto',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: 2,
                        alignItems: 'center'
                    }}
                >
                    <Box sx={{ width: '100%', position: 'relative', display: 'flex', alignItems: 'center' }}>
                        <TextField
                            sx={{ ...calcInput, flex: 1 }}
                            multiline
                            value={currentValue}
                            disabled
                        />
                        <EditIcon
                            onClick={() => updateAmountCalc()}
                            sx={{ position: 'absolute', right: '20px', bottom: 'calc(50% - 12px)', color: 'primary.dark', cursor: 'pointer' }}
                        />
                    </Box>

                    <Box sx={{ ...containerCalcBtns, display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: 1 }}>
                        <Button variant="contained" onClick={cleanArea} sx={{ backgroundColor: 'primary.dark' }}>
                            <BackspaceIcon sx={{ width: "16px" }} />
                        </Button>

                        {btnValues.flat().map((btn, i) => (
                            <Button
                                key={i}
                                sx={{ backgroundColor: 'primary.dark' }}
                                variant="contained"
                                onClick={() => handlCalc(btn)}
                            >
                                {btn}
                            </Button>
                        ))}
                    </Box>
                </Box>


            </Menu>
        </>

    )
}