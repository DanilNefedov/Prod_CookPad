import { Autocomplete, Box, ListItem, TextField, Typography} from "@mui/material";
import { ChangeEvent, memo} from "react";
import { MainInput } from "./MainInput";
import { amoutIngredient, autocompliteImg, autoCompliteItems, autocompliteMenuItem, 
    autocompMenuBox, autocompMenuContainer, autocompMenuText, boxAutocompliteImg, 
    boxImgCloudinary, 
    paperMenu, weightItemList } from "@/app/(main)/new-recipe/style";
import { textMaxWidth } from "@/app/styles";
import { CldImage } from "next-cloudinary";
import { IngredientAutocomplite } from "@/app/(main)/new-recipe/types";
import { ContainerMainInput } from "./ContainerMainInput";
import { ContainerListMainInput } from "@/app/components/main-list/list/new-ingr-window/ContainerListMainInput";



interface Controller {
    ingredient: IngredientAutocomplite
    // showWarning: boolean;
    isDisabled: boolean;
    handlers: {
        // handleInputChange: (newInputValue: string) => void;
        handleAmountChange: (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
        handleUnitsChange: (newValue: string) => void;
    };
}


interface Props {
    ingredientId: string,
    controller:Controller,
    showWarning?:boolean,
    page:'list' | 'form'
}

export const Autocomplite = memo(({ingredientId, controller, showWarning, page}: Props) => {
    const { ingredient, isDisabled, handlers } = controller//showWarning ingredient
    const { handleAmountChange, handleUnitsChange } = handlers //handleAmountChange, handleUnitsChange

    console.log('autocomp')
    return (
        <>
            <Box sx={boxAutocompliteImg}>
                {
                    ingredient.media !== '' ?
                    <Box sx={boxImgCloudinary}>
                        <CldImage
                            alt={ingredient.name}
                            // format="auto"
                            sizes="100%"
                            quality="auto"
                            src={ingredient.media}
                            fill
                        >
                        </CldImage>
                    </Box>
                    :
                    <Box 
                        sx={autocompliteImg} 
                        component="img"
                        src={ingredient.media !== '' ? ingredient.media : 'images/load-ingr.svg'} 
                        alt={ingredient.name}
                        loading="lazy">
                    </Box>
                }
               
            </Box>

            {
                page === 'list' ? 
                <ContainerListMainInput
                    ingredient={ingredient}
                ></ContainerListMainInput>
                :
                page === 'form' ?
                 <ContainerMainInput 
                    ingredient={ingredient}
                    // handleInputChange={handleInputChange}
                ></ContainerMainInput>
                :
                null
            }
            

            
            <TextField
                disabled={isDisabled}
                error={showWarning ? true : false}
                id="outlined-basic"
                placeholder="Amount"
                variant="outlined"
                type="number"
                onKeyDown={(e) => {
                    if (['-', '+', 'e'].includes(e.key)) {
                        e.preventDefault();
                    }
                }}
                value={('list' in ingredient.units && ingredient.units.amount !== 0) && ingredient.units.amount}//
                onChange={(e) => handleAmountChange(e)}
                sx={amoutIngredient}
            />
            <Autocomplete
                disabled={isDisabled}
                freeSolo
                options={'list' in ingredient.units && ingredient.units.list || []}
                value={'list' in ingredient.units && ingredient.units.choice || ''}
                onInputChange={(event, newValue) => {
                    handleUnitsChange(newValue.trim())
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
                            error={showWarning ? true : false}
                        />

                )}
                slotProps={{
                    paper: {
                        sx: paperMenu
                    },
                }}
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
                                    {typeof option === 'string' ? option : option}
                                </Typography>
                            </Box>
                        </Box>
                    </ListItem>
    
                )}
                sx={[autoCompliteItems, weightItemList]}
            />


        </>
    );
}, 
(prevProps, nextProps) => {
    const prevUnits = prevProps.controller.ingredient.units;
    const nextUnits = nextProps.controller.ingredient.units;

    const prevAmount = Array.isArray(prevUnits) ? null : prevUnits.amount;
    const nextAmount = Array.isArray(nextUnits) ? null : nextUnits.amount;

    return prevProps.ingredientId === nextProps.ingredientId &&
    prevProps.controller.ingredient.ingredient_id === nextProps.controller.ingredient.ingredient_id &&
    prevProps.controller.ingredient.name === nextProps.controller.ingredient.name &&
    prevAmount === nextAmount &&
    prevProps.showWarning === nextProps.showWarning
    // prevProps.controller.ingredient.new_ingredient === nextProps.controller.ingredient.new_ingredient
}
)


Autocomplite.displayName = "Autocomplite"