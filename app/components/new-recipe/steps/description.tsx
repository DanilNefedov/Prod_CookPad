import { inputText } from "@/app/main-styles";
import { theme } from "@/config/ThemeMUI/theme";
import { useAppDispatch, useAppSelector } from "@/state/hook";
import { setDescription } from "@/state/slices/stepper/description";
import { updateError } from "@/state/slices/stepper/error-open";
import { TextField, Typography } from "@mui/material";
import { ChangeEvent, useEffect } from "react";









export function Description() {
    const numbStep = 5

    const description = useAppSelector((state) => state.descriptionSlice.description);
    const statusPage = useAppSelector((state) => state.statusSlice.steps[numbStep]);
    const dispatch = useAppDispatch();

    useEffect(() => {
        if (statusPage.open && description.length === 0) {
            dispatch(updateError({ step: numbStep, error: true }));
        }
    }, [statusPage.open, description.length, dispatch]);

    function handleDescriptionChange(e: ChangeEvent<HTMLInputElement>): void {
        const newValue = e.target.value;

        if (newValue.length <= 150) {
            dispatch(setDescription(newValue));
            dispatch(updateError({ step: numbStep, error: false }));
        }
    }

    return (
        <>
            <Typography variant="h6" component="h2" sx={{ textAlign: "center", mt: '25px', [theme.breakpoints.down('md')]: { fontSize: '18px', mt: '10px', } }}>Your description</Typography>
            <TextField
                id="outlined-multiline-flexible"
                label="Description"
                value={description}
                multiline
                name="description"
                maxRows={8}
                minRows={4}
                error={statusPage.open && statusPage.error_status.value ? true : false}
                helperText='max lenght 150 symbols'
                onChange={handleDescriptionChange}
                sx={{
                    ...inputText, '& .MuiOutlinedInput-root': {
                        mb: '0px',
                        '&.Mui-focused fieldset': {
                            borderColor: '#ffffff',
                        },

                        '& fieldset': {
                            borderColor: '#353842',
                        }
                    },
                    '& .MuiInputLabel-root': {
                        top: '0px',

                    },
                    '& .MuiFormLabel-root.Mui-focused': {
                        color: "#fff"
                    },
                    '& .MuiInputBase-root': {
                        [theme.breakpoints.down('md')]: {
                            p: '5px'
                        }
                    }

                }}
            />
        </>
    )
}