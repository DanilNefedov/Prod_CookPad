import { secondTextInput } from "@/app/main-styles";
import { IngredientForAutocomplite, ingredintFetch } from "@/app/types/types";
import { theme } from "@/config/ThemeMUI/theme";
import { useAppDispatch } from "@/state/hook";
import { choiceAutocomplite } from "@/state/slices/stepper/ingredients";
import { Autocomplete, Box, debounce, ListItem, TextField, Typography } from "@mui/material";
import { memo, useEffect, useMemo, useState } from "react";
import { v4 as uuidv4 } from 'uuid';
import { fetchLocationSuggestions } from "../request-search";


interface PropsData {
    ingredient: IngredientForAutocomplite, 
    handleInputChange: (newInputValue: string) => void, 
    error:boolean
}


export const MainInput = memo(({ ingredient, handleInputChange, error }: PropsData) => {

    const [options, setOptions] = useState<IngredientForAutocomplite[]>([]);
    const [value, setValue] = useState<IngredientForAutocomplite | null>(ingredient);
    const [inputValue, setInputValue] = useState<string>('');

    const dispatch = useAppDispatch();



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
                // dispatch(errorIngredient(ingredient.ingredient_id));
            }
        });

        return () => {
            active = false;
        };
    }, [value, inputValue, fetch, dispatch, ingredient.ingredient_id]);



    return (
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
                        name: newValue.trim(),
                        new_ingredient: true,
                        media: '',
                        units: ['kg', 'g', 'ml', 'l'],
                    };
                    setValue(newIngredient);
                    setOptions([newIngredient, ...options]);
                    dispatch(
                        choiceAutocomplite(newIngredient)
                    );
                    handleInputChange(newIngredient.name)
                } else {
                    setOptions(newValue ? [newValue, ...options] : options);
                    setValue(newValue);
                    dispatch(
                        choiceAutocomplite({
                            ingredient_id: ingredient.ingredient_id,
                            name: newValue?.name.trim() || '',
                            new_ingredient: newValue?.new_ingredient || false, // maybe only need to change it to false
                            media: newValue?.media || '',
                            units: newValue?.units as string[] || [],
                            // check_open_link: newValue?.ingredient_id || ''
                        })
                    );
                    handleInputChange(newValue?.name.trim() || '')
                }
            }}
            onInputChange={(event, newInputValue) => {
                setInputValue(newInputValue)
            }}
            renderInput={(params) => 
                <TextField  
                    {...params}  
                    placeholder="Add an ingredient" 
                    fullWidth 
                    error={error ? true : false}
                    slotProps={{
                        htmlInput: {
                            ...params.inputProps,
                            maxLength:50
                        },
                        
                    }}
                />
            }//error={statusPage.open && !error ? true : false}
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
                            '@media (hover: hover) and (pointer: fine)': {
                                ':hover': { backgroundColor: '#1F2128' },
                            },
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
                                        '@media (hover: hover) and (pointer: fine)': {
                                            '&:hover': {
                                                backgroundColor: '#1F2128',
                                            },
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
    )
}, (prevProps, nextProps) => {
    return prevProps.ingredient.ingredient_id === nextProps.ingredient.ingredient_id &&
    prevProps.ingredient.name === nextProps.ingredient.name && 
    prevProps.error === nextProps.error
})



MainInput.displayName = "MainInput"