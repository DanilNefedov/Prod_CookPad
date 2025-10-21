import { Unit } from "@/app/(main)/cook/types";
import { clearBtn } from "@/app/(main)/new-recipe/style";
import { Autocomplite } from "@/app/components/new-recipe/steps/ingredient/Autocompletions";
import { handleAmountChange } from "@/app/helpers/input-unit";
import { useAppDispatch, useAppSelector } from "@/state/hook"
import { amountNewIngredient, choiceUnit, removeIngredient } from "@/state/slices/list-form";
import { Box, Button } from "@mui/material";
import { ChangeEvent, memo, useCallback, useMemo } from "react";
import { shallowEqual } from "react-redux";




interface Props {
    ingredient_id:string,
    length:number
}


export const ContainerIngredient = memo(({ingredient_id, length}:Props) => {
    const ingredient = useAppSelector((state) => {
        const found = state.newListIngredient.ingredients.find((ingr) => ingr.ingredient_id === ingredient_id);
        if (!found) throw new Error(`Ingredient with id ${ingredient_id} not found`);
        return found;
    }, shallowEqual);
    const dispatch = useAppDispatch();



    const handleAmount = useCallback((e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const newValue = e.target.value;

        const resValue = handleAmountChange(newValue)

        dispatch(
            amountNewIngredient({
                ingredient_id: ingredient.ingredient_id,
                amount: parseFloat(resValue),
            })
        );
    }, [dispatch, ingredient.ingredient_id]);


    const handleUnits = useCallback((newValue: string) => {
        dispatch(choiceUnit({ ingredient_id: ingredient.ingredient_id, choice: newValue }));
    }, [dispatch, ingredient.ingredient_id]);


    const isDisabled = useMemo(() => {
        const units = ingredient.units as Unit | string[];

        if (Array.isArray(units)) {
            return units.length > 0;
        }

        const hasUnits = ingredient.name !== '' && units.amount !== 0;
        return !hasUnits && units.list.length === 0;
    }, [ingredient.units]);


    const controller = useMemo(
        () => ({
            ingredient,
            // showWarning:showMinOneFilledWarning,
            isDisabled,
            handlers: {
                // handleInputChange,
                handleAmountChange: handleAmount,
                handleUnitsChange:handleUnits,
            },
        }),
        [isDisabled, , ingredient, handleAmount, handleUnits]
    );


    return(
        <Box sx={{
            width:'100%',
            display:'flex',
            alignItems:'center'
        }}>
            <Autocomplite
                ingredientId={ingredient_id}
                controller={controller}
                page={'list'}

            ></Autocomplite>

            <Button 
                color="blackRedBtn"
                sx={clearBtn}
                onClick={() => dispatch(removeIngredient({ ingredient_id: ingredient.ingredient_id as string }))}
                disabled={length === 1 ? true : false}
            >X</Button>
        </Box>
        
    )
})