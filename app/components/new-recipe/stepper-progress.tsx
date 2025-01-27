'use client'

import Box from '@mui/material/Box';
import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';
import Typography from '@mui/material/Typography';
import { useAppSelector } from '@/state/hook';

const namesErrors = [
    'Choose a recipe type', 
    'Put a name and time', 
    'Insert media',
    'Insert ingredients',
    'Write a description',
    'Write the instructions',
];

export function StepperProgress() {
    const stepperState = useAppSelector(state => state.setpForm)
    // console.log(stepperState)


    const isStepFailed = (step: number) => {
        const stepInfo = stepperState.steps_info.find((el) => el.step === step);
        return stepInfo?.open === true && stepInfo?.error_status === false;
    };

    return (
        <Box sx={{ width: '100%', mt: '10px' }}>
            <Stepper activeStep={stepperState.page_step - 1}
                sx={{
                    '& .MuiStepConnector-root.Mui-active .MuiStepConnector-line': {
                        borderColor: '#FF7269',
                    },
                    '& .MuiStepConnector-root.Mui-completed .MuiStepConnector-line': {
                        borderColor: '#FF7269', 
                    },
                }}
            >
                {stepperState.steps_info.map((elem) => {
                    const labelProps: {
                        optional?: React.ReactNode;
                        error?: boolean;
                    } = {};
                    if (isStepFailed(elem.step)) {
                        labelProps.optional = (
                            <Typography variant="caption" color="error">
                                {namesErrors[elem.step - 1]}
                            </Typography>
                        );
                        labelProps.error = true;
                    }

                    return (
                        <Step key={elem.step}>
                            <StepLabel {...labelProps}></StepLabel>
                        </Step>
                    );
                })}
            </Stepper>
        </Box>
    );
}