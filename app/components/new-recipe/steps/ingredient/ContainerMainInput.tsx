import { CallbackIngrAutocomplite, IngredientAutocomplite } from "@/app/(main)/new-recipe/types"
import { fetchLocationSuggestions } from "@/app/services/autocomplite"
import { useAppDispatch, useAppSelector } from "@/state/hook"
import { choiceAutocomplite } from "@/state/slices/stepper/ingredients"
import { debounce } from "@mui/material"
import { memo, useCallback, useEffect, useMemo, useState } from "react"
import { MainInput } from "./MainInput"
import { selectShowMinOneFilledWarning } from "@/state/selectors/stepper-autocomp-error"





interface Props {
    ingredient: IngredientAutocomplite,
    // handleInputChange: (newInputValue: string) => void,
    // page: 'form' | 'list' | 'recipe'
}


export const ContainerMainInput = memo(({ ingredient }: Props) => {//handleInputChange
    const numbStep = 4
    const [options, setOptions] = useState<IngredientAutocomplite[]>([]);
    const [value, setValue] = useState<IngredientAutocomplite | null>(ingredient);
    const [inputValue, setInputValue] = useState<string>('');
    // const showMinOneFilledWarning = false //useShowMinOneFilledWarning(numbStep);

    const dispatch = useAppDispatch();

    const showMinOneFilledWarning = useAppSelector((state) => 
        selectShowMinOneFilledWarning(state, numbStep)
    );


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


    const handleChange = useCallback((newValue: IngredientAutocomplite | string | null) => {
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
        

            

            // handleInputChange(newIngredient.name)
            // dispatch(updateError({ step: numbStep, error: false }));
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
            
            
            // handleInputChange(newValue?.name.trim() || '')
            // dispatch(updateError({ step: numbStep, error: false }));
        }
    },
        [dispatch, ingredient.ingredient_id, options]
    );

    console.log('container main input')

    const controller = useMemo(
        () => ({
            options,
            value,
            handlers: {
                handleChange,
                setInputValue
            },
        }),
        [options.length, value?.name]
    );


    return (

        <MainInput 
            controller={controller}
            showWarning={showMinOneFilledWarning}
        ></MainInput>
    )

},(prevProps, nextProps) => {
    return prevProps.ingredient.ingredient_id === nextProps.ingredient.ingredient_id &&
    prevProps.ingredient.name === nextProps.ingredient.name
    // prevProps.page === nextProps.page
})



ContainerMainInput.displayName = "ContainerMainInput"