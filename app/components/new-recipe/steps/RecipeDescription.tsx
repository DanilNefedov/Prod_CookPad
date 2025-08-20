import { textAreaStepper } from "@/app/(main)/new-recipe/style";
import { headerSteps } from "@/app/styles";
import { useAppDispatch, useAppSelector } from "@/state/hook";
import { setDescription } from "@/state/slices/stepper/description";
import { updateError } from "@/state/slices/stepper/error-open";
import { TextField, Typography } from "@mui/material";
import { ChangeEvent, useEffect } from "react";









export function RecipeDescription() {
    const numbStep = 5

    const description = useAppSelector((state) => state.descriptionSlice.description);
    const statusPage = useAppSelector((state) => state.statusStepSlice.steps[numbStep]);
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
            <Typography variant="h6" component="h2" sx={headerSteps}>Your description</Typography>
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
                sx={textAreaStepper}
            />
        </>
    )
}