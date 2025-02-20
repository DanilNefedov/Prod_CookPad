import { btnMain } from "@/app/main-styles"
import { IngredientForAutocomplite } from "@/app/types/types"
import { useAppDispatch, useAppSelector } from "@/state/hook"
import { addIngredient, deleteIngredient } from "@/state/slices/step-by-step"
import { Box, Button, Container, Divider, Tooltip, Typography } from "@mui/material"
import { Autocomplite } from "./autocomplite"
import InfoIcon from '@mui/icons-material/Info';
import { theme } from "@/config/ThemeMUI/theme"


export function Ingredients() {
    const stepperState = useAppSelector(state => state.setpForm)
    const infoPageState = stepperState.steps_info.find(el => el.step === stepperState.page_step)
    const dispatch = useAppDispatch()


    console.log(infoPageState?.ingredients)

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
            <Typography variant="h6" component="h2" sx={{ textAlign: "center", mb: '10px', [theme.breakpoints.down('md')]: { fontSize: '18px', mt: '10px', mb:'0' } }}>
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
                }
             }}>

                {infoPageState?.ingredients?.map((ingredient: IngredientForAutocomplite) => (
                    <Box key={ingredient.ingredient_id} sx={{ display: 'flex', alignItems: 'center', borderColor: 'background.default', width: '100%', mb: '10px',
                        [theme.breakpoints.down('md')]: {
                            mb:'5px'
                        },
                        [theme.breakpoints.down(500)]: {
                            flexWrap:'wrap',
                            // mb:'px'
                        }
                     }}>

                        <Autocomplite props={{ ingredient, open: infoPageState?.open, error: infoPageState?.error_status }}></Autocomplite>

                        <Button sx={{ ...btnMain, mb: '0', minWidth: '40px', backgroundColor: 'background.default', padding: '7px 18px', fontWeight: '600', fontSize: '12px',[theme.breakpoints.down('md')]: {
                            width:'30px',
                            height:'30px',
                            p:'5px'
                        } }} onClick={() => dispatch(deleteIngredient({ ingredient_id: ingredient.ingredient_id as string }))}>X</Button>
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