import { IngredientForAutocomplite, ingredintFetch } from "@/app/types/types";
import { useAppDispatch } from "@/state/hook";
import { Autocomplete, Box, debounce, ListItem, TextField, Typography } from "@mui/material";
import { ChangeEvent, useEffect, useMemo, useState } from "react";
import { fetchLocationSuggestions } from "./request-search";
import { secondTextInput } from "@/app/main-styles";
import { v4 as uuidv4 } from 'uuid';
import { choiceAutocomplite, choiceUnits, errorAutocomplite, ingredientAmount } from "@/state/slices/step-by-step";
import { theme } from "@/config/ThemeMUI/theme";


interface AutocompleteProps {
    ingredient: IngredientForAutocomplite,
    open: boolean,
    error: boolean
}


export function Autocomplite(props: { props: AutocompleteProps }) {
    const { ingredient, open, error } = props.props;
    const dispatch = useAppDispatch();
    const [value, setValue] = useState<IngredientForAutocomplite | null>(ingredient);
    const [inputValue, setInputValue] = useState<string>('');
    const [options, setOptions] = useState<IngredientForAutocomplite[]>([]);

    console.log(ingredient)

    const fetch = useMemo(
        () =>
            debounce(
                async (request: { input: string }, callback: (results: ingredintFetch[]) => void) => {
                    try {
                        if (request.input?.trim().length > 1) {
                            const response = await fetchLocationSuggestions(request.input);
                            callback(response);
                        }
                    } catch (error) {
                        console.error(error);
                        callback([]);
                    }
                },
                400
            ),
        []
    );

    // useEffect(() => {
    //     let active = true;

    //     if (inputValue === '') {
    //         setOptions(value ? [value] : []);
    //         dispatch(errorAutocomplite(ingredient.ingredient_id));
    //         return undefined;
    //     }

    //     fetch({ input: inputValue }, async (results) => {
    //         if (active) {
    //             const newOptions = results.map((el) => {
    //                 return {
    //                     ingredient_id: el._id,
    //                     name: el.name,
    //                     new_ingredient: false,
    //                     units: el.units,
    //                     media: el.media,
    //                 };
    //             });
    //             setOptions(value ? [value, ...newOptions] : newOptions);
    //             dispatch(errorAutocomplite(ingredient.ingredient_id));
    //         }
    //     });

    //     return () => {
    //         active = false;
    //     };
    // }, [value, inputValue, fetch]);

    useEffect(() => {
        let active = true;
    
        if (inputValue === '') {
            setOptions(value ? [value] : []);
            dispatch(errorAutocomplite(ingredient.ingredient_id));
            return undefined;
        }
    
        fetch({ input: inputValue }, async (results) => {
            if (active) {
                const newOptions = results.map((el) => {
                    return {
                        ingredient_id: el._id,
                        name: el.name,
                        new_ingredient: false,
                        units: el.units,
                        media: el.media,
                    };
                });
                setOptions(value ? [value, ...newOptions] : newOptions);
                dispatch(errorAutocomplite(ingredient.ingredient_id));
            }
        });
    
        return () => {
            active = false;
        };
    }, [value, inputValue, fetch, dispatch, ingredient.ingredient_id]); 
    



    function changeAmount(e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
        const newValue = e.target.value;
        if (newValue === '' || (newValue.length <= 5 && parseFloat(newValue) >= 0)) {
            dispatch(
                ingredientAmount({
                    ingredient_id: ingredient.ingredient_id,
                    amount: newValue === '' ? 0 : parseFloat(newValue),
                })
            );
            dispatch(errorAutocomplite(ingredient.ingredient_id));
        }
    }

    function isDisabled() {
        if (Array.isArray(ingredient.units)) {
            return ingredient.units.length > 0;
        }

        const hasUnits = inputValue !== '' && ingredient.units.amount !== 0;
        return !hasUnits && ingredient.units.list.length === 0;
    }

    function cahngeUnits(newValue: string) {
        dispatch(choiceUnits({ ingredient_id: ingredient.ingredient_id, choice: newValue || '' }));
        dispatch(errorAutocomplite(ingredient.ingredient_id));
    }


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

            <Autocomplete
                id="ingredient"
                sx={{
                    ...secondTextInput,
                    '& .MuiInputBase-input': {
                        p: '6px 10px 6px',
                        [theme.breakpoints.down('md')]: {
                            fontSize: '14px',
                            p: '5px 2px 5px !important'
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
                    flexGrow: '1',
                    [theme.breakpoints.down(500)]: {
                        width: '80%'
                    }
                }}
                getOptionLabel={(option) => (typeof option === 'string' ? option : option.name)}
                filterOptions={(x) => x}
                options={options}
                autoComplete
                includeInputInList
                filterSelectedOptions
                freeSolo
                value={value}
                noOptionsText="No ingredients"
                onChange={(event, newValue: IngredientForAutocomplite | string | null) => {
                    if (typeof newValue === 'string') {
                        const newIngredient = {
                            ingredient_id: ingredient.ingredient_id,
                            name: newValue,
                            new_ingredient: true,
                            media: '',
                            units: ['kg', 'g', 'ml', 'l'],
                        };
                        setValue(newIngredient);
                        setOptions([newIngredient, ...options]);
                        dispatch(
                            choiceAutocomplite(newIngredient)
                        );
                        dispatch(errorAutocomplite(ingredient.ingredient_id));
                    } else {
                        setOptions(newValue ? [newValue, ...options] : options);
                        setValue(newValue);
                        dispatch(
                            choiceAutocomplite({
                                ingredient_id: ingredient.ingredient_id,
                                name: newValue?.name || '',
                                new_ingredient: newValue?.new_ingredient || false, // maybe only need to change it to false
                                media: newValue?.media || '',
                                units: newValue?.units as string[] || [],
                                // check_open_link: newValue?.ingredient_id || ''
                            })
                        );
                    }
                }}
                onInputChange={(event, newInputValue) => {
                    setInputValue(newInputValue);
                }}
                renderInput={(params) => <TextField error={open && !error ? true : false} {...params} placeholder="Add an ingredient" fullWidth />}
                renderOption={(props, option) => (
                    <ListItem
                        sx={{
                            color: '#fff', maxWidth: '100%',
                            '&.MuiListItem-root.MuiListItem-gutters': {
                                minHeight: '40px',
                                [theme.breakpoints.down('md')]: {
                                    minHeight: '33px'
                                }
                            }
                        }}
                        {...props}
                        key={uuidv4()}
                    >
                        <Box
                            display="flex"
                            alignItems="center"
                            sx={{
                                ':hover': { backgroundColor: '#1F2128' },
                                width: '100%',
                            }}
                        >

                            <Box
                                sx={{
                                    flexGrow: 1,
                                    width: 'calc(100% - 44px)',
                                    wordWrap: 'break-word',
                                }}
                            >
                                <Typography
                                    variant="body2"
                                    sx={{
                                        '&.MuiMenuItem-root': {
                                            color: '#fff',
                                            '&:hover': {
                                                backgroundColor: '#1F2128',
                                            },
                                            '&.Mui-selected': {
                                                backgroundColor: '#1F2128',
                                                color: '#fff',
                                            },
                                        },
                                    }}
                                >
                                    {typeof option === 'string' ? option : option.name}
                                </Typography>
                            </Box>
                        </Box>
                    </ListItem>

                )}
            />

            <TextField
                id="outlined-basic"
                placeholder="Amount"
                variant="outlined"
                type="number"
                onKeyDown={(e) => {
                    if (['-', '+', 'e'].includes(e.key)) {
                        e.preventDefault();
                    }
                }}
                value={'list' in ingredient.units && ingredient.units.amount !== 0 ? ingredient.units.amount : ''}//
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
                    cahngeUnits(newValue)
                }}
                renderInput={(params) => (
                        <TextField
                            {...params}
                            placeholder="Units"
                            variant="outlined"
                            inputProps={{
                                ...params.inputProps,
                                maxLength: 10,
                            }}
                        // sx={{
                            
                        //     [theme.breakpoints.down('md')]: {
                        //         minHeight:'33px'
                        //     }
                        // }}
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
                        "& .MuiAutocomplete-option": {
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
}