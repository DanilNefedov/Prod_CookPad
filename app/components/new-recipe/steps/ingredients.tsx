import { btnMain } from "@/app/main-styles"
import { IngredientForState } from "@/app/types/types"
import { useAppDispatch, useAppSelector } from "@/state/hook"
import { addIngredient, deleteIngredient } from "@/state/slices/step-by-step"
import { Box, Button, Container, Tooltip, Typography } from "@mui/material"
import { Autocomplite } from "./autocomplite"
import InfoIcon from '@mui/icons-material/Info';


export function Ingredients() {
    const stepperState = useAppSelector(state => state.setpForm)
    const infoPageState = stepperState.steps_info.find(el => el.step === stepperState.page_step)
    const dispatch = useAppDispatch()




    return (
        <Container sx={{
            p: '20px 10px', '&.MuiContainer-root': {
                paddingLeft: '10px',
                paddingRight: '10px',
            }
        }}>
            <Typography variant="h6" component="h2" sx={{ textAlign: "center", mb: '10px' }}>
                Specify the ingredients    
            </Typography>
            <Tooltip title="Press enter for new ingredients"
            enterTouchDelay={0}
            >
                <InfoIcon />
            </Tooltip>
            <Box sx={{ display: 'flex', alignItems: 'center', flexDirection: 'column', backgroundColor: 'background.paper', p: '20px', borderRadius: '10px' }}>

                {infoPageState?.ingredients?.map((ingredient: IngredientForState) => (
                    <Box key={ingredient.ingredient_id} sx={{ display: 'flex', alignItems: 'center', borderColor: 'background.default', width: '100%', mb: '10px' }}>

                        <Autocomplite props={{ ingredient, open: infoPageState?.open, error: infoPageState?.error_status }}></Autocomplite>

                        <Button sx={{ ...btnMain, mb: '0', minWidth: '40px', backgroundColor: 'background.default', padding: '7px 18px', fontWeight: '600', fontSize: '12px' }} onClick={() => dispatch(deleteIngredient({ ingredient_id: ingredient.ingredient_id as string }))}>X</Button>

                    </Box>))}

                <Button sx={{ ...btnMain, m: '20px auto 0 ', display: 'block', width: '140px', backgroundColor: 'background.default' }} onClick={(e) => {
                    e.preventDefault()
                    
                    dispatch(addIngredient())
                }}>Add ingredient</Button>

            </Box>
        </Container>

    )
}