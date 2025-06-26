import { typeDishInput } from "@/app/(main)/new-recipe/style";
import { theme } from "@/config/ThemeMUI/theme";
import { useAppDispatch, useAppSelector } from "@/state/hook";
import { updateError } from "@/state/slices/stepper/error-open";
import { changeType, openRecommendation } from "@/state/slices/stepper/type-recommend";
import { Checkbox, FormControlLabel, TextField, Typography } from "@mui/material";
import MenuItem from '@mui/material/MenuItem';
import { ChangeEvent } from "react";





export function TypeDish() {
  const numbStep = 1

  const statePage = useAppSelector(state => state.stepTypeRecommend)
  const statusPage = useAppSelector(state => state.statusSlice.steps[numbStep])
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
      <Typography variant="h6" component="h2" sx={{ textAlign: "center", mt: '25px', [theme.breakpoints.down('md')]: { fontSize: '18px', mt: '10px' } }}>Type of dish</Typography>
      <TextField
        id="outlined-select-currency"
        select
        label="Select"
        // defaultValue="Salad"
        value={statePage.type_recipe}
        onChange={e => { handleChange(e) }}
        helperText="Choose the type of dish"
        error={statusPage.error_status.value && statusPage.open}
        sx={typeDishInput}>

        {types.map((option) => (

          <MenuItem sx={{

            [theme.breakpoints.down('md')]: {
              fontSize: '14px',
              minHeight: '33px',
            },

            '&.MuiMenuItem-root': {
              color: '#fff',
              '@media (hover: hover) and (pointer: fine)': {
                '&:hover': {
                  backgroundColor: '#1F2128',
                },
              },
              '&.Mui-selected': {
                backgroundColor: '#1F2128',
                color: '#fff',
              },

            },
          }} key={option.value} value={option.value}>
            {option.label}
          </MenuItem>
          
        ))}

      </TextField>

      <FormControlLabel sx={{
        ml: '0',
        [theme.breakpoints.down('md')]: {
          margin: '5px 2px',
          '& .MuiTypography-root': {
            fontSize: '14px',
          }
        }
      }} control={<Checkbox
        sx={{
          [theme.breakpoints.down('md')]: {
            m: '2px',
            maxWidth: '20px',
            maxHeight: "20px",
            '& svg': {
              maxWidth: '20px',
              maxHeight: "20px"
            }
          }
        }}

        onClick={() => handleOpenRecommendation()} checked={statePage.recommendation} />} label="Open for recommendations" />

    </>
  )
}