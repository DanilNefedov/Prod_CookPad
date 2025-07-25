import { useAppDispatch, useAppSelector } from "@/state/hook"
import { Box, Button, Container, Divider, Tooltip, Typography } from "@mui/material"
import { Autocomplite } from "./autocomplite"
import InfoIcon from '@mui/icons-material/Info';
import { addIngredient, deleteIngredient } from "@/state/slices/stepper/ingredients"
import { useMemo } from "react"
import { IngredientAutocomplite } from "@/app/(main)/new-recipe/types"
import { addNewIngr, clearBtn, errorIngrText, ingrdientLine, ingredientBox, 
    ingredientContainer, ingredientStepContainer, tooltipText } from "@/app/(main)/new-recipe/style";
import { columnCenter, headerSteps } from "@/app/styles";


export function Ingredients() {
    const numbStep = 4

    const stepperState = useAppSelector(state => state.ingredientsSlice)
    const dispatch = useAppDispatch()
    const openPage = useAppSelector(state => state.statusSlice.steps[numbStep].open);


    const showMinOneFilledWarning = useMemo<boolean>(() => {
        if (!openPage) return false;
    
        const ingredients = stepperState.ingredients;
    
        const hasAtLeastOneFilled = ingredients.some(ingredient => {
            if (!('amount' in ingredient.units)) return false;
    
            const hasName = ingredient.name.trim() !== '';
            const hasAmount = ingredient.units.amount > 0;
            const hasChoice = ingredient.units.choice.trim() !== '';
    
            return hasName && hasAmount && hasChoice;
        });
    
        return !hasAtLeastOneFilled;
    }, [openPage, stepperState.ingredients]);
    

    
    return (
        <Container sx={ingredientStepContainer}>
            <Typography variant="h6" component="h2" sx={headerSteps}>
                Specify the ingredients    
            </Typography>
            <Tooltip title="Press enter for new ingredients"
            enterTouchDelay={0}
            sx={tooltipText}
            >
                <InfoIcon />
            </Tooltip>
            <Box sx={[ingredientBox, columnCenter]}>
                <Typography 
                    color="error"
                    sx={[errorIngrText, {display: showMinOneFilledWarning ? 'block' : 'none'}]}
                >Minimum 1 filled ingredient</Typography>

                {stepperState.ingredients.map((ingredient: IngredientAutocomplite) => (
                    <Box key={ingredient.ingredient_id} sx={ingredientContainer}>

                        <Autocomplite ingredientId={ingredient.ingredient_id} />

                        <Button 
                            color="grayButton"
                            sx={clearBtn}
                            onClick={() => dispatch(deleteIngredient({ ingredient_id: ingredient.ingredient_id as string }))}
                            disabled={stepperState.ingredients.length === 1 ? true : false}
                        >X</Button>
                        <Divider sx={ingrdientLine}/>
                    </Box>))
                }
                <Button 
                color='grayButton'
                sx={addNewIngr}
                onClick={(e) => {
                    e.preventDefault()
                    
                    dispatch(addIngredient())
                }}>Add ingredient</Button>

            </Box>
        </Container>

    )
}