import { useAppDispatch, useAppSelector } from "@/state/hook";
import { Autocomplite } from "./Autocompletions";
import { shallowEqual } from "react-redux";
import { ChangeEvent, memo, useCallback, useMemo } from "react";
import { choiceUnits, ingredientAmount } from "@/state/slices/stepper/ingredients";
import { handleAmountChange } from "@/app/helpers/input-unit";
import { Unit } from "@/app/(main)/cook/types";
import { selectShowMinOneFilledWarning } from "@/state/selectors/stepper-autocomp-error";



interface Props {
    ingredientId: string;
}

export const ContainerAutocomplite = memo(({ ingredientId }: Props) => {
    const numbStep = 4

    const ingredient = useAppSelector((state) => {
        const found = state.ingredientsSlice.ingredients.find((ingr) => ingr.ingredient_id === ingredientId);
        if (!found) throw new Error(`Ingredient with id ${ingredientId} not found`);
        return found;
    }, shallowEqual);


    const showMinOneFilledWarning = useAppSelector((state) => 
        selectShowMinOneFilledWarning(state, numbStep)
    );

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

    


    const isDisabled = useMemo(() => {
        const units = ingredient.units as Unit | string[];

        if (Array.isArray(units)) {
            return units.length > 0;
        }

        const hasUnits = ingredient.name !== '' && units.amount !== 0;
        return !hasUnits && units.list.length === 0;
    }, [ingredient.units]);



    const changeUnits = useCallback((newValue: string) => {
        dispatch(choiceUnits({ ingredient_id: ingredient.ingredient_id, choice: newValue }));
    }, [dispatch, ingredient.ingredient_id]);
    


    //It should work with these. But it works without them too.
    //Dependency error ingredient.units. Rewrite the redux with more obvious data types
    // useEffect(() => {
    //     if (!Array.isArray(ingredient.units) && 'amount' in ingredient.units) {
    //         const isNameEmpty = ingredient.name === '';
    //         const isAmountEmpty = ingredient.units.amount === 0;
    //         const isChoiceEmpty = ingredient.units.choice === '';

    //         const emptyCount = [isNameEmpty, isAmountEmpty, isChoiceEmpty].filter(Boolean).length;

    //         if (emptyCount > 0 && emptyCount < 3) {
    //             dispatch(addErrorIngredient(ingredientId));
    //         } else {
    //             dispatch(deleteErrorIngredient(ingredientId));
    //         }
    //     }
    //     // eslint-disable-next-line react-hooks/exhaustive-deps
    // }, [ingredient.name, ingredientId, dispatch]);
    //Dependency error ingredient.units. Rewrite the redux with more obvious data types


    const controller = useMemo(
        () => ({
            ingredient,
            isDisabled,
            handlers: {
                handleAmountChange: changeAmount,
                handleUnitsChange:changeUnits,
            },
        }),
        [isDisabled, ingredient, changeAmount, changeUnits]
    );

    return (
        <Autocomplite
            showWarning={showMinOneFilledWarning}
            controller={controller}
            page="form"

        ></Autocomplite>
    )

}, (prevProps, nextProps) => {
    return prevProps.ingredientId === nextProps.ingredientId
})


ContainerAutocomplite.displayName = "ContainerAutocomplite"