import { btnIncDec, inputText, secondTextInput } from "@/app/main-styles"
import { useAppDispatch, useAppSelector } from "@/state/hook"
import { changeHours, changeMinutes, changeName } from "@/state/slices/step-by-step"
import { Box, Button, TextField, Typography } from "@mui/material"
import { ChangeEvent, FocusEvent } from "react"



export function NameAndTime() {
    const stepperState = useAppSelector(state => state.setpForm)
    const dispatch = useAppDispatch()
    const infoPageState = stepperState.steps_info.find(el => el.step === stepperState.page_step)

    const handleName = (e:ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        if (!e.target.value || e.target.value.trim() === ''){
            dispatch(changeName({step:stepperState.page_step, name_recipe:e.target.value, error_status:false}))
          }else{
            dispatch(changeName({step:stepperState.page_step, name_recipe:e.target.value, error_status:true}))
          }
    }

    const handleHourIncrement = (): void => {
        const hours = infoPageState?.hours
        if(hours !== undefined && (!isNaN(parseInt(hours)) && parseInt(hours) >= 0 && parseInt(hours) <= 59 && hours.length <= 2)){
            if(infoPageState?.hours === '') dispatch(changeHours('0'))

            dispatch(changeHours((parseInt(hours) + 1).toString()));
        }
    };

    const handleHourDecrement = (): void => {
        if(infoPageState?.hours !== undefined){
            const hoursAsNumber = parseInt(infoPageState?.hours);
            if (!isNaN(hoursAsNumber) && hoursAsNumber > 0) {
                dispatch(changeHours((hoursAsNumber - 1).toString()));
            }
            if(infoPageState?.hours === '') dispatch(changeHours('0'))
        }
    };

    const handleMinuteIncrement = (): void => {
        const minutes = infoPageState?.minutes
        if(minutes !== undefined && (!isNaN(parseInt(minutes)) && parseInt(minutes) >= 0 && parseInt(minutes) <= 59 && minutes.length <= 2)){
            if(infoPageState?.minutes === '') dispatch(changeMinutes('0'))
            dispatch(changeMinutes((parseInt(minutes) + 1).toString()));
        }
    };

    const handleMinuteDecrement = (): void => {
        if(infoPageState?.minutes !== undefined){
            const hoursAsNumber = parseInt(infoPageState?.minutes);
            if (!isNaN(hoursAsNumber) && hoursAsNumber > 0) {
                dispatch(changeMinutes((hoursAsNumber - 1).toString()));
            }
            if(infoPageState?.minutes === '') dispatch(changeMinutes('0'))
        }
    };

    const handleHourChange = (e: ChangeEvent<HTMLInputElement>): void => {
        const value = e.target.value;
        if (value === '' || (!isNaN(parseInt(value)) && parseInt(value) >= 0 && parseInt(value) <= 60 && value.length <= 2)) {
            dispatch(changeHours(value));
        }
    };

    const handleMinuteChange = (e: ChangeEvent<HTMLInputElement>): void => {
        const value = e.target.value;
        if (value === '' || (!isNaN(parseInt(value)) && parseInt(value) >= 0 && parseInt(value) <= 60 && value.length <= 2)) {
            dispatch(changeMinutes(value));
        }
    };

    const handleEmpty = (e: FocusEvent<HTMLInputElement>) => {
        const value = e.target.value;
        if(value === '' && infoPageState?.hours === ''){
            dispatch(changeHours('0'));
        }

        if(value === '' && infoPageState?.minutes === ''){
            dispatch(changeMinutes('0'));
        }
    }
 

    console.log(stepperState)
    return (
        <>
            <Typography variant="h6" component="h2" sx={{ textAlign: "center", mt: '25px' }}>Enter the name of the recipe</Typography>
            <TextField 
                error={infoPageState?.open && !infoPageState.second_option?.error_status ? true : false}
                id="outlined-basic" label="Name" variant="outlined"
                value={infoPageState?.second_option?.name_recipe}
                type="text"
                onChange={(e) => handleName(e)}
                sx={inputText}
            />
            <Box sx={{m:'0 8px'}}>
                <Box sx={{display:'flex', alignItems:'center'}}>
                    <Button
                        sx={btnIncDec}
                        onClick={(e) => {
                            e.preventDefault();
                            handleHourDecrement();
                        }}>-</Button>
                    <TextField id="outlined-basic" label="Hours" variant="outlined"
                        value={infoPageState?.hours}
                        onChange={handleHourChange}
                        onBlur={handleEmpty}
                        type="number"
                        sx={secondTextInput}
                        error={infoPageState?.open && !infoPageState?.error_status ? true : false}
                    />
                    <Button
                        sx={btnIncDec}
                        onClick={(e) => {
                            e.preventDefault();
                            handleHourIncrement();
                        }}>+</Button>
                </Box>
                <Box sx={{display:'flex', alignItems:'center'}}>
                    <Button
                        sx={btnIncDec}
                        onClick={(e) => {
                        e.preventDefault();
                        handleMinuteDecrement();
                    }}>-</Button>
                    <TextField id="outlined-basic" label="Minutes" variant="outlined"
                        type="number" 
                        value={infoPageState?.minutes}
                        sx={secondTextInput}
                        onChange={handleMinuteChange}
                        onBlur={handleEmpty}
                        error={infoPageState?.open && !infoPageState?.error_status ? true : false}
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