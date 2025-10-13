import { IngredientAutocomplite } from "@/app/(main)/new-recipe/types";
import { useAppDispatch, useAppSelector } from "@/state/hook"
import { useCallback } from "react";
import { shallowEqual } from "react-redux";




interface Props {
    ingredient:IngredientAutocomplite
}



export function ContainerIngredient({ingredient}:Props){
    const dispatch = useAppDispatch();



    const changeAmount = useCallback((e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const newValue = e.target.value;

        const resValue = handleAmountChange(newValue)

        dispatch(
            ingredientAmount({
                ingredient_id: ingredient.ingredient_id,
                amount: parseFloat(resValue),
            })
        );
    }, [dispatch, ingredient.ingredient_id]);




    return(
        <></>
    )
}