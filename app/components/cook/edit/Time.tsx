import { Box, InputAdornment, TextField, Typography } from "@mui/material";
import { memo, useEffect } from "react";
import { SkeletonInfo } from "../SkeletonInfo";
import { useAppDispatch, useAppSelector } from "@/state/hook";
import { changeTime, resetModifiedTime } from "@/state/slices/cook-slice";
import { changeTimeInput } from "@/app/(main)/cook/styles";
import { useTimeInput } from "@/app/hooks/useTime";





interface Props {
    recipe_id: string
    isEditing: boolean
}


const Time = memo(({ recipe_id, isEditing }: Props) => {
    const recipeStatus = useAppSelector(state => state.cook.operations.fetchCook.loading)
    const recipeTime = useAppSelector(state => state.cook.recipes[recipe_id]?.time)
    const modifiedTime = useAppSelector(state => state.cook.modified.time)
    const dispatch = useAppDispatch()

    const hours = modifiedTime?.hours ?? Number(recipeTime?.hours) ?? 0;
    const minutes = modifiedTime?.minutes ?? Number(recipeTime?.minutes) ?? 0;

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
        if(isEditing){
            dispatch(resetModifiedTime())
        }

        if(value.hours !== hours || value.minutes !== minutes){
            dispatch(changeTime({hours:value.hours, minutes:value.minutes, recipe_id}));
        }
        
    }, [value.hours, value.minutes, dispatch, recipe_id, isEditing]);


    return (
        <Typography sx={{ display: 'flex', flexGrow: 1 }} component='span'>
            Time:
            {
                isEditing ?
                    <Box component='span'>
                        <TextField
                            id="outlined-basic"
                            variant="outlined"
                            value={displayHours}
                            onChange={handleHoursChange}
                            onBlur={handleHoursBlur}
                            type="number"
                            onKeyDown={(e) => {
                                if (['-', '+', 'e', ',', '.'].includes(e.key)) {
                                    e.preventDefault();
                                }
                            }}
                            slotProps={{
                                input: {
                                    endAdornment: (
                                        <InputAdornment component={'span'} position="end" sx={{ '& p': { color: 'text.primary' } }}>
                                            h :
                                        </InputAdornment>
                                    ),
                                },
                            }}
                            sx={changeTimeInput}
                        />
                        <TextField
                            id="outlined-basic"
                            variant="outlined"
                            value={displayMinutes}
                            onChange={handleMinutesChange}
                            onBlur={handleMinutesBlur}
                            type="number"
                            onKeyDown={(e) => {
                                if (['-', '+', 'e', ',', '.'].includes(e.key)) {
                                    e.preventDefault();
                                }
                            }}
                            slotProps={{
                                input: {
                                    endAdornment: (
                                        <InputAdornment component={'span'} position="end" sx={{ '& p': { color: 'text.primary' } }}>
                                            m
                                        </InputAdornment>
                                    ),
                                },
                            }}
                            sx={changeTimeInput}
                        />
                    </Box>
                    :

                    <SkeletonInfo loading={recipeStatus}> {recipeTime?.hours}h : {recipeTime?.minutes}m</SkeletonInfo>
            }

        </Typography>

    )


}, (prevProps, nextProps) => {
    return prevProps.isEditing === nextProps.isEditing &&
        prevProps.recipe_id === nextProps.recipe_id
})

Time.displayName = "Time"

export default Time