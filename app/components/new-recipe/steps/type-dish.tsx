import { checkIcon, checkRecommend, paperMenu, typeDishInput, typeMenu } from "@/app/(main)/new-recipe/style";
import { useAppDispatch, useAppSelector } from "@/state/hook";
import { updateError } from "@/state/slices/stepper/error-open";
import { changeType, openRecommendation } from "@/state/slices/stepper/type-recommend";
import { Checkbox, FormControlLabel, TextField, Typography } from "@mui/material";
import MenuItem from '@mui/material/MenuItem';
import { ChangeEvent } from "react";
import { headerSteps } from "@/app/styles";





export function TypeDish() {
  const numbStep = 1

  const statePage = useAppSelector(state => state.stepTypeRecommend)
  const statusPage = useAppSelector(state => state.statusStepSlice.steps[numbStep])
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
    dispatch(changeType(e.target.value))

    if (!e.target.value || e.target.value.trim() === '') {
      dispatch(updateError({ step: numbStep, error: true }))
    } else {
      dispatch(updateError({ step: numbStep, error: false }))
    }
    
  }

  function handleOpenRecommendation() {
    dispatch(openRecommendation(statePage.recommendation))
  }

  return (
    <>
      <Typography variant="h6" component="h2" sx={headerSteps}>Type of dish</Typography>
      <TextField
        id="outlined-select-currency"
        select
        label="Select"
        value={statePage.type_recipe}
        onChange={e => { handleChange(e) }}
        helperText="Choose the type of dish"
        error={statusPage.error_status.value && statusPage.open}
        sx={typeDishInput}
        slotProps={{
          select: {
            MenuProps: {
              PaperProps: {
                sx: paperMenu
              },
            },
          },
        }}
        >
        {types.map((option) => (
          <MenuItem sx={typeMenu} key={option.value} value={option.value}>
            {option.label}
          </MenuItem>
        ))}
      </TextField>


      <FormControlLabel sx={checkRecommend} 
      control={<Checkbox
      sx={checkIcon}
      onClick={() => handleOpenRecommendation()} checked={statePage.recommendation} />} label="Open for recommendations" />

    </>
  )
}