import {
    autoCompliteItems, autocompliteMenuItem, autocompMenuBox,
    autocompMenuContainer, autocompMenuText, paperMenu
} from "@/app/(main)/new-recipe/style";
import { IngredientAutocomplite } from "@/app/(main)/new-recipe/types";
import { textMaxWidth } from "@/app/styles";
import { Autocomplete, Box, ListItem, TextField, Typography } from "@mui/material";
import { memo, Dispatch, SetStateAction } from "react";


interface Controller {
    options:IngredientAutocomplite[],
    value:IngredientAutocomplite | null,
    handlers: {
        handleChange: (newValue: string | IngredientAutocomplite | null) => void,
        setInputValue:Dispatch<SetStateAction<string>>
    },
}

interface Props {
    controller:Controller, 
    showWarning?:boolean
}



export const MainInput = memo(({ controller, showWarning }: Props) => {
    const {handlers, options, value} = controller
    const {handleChange, setInputValue} = handlers



    console.log('MainInput')

    return (
        <Autocomplete
            // id="ingredient"
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
            onChange={(event, newValue: IngredientAutocomplite | string | null) => handleChange(newValue)}
            onInputChange={(event, newInputValue) => {
                setInputValue(newInputValue)
            }}
            renderInput={(params) =>
                <TextField
                    {...params}
                    placeholder="Add an ingredient"
                    fullWidth
                    // sx={mainInputAutocomplite}
                    error={showWarning}
                    slotProps={{
                        htmlInput: {
                            ...params.inputProps,
                            maxLength: 50
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
},(prevProps, nextProps) => {
        return prevProps.showWarning === nextProps.showWarning &&
        prevProps.controller.value === nextProps.controller.value &&
        prevProps.controller.options.length === nextProps.controller.options.length
        // prevProps.page === nextProps.page
    }
)



MainInput.displayName = "MainInput"