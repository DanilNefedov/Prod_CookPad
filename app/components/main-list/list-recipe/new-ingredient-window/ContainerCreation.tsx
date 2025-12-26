import { containerIngrItem } from "@/app/(main)/(main-list)/list/styles";
import { Unit } from "@/app/(main)/cook/types";
import { clearBtn } from "@/app/(main)/new-recipe/style";
import { Autocomplite } from "@/app/components/new-recipe/steps/ingredient/Autocompletions";
import { handleAmountChange } from "@/app/helpers/input-unit";
import { useAppDispatch, useAppSelector } from "@/state/hook";
import { amountNewIngredient, choiceUnit, removeIngredient } from "@/state/slices/list-recipe-form";
import { Box, Button } from "@mui/material";
import { ChangeEvent, useCallback, useMemo } from "react";
import { shallowEqual } from "react-redux";



interface Props {
    ingredient_id:string,
    length:number,
    recipeId:string
}


export function ContainerCreation({ingredient_id, length, recipeId}:Props) {
    const ingredient = useAppSelector((state) => {
        const found = state.formListRecipe[recipeId].find((ingr) => ingr.ingredient_id === ingredient_id);
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
                recipeId
            })
        );
    }, [dispatch, ingredient.ingredient_id]);


    const handleUnits = useCallback((newValue: string) => {
        dispatch(choiceUnit({ ingredient_id: ingredient.ingredient_id, choice: newValue, recipeId }));
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
            isDisabled,
            handlers: {
                handleAmountChange: handleAmount,
                handleUnitsChange: handleUnits,
            },
        }),
        [isDisabled, , ingredient, handleAmount, handleUnits]
    );


    return (
        <Box sx={[containerIngrItem, {
            borderWidth: length > 1 ? '0 0 1px 0' : '0'
        }]}>
            <Autocomplite
                controller={controller}
                page={'recipe'}
                recipeId={recipeId}
            ></Autocomplite>

            <Button
                color="blackRedBtn"
                sx={clearBtn}
                onClick={() => dispatch(removeIngredient({ ingredient_id: ingredient.ingredient_id, recipeId}))}
                disabled={length === 1 ? true : false}
            >X</Button>
        </Box>

    )
}