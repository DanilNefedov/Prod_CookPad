import { TextField, Typography } from '@mui/material';
import { inputText } from '@/app/main-styles';
import { ChangeEvent } from 'react';
import { useAppDispatch, useAppSelector } from '@/state/hook';
import { instructionChange } from '@/state/slices/step-by-step';


export function Instruction() {
    const stepperState = useAppSelector(state => state.setpForm)
    const infoPageState = stepperState.steps_info.find(el => el.step === stepperState.page_step)
    const dispatch = useAppDispatch()

    function handleInstruction (e:ChangeEvent<HTMLInputElement>){
        if(infoPageState?.step){
            dispatch(instructionChange({step:infoPageState?.step, instruction: e.target.value }))
        }
    }
    return (
        <>
        <Typography variant="h6" component="h2" sx={{ textAlign: "center", mt: '25px' }}>Your instruction</Typography>
            <TextField
            id="outlined-multiline-flexible"
            label="Instruction"
            value={infoPageState?.instruction}
            multiline
            name="instruction"
            maxRows={8}
            minRows={4}
            error={infoPageState?.open && !infoPageState?.error_status ? true : false}
            onChange={handleInstruction}
            sx={{...inputText, '& .MuiOutlinedInput-root':{mb:'20px', '& fieldset': {
                borderColor: '#353842',
            }},}}
            />
        </>
    )
}