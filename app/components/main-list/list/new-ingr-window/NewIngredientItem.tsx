import { amoutIngredient, autoCompliteItems, autocompliteMenuItem, autocompMenuBox, autocompMenuContainer, autocompMenuText, paperMenu, weightItemList } from "@/app/(main)/new-recipe/style";
import { MainInput } from "@/app/components/new-recipe/steps/ingredient/MainInput";
import { handleAmountChange } from "@/app/helpers/input-unit";
import { useShowMinOneFilledWarning } from "@/app/hooks/useShowMinOneFilledWarning";
import { textMaxWidth } from "@/app/styles";
import { useAppDispatch, useAppSelector } from "@/state/hook";
import { amountNewIngredient, choiceAutoIngredient, choiceUnit } from "@/state/slices/list-form";
import { Autocomplete, Box, Button, ListItem, TextField, Typography } from "@mui/material";
import { CldImage } from "next-cloudinary";
import { ChangeEvent, useCallback, useRef } from "react";
import { ContainerIngredient } from "./ContainerIngredient";
import { shallowEqual } from "react-redux";









export function NewIngredientItem({ingredient_id}:{ingredient_id:string}){
    const ingredient = useAppSelector((state) => {
        const found = state.newListIngredient.ingredients.find((ingr) => ingr.ingredient_id === ingredient_id);
        if (!found) throw new Error(`Ingredient with id ${ingredient_id} not found`);
        return found;
    }, shallowEqual);
    // const inputValue = useRef<string>('');
    // const showMinOneFilledWarning = useShowMinOneFilledWarning(4);
    // const dispatch = useAppDispatch();



    // const handleInputChange = useCallback((newInputValue: string) => {
    //     inputValue.current = newInputValue;
    // }, []);
    

    // function isDisabled() {
    //     if (Array.isArray(ingredient?.units)) {
    //         return ingredient.units.length > 0;
    //     }

    //     const hasUnits = inputValue.current !== '' && ingredient?.units.amount !== 0;
    //     return !hasUnits && ingredient?.units.list.length === 0;
    // }

    // function changeAmount(e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    //     if(!ingredient) return

    //     const newValue = e.target.value;
    //     const resValue = handleAmountChange(newValue)
        
    //     dispatch(
    //         amountNewIngredient({
    //             ingredient_id: ingredient.ingredient_id,
    //             amount: parseFloat(resValue),
    //         })
    //     );
    // }

    // function cahngeUnits(newValue: string) {
    //     if(!ingredient) return
    //     dispatch(choiceUnit({ ingredient_id: ingredient.ingredient_id, choice: newValue }));
    

    // console.log(ingredient, inputValue)

    return(
        <Box sx={{
            width:'100%',
            display:'flex'
        }}>
            <Box sx={{
                width: '100%', 
                height: '100%',
                position:'relative'
            }}>
                {
                    ingredient && ingredient?.media !== '' ?
                    <CldImage
                        alt={ingredient.name}
                        // format="auto"
                        sizes="100%"
                        quality="auto"
                        src={ingredient.media}
                        fill
                    >
                    </CldImage>
                    :
                    <Box 
                        // sx={autocompliteImg} 
                        component="img"
                        src={'images/load-ingr.svg'} 
                        alt={'Ingredient'}
                        loading="lazy">
                    </Box>
                }
            </Box>

            {/* {ingredient &&
                <MainInput 
                    ingredient={ingredient}
                    handleInputChange={handleInputChange}
                    page='list'
                ></MainInput>
            } */}


            <ContainerIngredient
                ingredient={ingredient}
            ></ContainerIngredient>

            {/* <TextField
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
                value={(ingredient && 'list' in ingredient.units && ingredient.units.amount !== 0) && ingredient.units.amount}//
                onChange={(e) => changeAmount(e)}
                sx={amoutIngredient}
            />

            <Autocomplete
                disabled={isDisabled()}
                freeSolo
                options={ingredient && 'list' in ingredient.units && ingredient.units.list || []}
                value={ingredient && 'list' in ingredient.units && ingredient.units.choice || ''}
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
            /> */}
            

        </Box>
            
    )
}