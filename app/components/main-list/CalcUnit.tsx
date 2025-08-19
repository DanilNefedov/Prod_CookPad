'use client'

import { useAppDispatch, useAppSelector } from "@/state/hook";
import { usePathname } from "next/navigation";
import { memo, useCallback, useMemo, useState } from "react";
import { create, all, } from 'mathjs'
import { Alert, Box, Button, Menu, MenuItem, TextField } from "@mui/material";
import { alertCalc, alertCalcBox, btnCleanInput, btnCleanInputIcon, calcInput, 
    calcInputIcon, calcIntupBox, containerCalcBtns, containerCalcGrid, menuCalc, 
    unitButton } from "@/app/(main)/(main-list)/styles";
import CalculateIcon from '@mui/icons-material/Calculate';
import BackspaceIcon from '@mui/icons-material/Backspace';
import CheckIcon from '@mui/icons-material/Check';
import { changeAmountFetch } from "@/state/slices/list-slice";
import { theme } from "@/config/ThemeMUI/theme";
import { newAmountListRecipe } from "@/state/slices/list-recipe-slice";
import { wrapCenter } from "@/app/styles";
import { useUnitContext } from "@/config/unit-context/UnitContext";


const CalcUnit = memo(() => {
    const { recipe_id, ingredient_id, unit_id } = useUnitContext();
    

    const amount = useAppSelector(state =>
        recipe_id ? state.listRecipe.units[unit_id]?.amount : state.list.units[unit_id]?.amount
    );

    const [currentValue, setCurrentValue] = useState<string>('')
    const userStore = useAppSelector(state => state.user);
    const connection_id = userStore?.user?.connection_id;

    const [isParenthesisOpen, setIsParenthesisOpen] = useState<number>(0);
    const [mathError, setMathError] = useState<string>('')
    const pathName = usePathname()
    const dispatch = useAppDispatch()

    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const open = Boolean(anchorEl);

    const handleClick = useCallback((event: React.MouseEvent<HTMLButtonElement>) => {
        setAnchorEl(event.currentTarget);
    }, []);


    const handleClose = useCallback(() => {
        setAnchorEl(null);
        setCurrentValue('');
    }, [amount]);


    const btnValues = useMemo(() => [
        ["C", "( )", "/",],
        ["7", "8", "9", "*"],
        ["4", "5", "6", "-"],
        ["1", "2", "3", "+"],
        ["0", ".", "="], 
    ], []);
    //["%","0", ".", "="],

    const math = create(all, {
        number: 'BigNumber',
        precision: 10
    })

    const cleanArea = useCallback(() => {
        const lastChar = currentValue[currentValue.length - 1];

        if (currentValue !== '') {
            const newCurrentValue = currentValue.slice(0, -1);
            setCurrentValue(newCurrentValue);

            if (lastChar === "(") {
                setIsParenthesisOpen(isParenthesisOpen - 1);
            } else if (lastChar === ")") {
                setIsParenthesisOpen(isParenthesisOpen + 1);
            }
        }

    }, [currentValue, isParenthesisOpen]);



    const handleEqual = useCallback((currentValue: string): string | null => {

        try {
            const endsWithOperator = /[+\-*/^%]$/.test(currentValue);
            if (endsWithOperator) {
                setMathError("Incomplete expression!");
                return null;
            }

            const invalidInput = /[^0-9+\-*/^%().]/.test(currentValue);
            if (invalidInput) {
                setMathError("Invalid input!");
                return null;
            }
            const result = math.evaluate(currentValue);

            if (isNaN(result)) {
                setMathError("NaN");
                return null;
            }

            if (!isFinite(result)) {
                setMathError("Infinity");
                return null;
            }


            return math.round(result, 4).toString();

        } catch (error) {
            console.log(error)
            setMathError("Check the input data");
            return null;
        }
    }, [math]);



    const handlCalc = useCallback((btn: string) => {

        if (btn === "=") {
            const resEqual = handleEqual(currentValue);
            if (resEqual !== null) {
                setCurrentValue(resEqual);
                setMathError("");
            }
        }
        else if (btn === "( )") {
            const lastChar = currentValue[currentValue.length - 1];
            const lastIsOperator = /[+\-*/]/.test(lastChar);

            if (
                isParenthesisOpen === 0
                || lastChar === "("
                || currentValue.length === 0
                || (isParenthesisOpen % 2 !== 0 && lastIsOperator)
            ) {
                setCurrentValue(prevValue => prevValue + "(");
                setIsParenthesisOpen(isParenthesisOpen + 1);

            }
            else {
                setCurrentValue(prevValue => prevValue + ")");
                setIsParenthesisOpen(isParenthesisOpen - 1);
            }

        }
        else if (btn === "C") {
            setMathError("");
            setIsParenthesisOpen(0);
            setCurrentValue(amount !== null ? amount.toString() : currentValue);

        } else {
            const nextValue = currentValue !== '' ? currentValue + btn : amount + btn;
            
            if (/^[0-9+\-*/.()]*$/.test(nextValue)) {
                const numbers = nextValue.split(/[-+*/()]/).filter(Boolean);

                const isValid = numbers.every(num => (num.match(/\./g) || []).length <= 1);
                if (isValid) {
                    setCurrentValue(nextValue);
                }
            }
        }

    }, [currentValue, isParenthesisOpen, amount, handleEqual]);

    const updateAmountCalc = useCallback(() => {
        if (amount === null || currentValue === amount.toString()) return

        const resEqual = handleEqual(currentValue);
        if (resEqual === null) return;

        const numericValue = parseFloat(resEqual);

        if (numericValue > 9999.9999) {
            setMathError("Max number 9999.9999");
            return;
        }
        if (numericValue < 0) {
            setMathError("Result must be 0 or greater");
            return;
        }

        setMathError("");
        setCurrentValue(resEqual);
        // setAmount(numericValue.toString())

        if (unit_id !== "" && pathName === "/list") {
            dispatch(changeAmountFetch({ ingredient_id, unit_id: unit_id, amount: numericValue }));
        } else if (unit_id !== "" && pathName === "/list-recipe" && recipe_id) {
            dispatch(newAmountListRecipe({ connection_id: connection_id, ingredient_id: ingredient_id, unit_id: unit_id, amount: numericValue, _id: recipe_id }))
        }

    }, [currentValue, unit_id, pathName, ingredient_id, dispatch, amount, handleEqual, recipe_id]);


    return (
        <>
            <Button
                id="basic-button"
                aria-controls={open ? 'basic-menu' : undefined}
                aria-haspopup="true"
                aria-expanded={open ? 'true' : undefined}
                onClick={handleClick}
                sx={unitButton} 
                color='blackBtn'
            >
                <CalculateIcon color='primary'></CalculateIcon>
            </Button>

            <Menu
                id="basic-menu"
                anchorEl={anchorEl}
                // open
                open={Boolean(open)}
                onClose={handleClose}
                MenuListProps={{
                    'aria-labelledby': 'demo-positioned-button',
                }}
                sx={menuCalc}
            >
                <Box component={MenuItem} sx={alertCalcBox}>
                    {mathError !== '' ?
                        <Alert severity="error" sx={alertCalc}>
                            {mathError}
                        </Alert>
                        :
                        <></>
                    }
                </Box>

                <Box
                    component={MenuItem}
                    sx={containerCalcGrid}
                >

                    <Box sx={calcIntupBox}>
                        <TextField
                            sx={calcInput(theme)}
                            multiline
                            value={currentValue.toString() !== '' ? currentValue.toString() : amount}
                            disabled
                        />
                        <CheckIcon
                            onClick={() => updateAmountCalc()}
                            sx={calcInputIcon}
                        />
                    </Box>

                    <Box sx={[containerCalcBtns, wrapCenter]}>
                        <Button onClick={cleanArea} sx={btnCleanInput} color='blackRedBtn'>
                            <BackspaceIcon sx={btnCleanInputIcon} />
                        </Button>

                        {btnValues.flat().map((btn, i) => {
                            return (
                                <Button
                                    key={i}
                                    color='blackRedBtn'
                                    sx={{
                                        width: i === 17 ? '128px' : '64px',
                                        [theme.breakpoints.down('md')]: {
                                            width: i === 17 ? '100px' : '50px',
                                            minWidth: i === 17 ? '100px' : '50px',
                                        }
                                    }}
                                    onClick={() => handlCalc(btn)}
                                >
                                    {btn}
                                </Button>
                            )

                        })}
                    </Box>
                </Box>


            </Menu>
        </>

    )
}, )

CalcUnit.displayName = "CalcUnit"

export default CalcUnit