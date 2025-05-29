import { btnIncDec, secondTextInput } from "@/app/main-styles"
import { theme } from "@/config/ThemeMUI/theme"
import { useAppDispatch, useAppSelector } from "@/state/hook"
import { Box, Button, TextField, Typography } from "@mui/material"
import { ChangeEvent, FocusEvent } from "react"
import { NameInput } from "./input-name"
import { changeHours, changeMinutes, } from "@/state/slices/stepper/name-time"
import { errorTime, } from "@/state/slices/stepper/error-open"



export function NameAndTime() {
    const numbStep = 2

    const nameTimeState = useAppSelector(state => state.nameTimeSlice.time)
    const statusPage = useAppSelector(state => state.statusSlice.steps[numbStep].error_status.time)
    const openPage = useAppSelector(state => state.statusSlice.steps[numbStep].open)
    const dispatch = useAppDispatch()

   


    const handleHourIncrement = (): void => {
        const hours = nameTimeState.hours
        if ((!isNaN(parseInt(hours)) && parseInt(hours) >= 0 && parseInt(hours) <= 59 && hours.length <= 2)) {
            dispatch(changeHours((parseInt(hours) + 1).toString()));
            dispatch(errorTime(false))
        }
    };

    const handleHourDecrement = (): void => {
        const hoursAsNumber = parseInt(nameTimeState.hours);
        if (!isNaN(hoursAsNumber) && hoursAsNumber > 0) {
            dispatch(changeHours((hoursAsNumber - 1).toString()));
            dispatch(errorTime(false))
        }
        if (hoursAsNumber - 1 === 0 && parseInt(nameTimeState.minutes) === 0) {
            dispatch(errorTime(true))

        }
    };



    const handleMinuteIncrement = (): void => {
        const minutes = nameTimeState.minutes
        if ((!isNaN(parseInt(minutes)) && parseInt(minutes) >= 0 && parseInt(minutes) <= 59 && minutes.length <= 2)) {
            dispatch(changeMinutes((parseInt(minutes) + 1).toString()));
            dispatch(errorTime(false))
        }
    };

    const handleMinuteDecrement = (): void => {
        const hoursAsNumber = parseInt(nameTimeState.minutes);
        if (!isNaN(hoursAsNumber) && hoursAsNumber > 0) {
            dispatch(changeMinutes((hoursAsNumber - 1).toString()));
            dispatch(errorTime(false))
        }
        if (hoursAsNumber - 1 === 0 && parseInt(nameTimeState.hours) === 0) dispatch(errorTime(true))

        
    };



    const handleHourChange = (e: ChangeEvent<HTMLInputElement>): void => {
        const value = e.target.value;
        const minutes = nameTimeState.minutes 
        if (value === '' || (!isNaN(parseInt(value)) && parseInt(value) >= 0 && parseInt(value) <= 60 && value.length <= 2)) {
            dispatch(changeHours(value));
            dispatch(errorTime(false))
            if(
                (value === '' || value === '0' || value === '00') &&
                (minutes === '' || minutes === '0' || minutes === '00')
            ) dispatch(errorTime(true))

        }
                
    };

    const handleMinuteChange = (e: ChangeEvent<HTMLInputElement>): void => {
        const value = e.target.value;
        const hours = nameTimeState.hours 
        if (value === '' || (!isNaN(parseInt(value)) && parseInt(value) >= 0 && parseInt(value) <= 60 && value.length <= 2)) {
            dispatch(changeMinutes(value));
            dispatch(errorTime(false))
            if(
                (value === '' || value === '0' || value === '00') &&
                (hours === '' || hours === '0' || hours === '00')
            )  dispatch(errorTime(true))
        }
    };



    const handleEmpty = (e: FocusEvent<HTMLInputElement>) => {
        const value = e.target.value;
        if (value === '' && nameTimeState.hours === '') {
            dispatch(changeHours('0'));
        }

        if (value === '' && nameTimeState.minutes === '') {
            dispatch(changeMinutes('0'));
        }
    }


    return (
        <>
            <Typography variant="h6" component="h2" sx={{ textAlign: "center", mt: '25px', [theme.breakpoints.down('md')]: { fontSize: '18px', mt: '10px' } }}>Enter the name of the recipe</Typography>
            
            <NameInput></NameInput>
            
            <Box sx={{ m: '0 8px' }}>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Button
                        sx={btnIncDec}
                        onClick={(e) => {
                            e.preventDefault();
                            handleHourDecrement();
                        }}>-</Button>
                    <TextField id="outlined-basic" label="Hours" variant="outlined"
                        value={nameTimeState.hours}
                        onChange={handleHourChange}
                        onBlur={handleEmpty}
                        type="number"
                        sx={secondTextInput}
                        onKeyDown={(e) => {
                            if (['-', '+', 'e', ',', '.'].includes(e.key)) {
                                e.preventDefault();
                            }
                        }}
                        error={openPage && statusPage ? true : false}
                    />
                    <Button
                        sx={btnIncDec}
                        onClick={(e) => {
                            e.preventDefault();
                            handleHourIncrement();
                        }}>+</Button>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Button
                        sx={btnIncDec}
                        onClick={(e) => {
                            e.preventDefault();
                            handleMinuteDecrement();
                        }}>-</Button>
                    <TextField id="outlined-basic" label="Minutes" variant="outlined"
                        type="number"
                        value={nameTimeState.minutes}
                        sx={secondTextInput}
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
                        sx={btnIncDec}
                        onClick={(e) => {
                            e.preventDefault();
                            handleMinuteIncrement();
                        }}>+</Button>

                </Box>

            </Box>


        </>
    )
}