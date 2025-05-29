import { btnMain } from "@/app/main-styles"
import { IngredientForAutocomplite } from "@/app/types/types"
import { useAppDispatch, useAppSelector } from "@/state/hook"
import { Box, Button, Container, Divider, Tooltip, Typography } from "@mui/material"
import { Autocomplite } from "./autocomplite"
import InfoIcon from '@mui/icons-material/Info';
import { theme } from "@/config/ThemeMUI/theme"
import { addIngredient, deleteIngredient } from "@/state/slices/stepper/ingredients"
import { useMemo } from "react"


export function Ingredients() {
    const numbStep = 4

    const stepperState = useAppSelector(state => state.ingredientsSlice)
    const dispatch = useAppDispatch()
    const openPage = useAppSelector(state => state.statusSlice.steps[numbStep].open);


    const showMinOneFilledWarning = useMemo(() => {
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
        <Container sx={{
            p: '20px 10px', '&.MuiContainer-root': {
                paddingLeft: '10px',
                paddingRight: '10px',
            },
            [theme.breakpoints.down('md')]: {
                p:'5px'
            }
        }}>
            <Typography variant="h6" component="h2" sx={{ textAlign: "center", mb: '10px', [theme.breakpoints.down('md')]: { fontSize: '18px', mt: '10px', mb:'20px' } }}>
                Specify the ingredients    
            </Typography>
            <Tooltip title="Press enter for new ingredients"
            enterTouchDelay={0}
            sx={{[theme.breakpoints.down(500)]: {
                width:'17px',
                height:'17px'
            }}}
            >
                <InfoIcon />
            </Tooltip>
            <Box sx={{ display: 'flex', alignItems: 'center', flexDirection: 'column', backgroundColor: 'background.paper', p: '20px', borderRadius: '10px',
                [theme.breakpoints.down('md')]: {
                    p:'7px'
                },
                position:"relative",
             }}>
                <Typography 
                    color="primary"
                    sx={{
                        display: showMinOneFilledWarning ? 'block' : 'none',
                        position:"absolute",
                        top:'-26px',
                        right:'calc(50% - 84px)',
                        fontSize:"14px"
                    }}
                >Minimum 1 filled ingredient</Typography>

                {stepperState.ingredients.map((ingredient: IngredientForAutocomplite) => (
                    <Box key={ingredient.ingredient_id} sx={{ 
                        
                        display: 'flex', alignItems: 'center', borderColor: 'background.default', width: '100%', mb: '10px',
                        [theme.breakpoints.down('md')]: {
                            mb:'5px'
                        },
                        [theme.breakpoints.down(500)]: {
                            flexWrap:'wrap',
                            // mb:'px'
                        }
                     }}>

                        <Autocomplite ingredientId={ingredient.ingredient_id} />

                        <Button sx={{ ...btnMain, mb: '0', minWidth: '40px', backgroundColor: 'background.default', padding: '7px 18px', fontWeight: '600', fontSize: '12px',[theme.breakpoints.down('md')]: {
                            width:'30px',
                            height:'30px',
                            p:'5px'
                        } }} 
                            onClick={() => dispatch(deleteIngredient({ ingredient_id: ingredient.ingredient_id as string }))}
                            disabled={stepperState.ingredients.length === 1 ? true : false}
                        >X</Button>
                        <Divider sx={{height:'1px', bgcolor:"text.disabled", width:'100%', display:'none', [theme.breakpoints.down(500)]: {display:'block'}}}/>
                    </Box>))
                }

                <Button sx={{ ...btnMain, m: '20px auto 0 ', display: 'block', width: '140px', backgroundColor: 'background.default',[theme.breakpoints.down('md')]: {
                            fontSize:'12px',
                            mt:'10px'
                        } }} onClick={(e) => {
                    e.preventDefault()
                    
                    dispatch(addIngredient())
                }}>Add ingredient</Button>

            </Box>
        </Container>

    )
}