import { useAppDispatch, useAppSelector } from "@/state/hook";
import { changeType, openRecommendation } from "@/state/slices/step-by-step";
import { Button, Checkbox, FormControlLabel, TextField, Typography } from "@mui/material";
import MenuItem from '@mui/material/MenuItem';
import { ChangeEvent } from "react";





export function TypeDish() {
  // const { formData, updateFormData, errorState } = useFormState();
  const stepperState = useAppSelector(state => state.setpForm)
  const dispatch = useAppDispatch()
  const infoPageState = stepperState.steps_info.find(el => el.step === stepperState.page_step)

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
    // {
    //   value: '',
    //   label: '',
    // },
  ];
  function handleChange(e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    // console.log(e.target.value)
    if (!e.target.value || e.target.value.trim() === '') {
      // console.log('2')
      dispatch(changeType({ step: stepperState.page_step, type: e.target.value, error_status: false }))
    } else {
      dispatch(changeType({ step: stepperState.page_step, type: e.target.value, error_status: true }))
    }
  }

  function handleOpenRecommendation(){
    if(infoPageState?.recommendation !== undefined){
      dispatch(openRecommendation(infoPageState?.recommendation))
    }
  }
  // console.log(infoPageState?.recommendation)
  return (
    <>
      <Typography variant="h6" component="h2" sx={{ textAlign: "center", mt: '25px' }}>Type of dish</Typography>
      <TextField
        id="outlined-select-currency"
        select
        label="Select"
        // defaultValue="Salad"
        value={infoPageState?.type_recipe}
        onChange={e => { handleChange(e) }}
        helperText="Choose the type of dish"
        // color='primary'
        // color={}
        error={infoPageState?.open && !infoPageState.error_status ? true : false}
        sx={{
          display: 'flex',
          borderColor: '#fff',
          "& .MuiSvgIcon-root": {
            color: "#8E94A4",
          },
          '&&': {
            m: '40px 8px 0',
          },

          '& .MuiOutlinedInput-root': {
            '& fieldset': {
              borderColor: '#353842',
            },

          },
          '& .MuiInputBase-root': {
            backgroundColor: '#1F2128',
            color: '#fff',
            '&.Mui-focused': {
              backgroundColor: '#1F2128',
              color: '#fff',
              '& fieldset': {
                borderColor: '#fff',
              },
            },
          },
          '& .MuiInputLabel-root': {
            color: '#fff',
            '&.Mui-focused': {
              color: '#fff',
            },
          },
        }}>
        {types.map((option) => (
          <MenuItem sx={{
            '&.MuiMenuItem-root': {
              // backgroundColor: '#1F2128',
              color: '#fff',

              '&:hover': {
                backgroundColor: '#1F2128',
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

    <FormControlLabel sx={{margin:'20px 2px'}} control={<Checkbox onClick={() => handleOpenRecommendation()} checked={infoPageState?.recommendation}/>} label="Open for recommendations" />

    </>
  )
}