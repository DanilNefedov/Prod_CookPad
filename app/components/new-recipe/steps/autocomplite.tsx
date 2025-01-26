import { IngredientForState, ingredintFetch } from "@/app/types/types";
import { useAppDispatch } from "@/state/hook";
import { Autocomplete, Box, debounce, TextField, Typography } from "@mui/material";
import { ChangeEvent, useEffect, useMemo, useState } from "react";
import { fetchLocationSuggestions } from "./request-search";
import { secondTextInput } from "@/app/main-styles";
import { v4 as uuidv4 } from 'uuid';
import { choiceAutocomplite, choiceUnits, errorAutocomplite, ingredientAmount } from "@/state/slices/step-by-step";


interface AutocompleteProps {
    ingredient: IngredientForState,
    open: boolean,
    error: boolean
}


export function Autocomplite(props: { props: AutocompleteProps }) {
    const { ingredient, open, error } = props.props;
    const dispatch = useAppDispatch();
    const [value, setValue] = useState<IngredientForState | null>(ingredient);
    const [inputValue, setInputValue] = useState<string>('');
    const [options, setOptions] = useState<IngredientForState[]>([]);


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

    useEffect(() => {
        let active = true;

        if (inputValue === '') {
            setOptions(value ? [value] : []);
            dispatch(errorAutocomplite());
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
                dispatch(errorAutocomplite());
            }
        });

        return () => {
            active = false;
        };
    }, [value, inputValue, fetch]);



    console.log(ingredient)
    function changeAmount(e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
        const newValue = e.target.value;
        if (newValue === '' || (newValue.length <= 3 && parseFloat(newValue) >= 0)) {
            dispatch(
                ingredientAmount({
                    ingr_id: ingredient.ingredient_id,
                    amount: newValue === '' ? 0 : parseFloat(newValue),
                })
            );
            dispatch(errorAutocomplite());
        }
    }

    return (
        <>
            <Box sx={{ width: '40px', height: '40px', borderRadius: '50%', backgroundColor: 'background.default' }}>
                <Box sx={{ width: '100%', height: '100%', padding: '7px' }} component="img" src={ingredient.media !== '' ? ingredient.media : 'images/load-ingr.svg'} alt={ingredient.name} loading="lazy"></Box>
            </Box>

            <Autocomplete
                id="ingredient"
                sx={{
                    ...secondTextInput,
                    '& .MuiInputBase-input': {
                        p: '6px 10px 6px',
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
                onChange={(event: any, newValue: IngredientForState | string | null) => {
                    console.log(newValue)
                    if (typeof newValue === 'string') {
                        const newIngredient = {
                            ingredient_id: ingredient.ingredient_id,
                            name: newValue,
                            new_ingredient: true,
                            media: 'images/load-ingr.svg',
                            units: ['kg', 'g', 'ml', 'l'],
                        };
                        setValue(newIngredient);
                        setOptions([newIngredient, ...options]);
                        dispatch(
                            choiceAutocomplite({
                                ingr_id: newIngredient.ingredient_id,
                                name: newIngredient.name,
                                new_ingredient: newIngredient.new_ingredient,
                                media: newIngredient.media,
                                units: newIngredient.units,
                                check_open_link: ''
                            })
                        );
                    } else {
                        setOptions(newValue ? [newValue, ...options] : options);
                        setValue(newValue);
                        dispatch(
                            choiceAutocomplite({
                                ingr_id: ingredient.ingredient_id,
                                name: newValue?.name || '',
                                new_ingredient: newValue?.new_ingredient || false,
                                media: newValue?.media || '',
                                units: newValue?.units as string[] || [],
                                check_open_link: newValue?.ingredient_id || ''
                            })
                        );
                    }
                }}
                onInputChange={(event, newInputValue) => {
                    setInputValue(newInputValue);
                }}
                renderInput={(params) => <TextField error={open && !error ? true : false} {...params} placeholder="Add an ingredient" fullWidth />}
                renderOption={(props, option) => (
                    <li
                        style={{ color: '#fff', maxWidth: '100%' }}
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
                            <Box sx={{ display: 'flex', width: 100 }}></Box>

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
                    </li>

                )}
            />

            <TextField
                id="outlined-basic"
                placeholder="Amount"
                variant="outlined"
                type="number"
                inputProps={{ maxLength: 3, inputMode: 'numeric' }}
                value={'list' in ingredient.units && ingredient.units.amount !== 0 ? ingredient.units.amount : ''}
                onChange={(e) => changeAmount(e)}
                sx={{
                    ...secondTextInput,
                    '& .MuiInputBase-input': {
                        p: '7.5px 12px 7.5px',
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
                }}
            />
            <Autocomplete
                disabled={Array.isArray(ingredient.units) ? ingredient.units.length > 0 : ingredient.units.list.length === 0}
                freeSolo
                options={'list' in ingredient.units && ingredient.units.list || []}
                value={'list' in ingredient.units && ingredient.units.choice || ''}
                onInputChange={(event, newValue) => {
                    dispatch(choiceUnits({ ingr_id: ingredient.ingredient_id, choice: newValue || '' }));
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
                    />
                )}
                sx={{
                    ...secondTextInput,
                    '& .MuiInputBase-input': {
                        p: '7.5px 12px 7.5px',
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
                }}
            />


        </>
    );
}