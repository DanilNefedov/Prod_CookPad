import { TextField, Typography } from '@mui/material';
import { inputText } from '@/app/main-styles';
import { ChangeEvent } from "react";
import { useAppDispatch, useAppSelector } from '@/state/hook';
import { descriptionChange } from '@/state/slices/step-by-step';
import { theme } from '@/config/ThemeMUI/theme';



export function Description() {
    const stepperState = useAppSelector(state => state.setpForm)
    const infoPageState = stepperState.steps_info.find(el => el.step === stepperState.page_step)
    const dispatch = useAppDispatch()

    function handleDescription(e: ChangeEvent<HTMLInputElement>) {
        if (infoPageState?.step) {
            dispatch(descriptionChange({ step: infoPageState?.step, description: e.target.value }))

        }
    }

    return (
        <>
            <Typography variant="h6" component="h2" sx={{ textAlign: "center", mt: '25px', [theme.breakpoints.down('md')]: { fontSize: '18px', mt: '10px', } }}>Your description</Typography>
            <TextField
                id="outlined-multiline-flexible"
                label="Description"
                value={infoPageState?.description}
                multiline
                name="description"
                maxRows={8}
                minRows={4}
                error={infoPageState?.open && !infoPageState?.error_status ? true : false}
                helperText='max lenght 150 symbols'
                onChange={handleDescription}
                sx={{
                    ...inputText, '& .MuiOutlinedInput-root': {
                        mb: '0px', '& fieldset': {
                            borderColor: '#353842',

                        }
                    },
                    '& .MuiInputBase-root': {
                        [theme.breakpoints.down('md')]: {
                            p: '5px'
                        }
                    }

                }}
            />
        </>
    )
}