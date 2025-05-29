import { inputText } from "@/app/main-styles";
import { useAppDispatch, useAppSelector } from "@/state/hook";
import { errorName } from "@/state/slices/stepper/error-open";
import { changeName } from "@/state/slices/stepper/name-time";
import { TextField } from "@mui/material";
import { ChangeEvent, memo } from "react";




export const NameInput = memo(() => {
    const dispatch = useAppDispatch()
    const nameTimeState = useAppSelector(state => state.nameTimeSlice.name.value)
    const open = useAppSelector(state => state.statusSlice.steps[2].open)
    const statusPage = useAppSelector(state => state.statusSlice.steps[2].error_status.name)


    const handleName = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const value = e.target.value;
    
        if (value.length > 150) {
            return; 
        }
    
        dispatch(changeName(value));
    
        if (!value.trim() || value.trim() === '') {
            console.log(value);
            dispatch(errorName(true));
        } else {
            console.log(value);
            dispatch(errorName(false));
        }
    }
    
    return (
        <TextField
            error={open && statusPage ? true : false}
            id="outlined-basic" label="Name" variant="outlined"
            value={nameTimeState}
            type="text"
            onKeyDown={(e) => {
                if (['-', '+', 'e'].includes(e.key)) {
                    e.preventDefault();
                }
            }}
            onChange={(e) => handleName(e)}
            sx={inputText}
        />
    )

})


NameInput.displayName = "NameInput"