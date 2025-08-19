import { useAppDispatch, useAppSelector } from "@/state/hook"
import { Box, Button, TextField, Typography } from "@mui/material"
import { ChangeEvent, FocusEvent } from "react"
import { NameInput } from "./InputName"
import { changeHours, changeMinutes, } from "@/state/slices/stepper/name-time"
import { errorTime, } from "@/state/slices/stepper/error-open"
import { flexAlign, timeBtns } from "@/app/(main)/new-recipe/style"
import { headerSteps } from "@/app/styles";


export function NameAndTime() {
    const numbStep = 2

    const timeState = useAppSelector(state => state.nameTimeSlice.time)
    const statusPage = useAppSelector(state => state.statusStepSlice.steps[numbStep].error_status.time)
    const openPage = useAppSelector(state => state.statusStepSlice.steps[numbStep].open)
    const dispatch = useAppDispatch()

   


    const handleHourIncrement = (): void => {
        const hours = timeState.hours
        if ((!isNaN(parseInt(hours)) && parseInt(hours) >= 0 && parseInt(hours) <= 59 && hours.length <= 2)) {
            dispatch(changeHours((parseInt(hours) + 1).toString()));
            dispatch(errorTime(false))
        }
    };

    const handleHourDecrement = (): void => {
        const hoursAsNumber = parseInt(timeState.hours);
        if (!isNaN(hoursAsNumber) && hoursAsNumber > 0) {
            dispatch(changeHours((hoursAsNumber - 1).toString()));
            dispatch(errorTime(false))
        }
        if (hoursAsNumber - 1 === 0 && parseInt(timeState.minutes) === 0) {
            dispatch(errorTime(true))

        }
    };



    const handleMinuteIncrement = (): void => {
        const minutes = timeState.minutes
        if ((!isNaN(parseInt(minutes)) && parseInt(minutes) >= 0 && parseInt(minutes) <= 59 && minutes.length <= 2)) {
            dispatch(changeMinutes((parseInt(minutes) + 1).toString()));
            dispatch(errorTime(false))
        }
    };

    const handleMinuteDecrement = (): void => {
        const hoursAsNumber = parseInt(timeState.minutes);
        if (!isNaN(hoursAsNumber) && hoursAsNumber > 0) {
            dispatch(changeMinutes((hoursAsNumber - 1).toString()));
            dispatch(errorTime(false))
        }
        if (hoursAsNumber - 1 === 0 && parseInt(timeState.hours) === 0) {
            dispatch(errorTime(true))
        }

        
    };



    const handleHourChange = (e: ChangeEvent<HTMLInputElement>): void => {
        const value = e.target.value;
        const minutes = timeState.minutes 
        if (value === '' || (!isNaN(parseInt(value)) && parseInt(value) >= 0 && parseInt(value) <= 60 && value.length <= 2)) {
            dispatch(changeHours(value));
            dispatch(errorTime(false))
            if(
                (value === '' || value === '0' || value === '00') &&
                (minutes === '' || minutes === '0' || minutes === '00')
            ) {
                dispatch(errorTime(true))
            }

        }
                
    };

    const handleMinuteChange = (e: ChangeEvent<HTMLInputElement>): void => {
        const value = e.target.value;
        const hours = timeState.hours 
        if (value === '' || (!isNaN(parseInt(value)) && parseInt(value) >= 0 && parseInt(value) <= 60 && value.length <= 2)) {
            dispatch(changeMinutes(value));
            dispatch(errorTime(false))
            if(
                (value === '' || value === '0' || value === '00') &&
                (hours === '' || hours === '0' || hours === '00')
            )  {
                dispatch(errorTime(true))
            }
        }
    };



    const handleEmpty = (e: FocusEvent<HTMLInputElement>) => {
        const value = e.target.value;
        if (value === '' && timeState.hours === '') {
            dispatch(changeHours('0'));
        }

        if (value === '' && timeState.minutes === '') {
            dispatch(changeMinutes('0'));
        }
    }


    return (
        <>
            <Typography variant="h6" component="h2" sx={headerSteps}>Enter the name of the recipe</Typography>
            
            <NameInput></NameInput>
            
            <Box sx={[{ m: '0 auto' }]}>
                <Typography variant="h6" component="h2" sx={[headerSteps, {mt:'7px'}]}>Enter the cooking time</Typography>
                <Box sx={flexAlign}>
                    <Button
                        sx={timeBtns}
                        onClick={(e) => {
                            e.preventDefault();
                            handleHourDecrement();
                        }}>—</Button>
                    <TextField id="outlined-basic" label="Hours" variant="outlined"
                        value={timeState.hours}
                        onChange={handleHourChange}
                        onBlur={handleEmpty}
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
                            handleHourIncrement();
                        }}>+</Button>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Button
                        sx={timeBtns}
                        onClick={(e) => {
                            e.preventDefault();
                            handleMinuteDecrement();
                        }}>—</Button>
                    <TextField id="outlined-basic" label="Minutes" variant="outlined"
                        type="number"
                        value={timeState.minutes}
                        onChange={handleMinuteChange}
                        onBlur={handleEmpty}
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
                            handleMinuteIncrement();
                        }}>+</Button>

                </Box>

            </Box>


        </>
    )
}