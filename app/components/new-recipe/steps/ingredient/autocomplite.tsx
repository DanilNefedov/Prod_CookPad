import { useAppDispatch, useAppSelector } from "@/state/hook";
import { Autocomplete, Box, TextField} from "@mui/material";
import { ChangeEvent, memo, useCallback, useEffect, useRef, } from "react";
import { secondTextInput } from "@/app/main-styles";
import { theme } from "@/config/ThemeMUI/theme";
import { MainInput } from "./main-input";
import { choiceUnits, ingredientAmount } from "@/state/slices/stepper/ingredients";
import { shallowEqual } from "react-redux";
import { addErrorIngredient, deleteErrorIngredient } from "@/state/slices/stepper/error-open";
import { handleAmountChange } from "@/app/components/main-list/function";



export const Autocomplite = memo(({ingredientId,}: { ingredientId: string,}) => {
    const numbStep = 4
    
    const ingredient = useAppSelector((state) => {
        const found = state.ingredientsSlice.ingredients.find((ingr) => ingr.ingredient_id === ingredientId);
        if (!found) throw new Error(`Ingredient with id ${ingredientId} not found`);
        return found;
    }, shallowEqual);
    
    const foundId = useAppSelector(state => {
        const value = state.statusSlice.steps[numbStep].error_status.value;
        return Array.isArray(value) ? value.find(el => el === ingredientId) || false : false;
    }, shallowEqual);

    const openPage = useAppSelector(state =>state.statusSlice.steps[numbStep].open);
      
    
    const dispatch = useAppDispatch();
    const inputValue = useRef<string>('');
    
    


    const handleInputChange = useCallback((newInputValue: string) => {
        inputValue.current = newInputValue;
    }, []);

    

      
    function changeAmount(e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
        const newValue = e.target.value.trim();

        const resValue = handleAmountChange(newValue)
        // if (newValue === '' || (newValue.length <= 5 && parseFloat(newValue) >= 0)) {
            dispatch(
                ingredientAmount({
                    ingredient_id: ingredient.ingredient_id,
                    amount: resValue === '' ? 0 : parseFloat(resValue),
                })
            );
        // }
    }

    function isDisabled() {
        if (Array.isArray(ingredient.units)) {
            return ingredient.units.length > 0;
        }

        const hasUnits = inputValue.current !== '' && ingredient.units.amount !== 0;
        return !hasUnits && ingredient.units.list.length === 0;
    }

    function cahngeUnits(newValue: string) {
        dispatch(choiceUnits({ ingredient_id: ingredient.ingredient_id, choice: newValue }));
    }
    
    useEffect(() => {
        if ('list' in ingredient.units) {
            const isNameEmpty = inputValue.current === '' && ingredient.name === '';
            const isAmountEmpty = ingredient.units.amount === 0;
            const isChoiceEmpty = ingredient.units.choice === '';
    
            const emptyCount = [isNameEmpty, isAmountEmpty, isChoiceEmpty].filter(Boolean).length;
    
           

            if (emptyCount > 0 && emptyCount < 3) {
                dispatch(addErrorIngredient(ingredientId));
                
            } else {
                dispatch(deleteErrorIngredient(ingredientId));
                
                
            }
        }
        

    },[inputValue.current, ingredient.units, ingredientId, foundId])

    return (
        <>
        
            <Box sx={{
                width: '40px', height: '40px', borderRadius: '50%', backgroundColor: 'background.default',
                [theme.breakpoints.down('md')]: {
                    width: '30px',
                    height: '30px'
                }
            }}>
                <Box sx={{
                    width: '100%', height: '100%', padding: '7px', [theme.breakpoints.down('md')]: {
                        p: '5px'
                    }
                }} component="img"
                    src={ingredient.media !== '' ? ingredient.media : 'images/load-ingr.svg'} alt={ingredient.name}
                    loading="lazy"></Box>
            </Box>

            <MainInput 
                ingredient={ingredient}
                handleInputChange={handleInputChange}
                error={foundId === ingredientId && openPage}
            ></MainInput>

            
            <TextField
                disabled={isDisabled()}
                error={foundId === ingredientId && openPage ? true : false}
                id="outlined-basic"
                placeholder="Amount"
                variant="outlined"
                type="number"
                onKeyDown={(e) => {
                    if (['-', '+', 'e'].includes(e.key)) {
                        e.preventDefault();
                    }
                }}
                value={'list' in ingredient.units && ingredient.units.amount !== 0 ? ingredient.units.amount : '0'}//
                onChange={(e) => changeAmount(e)}
                sx={{
                    ...secondTextInput,
                    '& .MuiInputBase-input': {
                        p: '7.5px 12px 7.5px',

                        [theme.breakpoints.down('md')]: {
                            fontSize: '14px',
                            p: '5px 10px 5px '
                        }
                    },
                    '& .MuiInputLabel-root': {
                        top: '-10px',
                        '&.Mui-focused': {
                            color: '#fff',
                        },
                    },
                    '& .MuiTextField-root': {
                        m: '0',
                    },
                    '&&': {
                        m: '4px',
                        [theme.breakpoints.down(500)]: {
                            ml: '0',

                        }
                    },
                    '& .MuiButtonBase-root': {
                        color: '#fff',
                    },
                    width: '15%',
                    [theme.breakpoints.down(500)]: {
                        width: '37%',

                    }
                }}
            />
            <Autocomplete
                disabled={isDisabled()}
                freeSolo
                options={'list' in ingredient.units && ingredient.units.list || []}
                value={'list' in ingredient.units && ingredient.units.choice || ''}
                onInputChange={(event, newValue) => {
                    cahngeUnits(newValue.trim())
                }}
                renderInput={(params) => (
                        <TextField
                            {...params}
                            placeholder="Units"
                            variant="outlined"
                            slotProps={{
                                htmlInput: {
                                    ...params.inputProps,
                                    maxLength:15
                                },
                                
                            }}
                            
                            error={foundId === ingredientId && openPage ? true : false}
                        />

                )}
                slotProps={{
                    popper: {
                      modifiers: [
                        {
                          name: "preventOverflow",
                          options: {
                            boundary: "window",
                          },
                        },
                      ],
                    },
                    paper: {
                      sx: {
                        "& .MuiAutocomplete-listbox .MuiAutocomplete-option": {
                          [theme.breakpoints.down("md")]: {
                            minHeight: "33px",
                            fontSize:'14px'
                          },
                        },
                      },
                    },
                  }}
                sx={{
                    ...secondTextInput,
                    '& .MuiInputBase-input': {
                        p: '7.5px 12px 7.5px',

                        [theme.breakpoints.down('md')]: {
                            fontSize: '14px',
                            p: '5px 0px 5px !important'
                        }
                    },
                    '& .MuiInputLabel-root': {
                        top: '-10px',
                        '&.Mui-focused': {
                            color: '#fff',
                        },
                    },
                    '& .MuiTextField-root': {
                        m: '0',
                    },
                    '&&': {
                        m: '4px',
                    },
                    '& .MuiButtonBase-root': {
                        color: '#fff',
                    },
                    width: '15%',
                    [theme.breakpoints.down(500)]: {
                        width: '37%',

                    },

                }}
            />


        </>
    );
}, (prevProps, nextProps) => {
    return prevProps.ingredientId === nextProps.ingredientId 
})


Autocomplite.displayName = "Autocomplite"