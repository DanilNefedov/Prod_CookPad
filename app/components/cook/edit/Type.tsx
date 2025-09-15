import { MenuItem, TextField, Typography } from "@mui/material";
import { SkeletonInfo } from "../SkeletonInfo";
import { ChangeEvent, memo } from "react";
import { useAppDispatch, useAppSelector } from "@/state/hook";
import { changeType } from "@/state/slices/cook-slice";
import { changeTypeInput, changeTypeItems } from "@/app/(main)/cook/styles";



interface Props {
    recipe_id:string 
    isEditing:boolean
}


const Type = memo(({recipe_id, isEditing}:Props) => {
    const recipeStatus = useAppSelector(state => state.cook.operations.fetchCook.loading)
    const recipeType = useAppSelector(state => state.cook.recipes[recipe_id]?.recipe_type)
    const recipeSorting = useAppSelector(state => state.cook.recipes[recipe_id]?.sorting)
    const modifiedType = useAppSelector(state => state.cook.modified.recipe_type)
    const sort = useAppSelector(state => state.cook.modified.sorting)
    const dispatch = useAppDispatch()

    const types = [
        {
            value: 'Salad',
            label: 'Salad',
        },
        {
            value: 'First course',
            label: 'First course',
        },
        {
            value: 'Snack',
            label: 'Snack',
        },
        {
            value: 'Dessert',
            label: 'Dessert',
        },
   
    ];

    function handleChange(e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
        const value = e.target.value

        const newSorting = recipeSorting.map(item =>
            item === recipeType ? value.toLowerCase() : item
        );

        dispatch(changeType({recipe_id, type:e.target.value, sorting:newSorting}))
    }




    return(
        <Typography component="span" variant="body1" sx={{display:'flex', mt:'7px'}}>
            Type:
            {
                isEditing ? 
                <TextField
                    onChange={e => { handleChange(e) }}
                    id="outlined-select-currency"
                    select
                    value={modifiedType === '' ? recipeType : modifiedType}
                    sx={changeTypeInput}
                    slotProps={{
                        select: {
                            MenuProps: {
                                PaperProps: {
                                    sx: changeTypeItems
                                },
                            },
                        },
                    }}
                >
                    {types.map((option) => (
                        <MenuItem key={option.value} value={option.value}>
                            {option.label}
                        </MenuItem>
                    ))}
                </TextField>
                :
                <SkeletonInfo loading={recipeStatus}> {recipeType}</SkeletonInfo>
            }
        </Typography>
    )
}, (prevProps, nextProps) => {
    return prevProps.isEditing === nextProps.isEditing && 
    prevProps.recipe_id === nextProps.recipe_id 
})

Type.displayName = "Type"

export default Type