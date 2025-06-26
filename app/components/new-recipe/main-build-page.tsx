'use client'
import { Alert, Box, Button, CircularProgress, Paper, Stack } from "@mui/material"
import { styleLink } from "../home/header/header"
import { useAppDispatch, useAppSelector, } from "@/state/hook"
import { SelectPage } from "./select-page"
import { saveForm } from "./save-form"
import { theme } from "@/config/ThemeMUI/theme"
import { hasOpen, setActivePage } from "@/state/slices/stepper/error-open"
import { useStore } from "react-redux"
import { RootState } from "@/state/store"
import { useState } from "react"




export function MainBuildPage() {
    const dispatch = useAppDispatch();
    const store = useStore<RootState>();
    const statusPage = useAppSelector((state) => state.statusSlice.some_error);
    const activePage = useAppSelector((state) => state.statusSlice.active_page);
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
                sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    position: 'absolute',
                    width: '100%',
                    height: '100%',
                    top: '0',
                    left: '0',
                    backgroundColor: 'rgba(53, 56, 66, 0.5)',
                    backdropFilter: 'blur(10px)',
                    zIndex: 99999,
                }}
            >
                <CircularProgress />
            </Box>
            )}


            
            {errorMsg !== null && (
                <Stack
                    sx={{
                        maxWidth: "270px",
                        width: '100%',
                        position: 'absolute',
                        bottom: '20px',
                        right: 'calc(50% - 135px)',
                        zIndex: "99999",
                    }}
                    spacing={2}
                >
                    <Alert
                        sx={{ bgcolor: '#A5514F', color: '#dbcaca' }}
                        onClose={() => {
                        setErrorMsg(null);
                        }}
                        severity="error"
                    >
                        {errorMsg}
                    </Alert>
                </Stack>
            )}

            <Paper sx={{
                border: "5px solid #1F2128",
                display: 'flex',
                backgroundColor: 'background.default',
                flexGrow: '1',
                flexDirection: 'column',
                overflowY: 'auto',
                scrollbarColor: "#353842 #1F2128",
                [theme.breakpoints.down('md')]:{
                    borderRadius:'10px'
                }

            }}>
                <SelectPage step={activePage}></SelectPage>

                {activePage === 6 && (
                    <Button
                        variant="contained"
                        color="darkButton"
                        sx={{
                            ...styleLink,
                            width: '150px',
                            m: '0 auto',
                            [theme.breakpoints.down(500)]: {
                                width: "100px",
                            },
                        }}
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





            <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: '20px' }}>
                <Button variant="contained" color='blackRedBtn' sx={{ ...styleLink, display: activePage === 1 ? 'none' : 'block' }} onClick={(e) => {
                    e.preventDefault()
                    if (activePage === 1) return false
                    
                    const newPage = activePage - 1
                    dispatch(setActivePage(newPage))
                    dispatch(hasOpen(activePage))
                }}>Back</Button>
                <Button variant="contained" color='blackRedBtn' sx={{ ...styleLink, display: activePage === 6 ? 'none' : 'block', ml: 'auto', mr:'0' }} onClick={(e) => {
                    e.preventDefault()
                    const newPage = activePage + 1
                    dispatch(setActivePage(newPage))
                    dispatch(hasOpen(activePage))
                }}>Next</Button>
            </Box>
        </>

    )
}