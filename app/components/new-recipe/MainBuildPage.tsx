'use client'
import { Alert, Box, Button, CircularProgress, Paper, Stack } from "@mui/material"
import { useAppDispatch, useAppSelector, } from "@/state/hook"
import { SelectPage } from "./SelectPage"
import { saveForm } from "./save-form"
import { hasOpen, setActivePage } from "@/state/slices/stepper/error-open"
import { useStore } from "react-redux"
import { RootState } from "@/state/store"
import { useState } from "react"
import { alertMui, centerFlexBlock,} from "@/app/styles"
import { buildLoaderBox, containerBtns, errorBox, nextBtn, pageBtns, paperForm, saveBtn } from "@/app/(main)/new-recipe/style"




export function MainBuildPage() {
    const dispatch = useAppDispatch();
    const store = useStore<RootState>();
    const statusPage = useAppSelector((state) => state.statusStepSlice.some_error);
    const activePage = useAppSelector((state) => state.statusStepSlice.active_page);
    const [loading, setLoading] = useState(false);
    const [errorMsg, setErrorMsg] = useState<string | null>(null);



    async function handleSave() {
        setLoading(true);
        try {
            const state = store.getState();
    
            const stepTypeRecommendation = state.stepTypeRecommend;
            const stepNameTime = state.nameTimeSlice;
            const stepMedia = state.mediaSlice;
            const stepIngredients = state.ingredientsSlice;
            const stepDescription = state.descriptionSlice;
            const stepInstruction = state.instructionSlice;
            const userId = state.user.user.connection_id;
            const userName = state.user.user.name;
            
            const result = await saveForm(
                stepTypeRecommendation,
                stepNameTime,
                stepMedia,
                stepIngredients,
                stepDescription,
                stepInstruction,
                userId,
                userName,
                dispatch
            );
            
            if (result !== null && result?.message) {
                throw new Error(result.message);
            }
            
            setErrorMsg(null);
        } catch (error) {
            setErrorMsg(`An error occurred while saving. ${error}`);
            console.error(error);
        } finally {
            setLoading(false);
        }
    }
    
    return (
        <>
            {loading && (
            <Box
                sx={[centerFlexBlock, buildLoaderBox]}
            >
                <CircularProgress />
            </Box>
            )}
            
            {!errorMsg === null && (
                <Stack
                    sx={errorBox}
                    spacing={2}
                >
                    <Alert
                        sx={alertMui}
                        onClose={() => {
                        setErrorMsg(null);
                        }}
                        severity="error"
                    >
                        {errorMsg}
                    </Alert>
                </Stack>
            )}

            <Paper sx={paperForm}>
                <SelectPage step={activePage}></SelectPage>

                {activePage === 6 && (
                    <Button
                        color="grayButton"
                        sx={saveBtn}
                        disabled={statusPage}
                        onClick={(e) => {
                            e.preventDefault();
                            handleSave();
                        }}
                    >
                        Save
                    </Button>
                )}
            </Paper>

            <Box sx={containerBtns}>
                <Button color='blackBtn' 
                sx={[{display: activePage === 1 ? 'none' : 'block'}, pageBtns]} 
                onClick={(e) => {
                    e.preventDefault()
                    if (activePage === 1) return false
                    
                    const newPage = activePage - 1
                    dispatch(setActivePage(newPage))
                    dispatch(hasOpen(activePage))
                }}>Back</Button>
                <Button color='blackBtn' 
                sx={[{ display: activePage === 6 ? 'none' : 'block' }, pageBtns, nextBtn]} 
                onClick={(e) => {
                    e.preventDefault()
                    const newPage = activePage + 1
                    dispatch(setActivePage(newPage))
                    dispatch(hasOpen(activePage))
                }}>Next</Button>
            </Box>
        </>

    )
}