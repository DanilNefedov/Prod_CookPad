import { TextField, Typography } from '@mui/material';
import { inputText } from '@/app/main-styles';
import { ChangeEvent, useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '@/state/hook';
import { theme } from '@/config/ThemeMUI/theme';
import { setInstruction } from '@/state/slices/stepper/instruction';
import { updateError } from '@/state/slices/stepper/error-open';


export function Instruction() {
    const numbStep = 6

    const instruction = useAppSelector((state) => state.instructionSlice.instruction);    
    const stepStatus  = useAppSelector(state =>state.statusSlice.steps[numbStep]);
    const dispatch = useAppDispatch()

    useEffect(() =>{
        
        if(stepStatus.open && instruction.trim().length === 0){
            dispatch(updateError({step:numbStep, error:true}))
        }
    },[stepStatus.open, instruction.length, dispatch])


    function handleInstruction(e: ChangeEvent<HTMLInputElement>) {
        const newValue = e.target.value;

        if (newValue.length <= 300) {
            dispatch(setInstruction(e.target.value))
            dispatch(updateError({ step: numbStep, error: false }));

        }   
    }

    return (
        <>
            <Typography variant="h6" component="h2" sx={{ textAlign: "center", mt: '25px' }}>Your instruction</Typography>
            <TextField
                id="outlined-multiline-flexible"
                label="Instruction"
                value={instruction}
                multiline
                name="instruction"
                maxRows={8}
                minRows={4}
                error={stepStatus.open && stepStatus.error_status.value ? true : false}
                helperText='max lenght 300 symbols'
                onChange={handleInstruction}
                sx={{
                    ...inputText, '& .MuiOutlinedInput-root': {
                        mb: '0px', '& fieldset': {
                            borderColor: '#353842',
                        },
                        '&.Mui-focused fieldset': {
                            borderColor: '#ffffff',
                        },
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