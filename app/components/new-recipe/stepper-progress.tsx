'use client'

import Box from '@mui/material/Box';
import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';
import Typography from '@mui/material/Typography';
import { useAppDispatch, useAppSelector } from '@/state/hook';
import { theme } from '@/config/ThemeMUI/theme';
import { memo, useCallback, useEffect } from 'react';
import { setSomeError } from '@/state/slices/stepper/error-open';


export const StepperProgress = memo(() => {
    const dispatch = useAppDispatch();
    const stepperState = useAppSelector((state) => state.statusSlice);
    const ingredientsState = useAppSelector((state) => state.ingredientsSlice);
    const activePage = useAppSelector((state) => state.statusSlice.active_page);
    const stepsCount = Object.keys(stepperState.steps).length;

    const nameErrors = [
        'Choose a recipe type',
        'Put a name and time',
        'Insert media',
        'Insert ingredients',
        'Write a description',
        'Write the instructions',
    ]; 


    const isStepFailed = useCallback((step: number) => {
        const stepData = stepperState.steps[step];
        const errorStatus = stepData?.error_status;
        const isOpen = stepData?.open;

        if (!isOpen || !errorStatus) return false;

        if (step === 2) {
            return errorStatus.name === true || errorStatus.time === true;
        }

        if (step === 4) {
            const hasAtLeastOneFilled = ingredientsState.ingredients.some(ingredient => {
            if (!('amount' in ingredient.units)) return false;

                const hasName = ingredient.name.trim() !== '';
                const hasAmount = ingredient.units.amount > 0;
                const hasChoice = ingredient.units.choice.trim() !== '';

                return hasName && hasAmount && hasChoice;
            });

            return !hasAtLeastOneFilled;
        }

        return errorStatus.value === true;
    }, [stepperState, ingredientsState]);


    useEffect(() => {
        const hasAnyError = Array.from({ length: stepsCount }, (_, i) => i + 1).some((step) =>
            isStepFailed(step)
        );
        dispatch(setSomeError(hasAnyError));
        
    }, [stepperState, ingredientsState, dispatch, stepsCount, isStepFailed]);

    return (
        <Box sx={{ width: '100%', mt: '10px' }}>
            <Stepper activeStep={activePage - 1 }
                sx={{
                    '& .MuiStepConnector-root.Mui-active .MuiStepConnector-line': {
                        borderColor: '#FF7269',
                    },
                    '& .MuiStepConnector-root.Mui-completed .MuiStepConnector-line': {
                        borderColor: '#FF7269',
                    },
                    '& .MuiStepLabel-iconContainer': {
                        [theme.breakpoints.down(500)]: {
                            p: '0',
                            '& svg': {
                                width: '19px',
                                height: '19px',
                            }
                        }
                    }
                }}
            >
                {Array.from({ length: stepsCount }, (_, i) => i + 1).map((step) => {
                    const labelProps: {
                        optional?: React.ReactNode;
                        error?: boolean;
                    } = {};

                    if (isStepFailed(step)) {
                        labelProps.optional = (
                            <Typography variant="caption" color="error" sx={{ [theme.breakpoints.down(1250)]: { display: 'none' } }}>
                                {nameErrors[step - 1]}
                            </Typography>
                        );
                        labelProps.error = true;
                    }

                    return (
                        <Step key={step}>
                            <StepLabel {...labelProps}></StepLabel>
                        </Step>
                    );
                })}
            </Stepper>
        </Box>
    );
})


StepperProgress.displayName = "StepperProgress"