'use client'

import Box from '@mui/material/Box';
import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';
import Typography from '@mui/material/Typography';
import { useAppSelector } from '@/state/hook';

const nameErrors = [
    'Choose a recipe type', 
    'Create an ad group', 
    'Create an ad'
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
                    console.log(elem)
                    const labelProps: {
                        optional?: React.ReactNode;
                        error?: boolean;
                    } = {};
                    if (isStepFailed(elem.step)) {
                        labelProps.optional = (
                            <Typography variant="caption" color="error">
                                Alert message
                            </Typography>
                        );
                        labelProps.error = true;
                    }

                    return (
                        <Step key={elem.step}>
                            <StepLabel {...labelProps}>{elem.step}</StepLabel>
                        </Step>
                    );
                })}
            </Stepper>
        </Box>
    );
}