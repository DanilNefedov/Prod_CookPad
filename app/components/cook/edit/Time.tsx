import { Box, InputAdornment, TextField, Typography } from "@mui/material";
import { ChangeEvent, memo } from "react";
import { SkeletonInfo } from "../SkeletonInfo";
import { useAppDispatch, useAppSelector } from "@/state/hook";
import { changeHours, changeMinutes } from "@/state/slices/cook-slice";
import { changeTimeInput } from "@/app/(main)/cook/styles";





interface Props {
    recipe_id: string
    isEditing: boolean
}


const Time = memo(({ recipe_id, isEditing }: Props) => {
    const recipeStatus = useAppSelector(state => state.cook.operations.fetchCook.loading)
    const recipeTime = useAppSelector(state => state.cook.recipes[recipe_id]?.time)
    const modifiedTime = useAppSelector(state => state.cook.modified.time)
    const dispatch = useAppDispatch()


    function handleChangeHours(e: ChangeEvent<HTMLInputElement>) {
        const value = e.target.value;
        if (value === '' || (!isNaN(parseInt(value)) && parseInt(value) >= 0 && parseInt(value) <= 60 && value.length <= 2)) {
            dispatch(changeHours({ recipe_id, hours: value }))
        }
    }

    function handleChangeMinutes(e: ChangeEvent<HTMLInputElement>) {
        const value = e.target.value;
        if (value === '' || (!isNaN(parseInt(value)) && parseInt(value) >= 0 && parseInt(value) <= 60 && value.length <= 2)) {
            dispatch(changeMinutes({ recipe_id, minutes: value }))
        }
    }

    return (
        <Typography sx={{ display: 'flex', flexGrow: 1 }} component='span'>
            Time:
            {
                isEditing ?
                    <Box component='span'>
                        <TextField
                            id="outlined-basic"
                            variant="outlined"
                            value={
                                modifiedTime?.hours !== undefined
                                    ? modifiedTime.hours
                                    : recipeTime.hours
                            }
                            onChange={handleChangeHours}
                            type="number"
                            onKeyDown={(e) => {
                                if (['-', '+', 'e', ',', '.'].includes(e.key)) {
                                    e.preventDefault();
                                }
                            }}
                            slotProps={{
                                input: {
                                    endAdornment: (
                                        <InputAdornment component={'span'} position="end" sx={{'& p':{color:'text.primary'}}}>
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
                            value={
                                modifiedTime?.minutes !== undefined
                                    ? modifiedTime.minutes
                                    : recipeTime.minutes
                            }
                            onChange={handleChangeMinutes}
                            type="number"
                            onKeyDown={(e) => {
                                if (['-', '+', 'e', ',', '.'].includes(e.key)) {
                                    e.preventDefault();
                                }
                            }}
                            slotProps={{
                                input: {
                                    endAdornment: (
                                        <InputAdornment component={'span'} position="end" sx={{'& p':{color:'text.primary'}}}>
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