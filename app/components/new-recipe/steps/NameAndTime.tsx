import { useAppDispatch, useAppSelector } from "@/state/hook"
import { Box, Button, TextField, Typography } from "@mui/material"
import { useEffect } from "react"
import { NameInput } from "./InputName"
import { changeHours, changeMinutes, } from "@/state/slices/stepper/name-time"
import { errorTime, } from "@/state/slices/stepper/error-open"
import { flexAlign, timeBtns } from "@/app/(main)/new-recipe/style"
import { headerSteps } from "@/app/styles";
import { useTimeInput } from "@/app/hooks/useTime"


export function NameAndTime() {
    const numbStep = 2

    const timeState = useAppSelector(state => state.nameTimeSlice.time)
    const statusPage = useAppSelector(state => state.statusStepSlice.steps[numbStep].error_status.time)
    const openPage = useAppSelector(state => state.statusStepSlice.steps[numbStep].open)
    const dispatch = useAppDispatch()

    const hours = timeState?.hours ?? 0;
    const minutes = timeState?.minutes ?? 0;


    const {
        displayHours,
        displayMinutes,
        value,
        handleHoursChange,
        handleMinutesChange,
        handleHoursBlur,
        handleMinutesBlur,
    } = useTimeInput({
        initialValue: {
            hours,
            minutes,
        }
    });

    useEffect(() => {

        if (value.hours !== hours && value.hours !== null) {
            dispatch(changeHours(value.hours));
        }

        if (value.minutes !== minutes && value.minutes !== null) {
            dispatch(changeMinutes(value.minutes));
        }

        if (value.hours === 0 && value.minutes === 0) {
            dispatch(errorTime(true))
        } else {
            dispatch(errorTime(false))
        }

    }, [value.hours, value.minutes, dispatch]);


    const changeTimeValue = ( type: 'hours' | 'minutes', delta: number) => {
        const current = type === 'hours'
            ? (value.hours ?? 0)
            : (value.minutes ?? 0);

        const next = current + delta;

        const syntheticEvent = {
            target: { value: String(next) }
        } as React.ChangeEvent<HTMLInputElement>;

        if (type === 'hours') {
            handleHoursChange(syntheticEvent);
        } else {
            handleMinutesChange(syntheticEvent);
        }
    };


    return (
        <>
            <Typography variant="h6" component="h2" sx={headerSteps}>Enter the name of the recipe</Typography>

            <NameInput></NameInput>

            <Box sx={[{ m: '0 auto' }]}>
                <Typography variant="h6" component="h2" sx={[headerSteps, { mt: '7px' }]}>Enter the cooking time</Typography>
                <Box sx={flexAlign}>
                    <Button
                        sx={timeBtns}
                        onClick={(e) => {
                            e.preventDefault();
                            changeTimeValue('hours', -1);
                        }}>—</Button>
                    <TextField id="outlined-basic" label="Hours" variant="outlined"
                        value={displayHours}
                        onChange={handleHoursChange}
                        onBlur={handleHoursBlur}
                        type="number"
                        onKeyDown={(e) => {
                            if (['-', '+', 'e', ',', '.'].includes(e.key)) {
                                e.preventDefault();
                            }
                        }}
                        error={openPage && statusPage ? true : false}
                    />
                    <Button
                        sx={timeBtns}
                        onClick={(e) => {
                            e.preventDefault();
                            changeTimeValue('hours', 1);
                        }}>+</Button>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Button
                        sx={timeBtns}
                        onClick={(e) => {
                            e.preventDefault();
                            changeTimeValue('minutes', -1);
                        }}>—</Button>
                    <TextField id="outlined-basic" label="Minutes" variant="outlined"
                        type="number"
                        value={displayMinutes}
                        onChange={handleMinutesChange}
                        onBlur={handleMinutesBlur}
                        error={openPage && statusPage ? true : false}
                        onKeyDown={(e) => {
                            if (['-', '+', 'e', ',', '.'].includes(e.key)) {
                                e.preventDefault();
                            }
                        }}
                    />
                    <Button
                        sx={timeBtns}
                        onClick={(e) => {
                            e.preventDefault();
                             changeTimeValue('minutes', 1);
                        }}>+</Button>

                </Box>

            </Box>


        </>
    )
}