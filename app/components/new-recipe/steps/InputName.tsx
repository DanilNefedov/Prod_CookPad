import { inputStepper } from "@/app/(main)/new-recipe/style";
import { useAppDispatch, useAppSelector } from "@/state/hook";
import { errorName } from "@/state/slices/stepper/error-open";
import { changeName } from "@/state/slices/stepper/name-time";
import { TextField } from "@mui/material";
import { ChangeEvent, memo } from "react";




export const NameInput = memo(() => {
    const dispatch = useAppDispatch()
    const name = useAppSelector((state) => state.nameTimeSlice.name.value);
    const isStepOpen = useAppSelector((state) => state.statusStepSlice.steps[2].open)
    const isNameError = useAppSelector((state) => state.statusStepSlice.steps[2].error_status.name);


    const handleName = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const value = e.target.value;
    
        if (value.length > 150) {
            return; 
        }
    
        dispatch(changeName(value));
    
        if (!value.trim() || value.trim() === '') {
            dispatch(errorName(true));
        } else {
            dispatch(errorName(false));
        }
    }
    
    return (
        <TextField
            error={isStepOpen && isNameError ? true : false}
            id="outlined-basic" label="Name" variant="outlined"
            value={name}
            type="text"
            onKeyDown={(e) => {
                if (['-', '+'].includes(e.key)) {
                    e.preventDefault();
                }
            }}
            onChange={(e) => handleName(e)}
            sx={inputStepper}
        />
    )

})


NameInput.displayName = "NameInput"