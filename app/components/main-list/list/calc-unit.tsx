'use client'

import { UnitsList } from "@/app/types/types";
import { useAppDispatch } from "@/state/hook";
import { usePathname } from "next/navigation";
import { memo, useCallback, useEffect, useMemo, useState } from "react";
import { create, all, } from 'mathjs'
import { Alert, Box, Button, Menu, MenuItem, TextField } from "@mui/material";
import { btnsListUnitHover, calcInput, containerCalcBtns, containerCalcGrid, menuCalc, unitBtnsImg } from "@/app/(main)/(main-list)/style";
import CalculateIcon from '@mui/icons-material/Calculate';
import BackspaceIcon from '@mui/icons-material/Backspace';
import CheckIcon from '@mui/icons-material/Check';
import { changeAmountFetch } from "@/state/slices/list-slice";
import { theme } from "@/config/ThemeMUI/theme";
import { newAmountListRecipe } from "@/state/slices/list-recipe-slice";

interface DataProps {
    elem: UnitsList;
    id: string;
    ingredient_id: string;
    amount:string
    setAmount: (newValue: string) => void
    recipe_id?: string;
}


export const CalcUnit = memo(({ props }: { props: DataProps }) => {    
    const { elem, id, ingredient_id, amount, setAmount, recipe_id } = props
    const [currentValue, setCurrentValue] = useState<string>(amount);
    const [isParenthesisOpen, setIsParenthesisOpen] = useState<number>(0);
    const [mathError, setMathError] = useState<string>('')
    const pathName = usePathname()
    const dispatch = useAppDispatch()

    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const open = Boolean(anchorEl);

    useEffect(() => {
        if (currentValue !== amount) {
            setCurrentValue(amount);
        }
    }, [amount]);
    

    // const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    //     setAnchorEl(event.currentTarget);
    // };
    const handleClick = useCallback((event: React.MouseEvent<HTMLButtonElement>) => {
        setAnchorEl(event.currentTarget);
    }, []);

    // console.log('12121212')
    // const handleClose = () => {
    //     setAnchorEl(null);
    //     setCurrentValue(amount.toString())
    // };
    const handleClose = useCallback(() => {
        setAnchorEl(null);
        setCurrentValue(amount.toString());
    }, [amount]);

    // const btnValues = [
    const btnValues = useMemo(() => [

        ["C", "( )", "/",],
        ["7", "8", "9", "*"],
        ["4", "5", "6", "-"],
        ["1", "2", "3", "+"],
        ["%", "0", ".", "="],
    ], []);

    const math = create(all, {
        number: 'BigNumber',
        precision: 10
    })

    // function cleanArea() {
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



    // function handleEqual(currentValue: string): string | null {
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



    // function handlCalc(btn: string) {
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
            setCurrentValue(amount.toString());

        } else {
            const nextValue = currentValue + btn;

            if (/^[0-9+\-*/.()]*$/.test(nextValue)) {
                const numbers = nextValue.split(/[-+*/()]/).filter(Boolean);

                const isValid = numbers.every(num => (num.match(/\./g) || []).length <= 1);

                if (isValid) {
                    setCurrentValue(nextValue);
                }
            }
        }

    }, [currentValue, isParenthesisOpen, amount, handleEqual]);


    // function updateAmountCalc() {
    const updateAmountCalc = useCallback(() => {
        if (currentValue === amount.toString()) return 

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
        setAmount(numericValue.toString())

        if (id !== "" && pathName === "/list") {
            dispatch(changeAmountFetch({ ingredient_id, unit_id: elem._id, amount: numericValue }));
        }else if (id !== "" && pathName === "/list-recipe" && recipe_id){
            dispatch(newAmountListRecipe({connection_id: id, ingredient_id: ingredient_id, unit_id: elem._id, amount: numericValue, recipe_id }))
        }




        // }else{
        //     console.log('2345')
        //     setMathError('Max number 9999.9999')
        // }
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
    }, [currentValue, id, pathName, ingredient_id, elem._id, dispatch, amount, handleEqual, recipe_id, setAmount]);


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
                open={Boolean(open)}
                onClose={handleClose}
                MenuListProps={{
                'aria-labelledby': 'demo-positioned-button',
                }}
            
                sx={{...menuCalc,
                }}

            >
                <Box component={MenuItem} sx={{ p: "0",  [theme.breakpoints.down(600)]: {
                    minHeight:'auto'
                } }}>
                    {mathError !== '' ?
                        <Alert severity="error" sx={{ 
                            pb: '0', 
                            alignItems: "center", 
                            '& .MuiAlert-icon, & .MuiAlert-message': { p: '0', color: 'primary.main' },
                            [theme.breakpoints.down('md')]: {
                                fontSize:"14px",
                                
                            },
                           
                        }}>
                            {mathError}
                        </Alert>
                        :
                        <></>
                    }
                </Box>

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
                            value={currentValue.toString()}
                            disabled
                        />
                        <CheckIcon
                            onClick={() => updateAmountCalc()}
                            sx={{ 
                                p:"4px",
                                backgroundColor:'primary.dark',
                                borderRadius:"50%",
                                position: 'absolute', 
                                right: '20px', 
                                width:'30px',
                                height:'30px',
                                bottom: 'calc(50% - 15px)', 
                                color: 'text.primary', 
                                cursor: 'pointer',
                                [theme.breakpoints.down('md')]: {
                                    width:'25px',
                                    height:'25px',
                                    bottom: 'calc(50% - 12px)',
                                    p:'4px'
                                }
                             }}
                        />
                    </Box>

                    <Box sx={{ ...containerCalcBtns, display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: 1 }}>
                        <Button variant="contained" onClick={cleanArea} sx={{ backgroundColor: 'primary.dark', [theme.breakpoints.down('md')]: {
                            minWidth:'50px'
                        } }}>
                            <BackspaceIcon sx={{ width: "16px",  [theme.breakpoints.down('md')]: {mr:'2px'}}} />
                        </Button>

                        {btnValues.flat().map((btn, i) => (
                            <Button
                                key={i}
                                sx={{ backgroundColor: 'primary.dark',
                                    [theme.breakpoints.down('md')]: {
                                        minWidth:'50px',
                                        fontSize:'14px'
                                    }
                                }}
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
})

