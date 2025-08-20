import { useAppDispatch, useAppSelector } from "@/state/hook";
import { Autocomplete, Box, ListItem, TextField, Typography} from "@mui/material";
import { ChangeEvent, memo, useCallback, useEffect, useRef, } from "react";
import { MainInput } from "./MainInput";
import { choiceUnits, ingredientAmount } from "@/state/slices/stepper/ingredients";
import { shallowEqual } from "react-redux";
import { addErrorIngredient, deleteErrorIngredient } from "@/state/slices/stepper/error-open";
import { handleAmountChange } from "@/app/helpers/input-unit";
import { amoutIngredient, autocompliteImg, autoCompliteItems, autocompliteMenuItem, 
    autocompMenuBox, autocompMenuContainer, autocompMenuText, boxAutocompliteImg, 
    paperMenu, weightItemList } from "@/app/(main)/new-recipe/style";
import { textMaxWidth } from "@/app/styles";
import { useShowMinOneFilledWarning } from "@/app/hooks/useShowMinOneFilledWarning";


interface Props {
    ingredientId: string;
}

export const Autocomplite = memo(({ingredientId}: Props) => {
    const numbStep = 4
    
    const ingredient = useAppSelector((state) => {
        const found = state.ingredientsSlice.ingredients.find((ingr) => ingr.ingredient_id === ingredientId);
        if (!found) throw new Error(`Ingredient with id ${ingredientId} not found`);
        return found;
    }, shallowEqual);

    const showMinOneFilledWarning = useShowMinOneFilledWarning(numbStep);
    const dispatch = useAppDispatch();
    const inputValue = useRef<string>('');
    
    const handleInputChange = useCallback((newInputValue: string) => {
        inputValue.current = newInputValue;
    }, []);

    

      
    function changeAmount(e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
        const newValue = e.target.value;

        const resValue = handleAmountChange(newValue)
        dispatch(
            ingredientAmount({
                ingredient_id: ingredient.ingredient_id,
                amount: parseFloat(resValue),
            })
        );
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
    
    
    //Dependency error ingredient.units. Rewrite the redux with more obvious data types
    useEffect(() => {
        if (!Array.isArray(ingredient.units) && 'amount' in ingredient.units) {
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
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [ingredient.name, ingredientId, dispatch]);
    //Dependency error ingredient.units. Rewrite the redux with more obvious data types


    return (
        <>
            <Box sx={boxAutocompliteImg}>
                <Box sx={autocompliteImg} component="img"
                    src={ingredient.media !== '' ? ingredient.media : 'images/load-ingr.svg'} alt={ingredient.name}
                    loading="lazy">
                </Box>
            </Box>

            <MainInput 
                ingredient={ingredient}
                handleInputChange={handleInputChange}
            ></MainInput>

            
            <TextField
                disabled={isDisabled()}
                error={showMinOneFilledWarning ? true : false}
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
                onChange={(e) => changeAmount(e)}
                sx={amoutIngredient}
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
                            error={showMinOneFilledWarning ? true : false}
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
}, (prevProps, nextProps) => {
    return prevProps.ingredientId === nextProps.ingredientId 
})


Autocomplite.displayName = "Autocomplite"