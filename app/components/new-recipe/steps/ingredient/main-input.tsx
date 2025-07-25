import { autoCompliteItems, autocompliteMenuItem, autocompMenuBox, 
    autocompMenuContainer, autocompMenuText, paperMenu } from "@/app/(main)/new-recipe/style";
import { CallbackIngrAutocomplite, IngredientAutocomplite } from "@/app/(main)/new-recipe/types";
import { fetchLocationSuggestions } from "@/app/services/autocomplite";
import { textMaxWidth } from "@/app/styles";
import { useAppDispatch } from "@/state/hook";
import { choiceAutocomplite } from "@/state/slices/stepper/ingredients";
import { Autocomplete, Box, debounce, ListItem, TextField, Typography } from "@mui/material";
import { memo, useEffect, useMemo, useState } from "react";


interface Props {
    ingredient: IngredientAutocomplite, 
    handleInputChange: (newInputValue: string) => void, 
    error:boolean
}


export const MainInput = memo(({ ingredient, handleInputChange, error }: Props) => {

    const [options, setOptions] = useState<IngredientAutocomplite[]>([]);
    const [value, setValue] = useState<IngredientAutocomplite | null>(ingredient);
    const [inputValue, setInputValue] = useState<string>('');

    const dispatch = useAppDispatch();



    const fetch = useMemo(
        () =>
            debounce(
                async (request: { input: string }, callback: (results: CallbackIngrAutocomplite[]) => void) => {
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
            }
        });

        return () => {
            active = false;
        };
    }, [value, inputValue, fetch, dispatch, ingredient.ingredient_id]);



    return (
        <Autocomplete
            id="ingredient"
            sx={autoCompliteItems}
            getOptionLabel={(option) => (typeof option === 'string' ? option : option.name)}
            filterOptions={(x) => x}
            options={options}
            autoComplete
            includeInputInList
            filterSelectedOptions
            slotProps={{
                paper: {
                    sx: paperMenu
                },
            }}
            freeSolo
            value={value}
            noOptionsText="No ingredients"
            onChange={(event, newValue: IngredientAutocomplite | string | null) => {
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
                    sx={autocompliteMenuItem}
                    {...props}
                    key={props.id}
                >
                    <Box sx={autocompMenuBox}>
                        <Box sx={autocompMenuContainer}>
                            <Typography
                                variant="body2"
                                sx={[textMaxWidth, autocompMenuText]}
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