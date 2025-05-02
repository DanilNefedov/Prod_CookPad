'use client'
import { Box, Button, Paper } from "@mui/material"
import { styleLink } from "../home/header/header"
import { useAppDispatch, useAppSelector, } from "@/state/hook"
import { SelectPage } from "./select-page"
import { saveForm } from "./save-form"
import { theme } from "@/config/ThemeMUI/theme"
import { hasOpen, setActivePage } from "@/state/slices/stepper/error-open"
import { useStore } from "react-redux"
import { RootState } from "@/state/store"




export function MainBuildPage() {
    const dispatch = useAppDispatch()
    const statusPage = useAppSelector(state =>state.statusSlice.some_error);
    const activePage = useAppSelector(state =>state.statusSlice.active_page);

    const store = useStore<RootState>()

    // console.log('MainBuildPage')

    function handleSave(){
        const state = store.getState()

        const stepTypeRecommendation = state.stepTypeRecommend
        const stepNameTime = state.nameTimeSlice
        const stepMedia = state.mediaSlice
        const stepIngredients = state.ingredientsSlice
        const stepDescription = state.descriptionSlice
        const stepInstruction = state.instructionSlice
        const userId = state.user.user.connection_id
        const userName = state.user.user.name

        saveForm(stepTypeRecommendation, stepNameTime, stepMedia, stepIngredients, stepDescription, stepInstruction, userId, userName, dispatch)

    }

    return (
        <>
            <Paper sx={{
                border: "5px solid #1F2128",
                display: 'flex',
                backgroundColor: 'background.default',
                flexGrow: '1',
                // height: stepperState.page_step === 3 ? '80vh' : 'initial',
                flexDirection: 'column',
                overflowY: 'auto',
                scrollbarColor: "#353842 #1F2128",
                [theme.breakpoints.down('md')]:{
                    borderRadius:'10px'
                }

            }}>
                <SelectPage step={activePage}></SelectPage>

                {activePage === 6 ? 
                <Button variant="contained" color='darkButton' 
                sx={{ ...styleLink, 
                    width: '150px', m: '0 auto',
                    [theme.breakpoints.down(500)]: {
                        width:"100px"
                    }
                }} 
                disabled={statusPage}
                onClick={(e) => {
                    e.preventDefault()
                    handleSave()
                    //stepperState, id, dispatch, namaUser
                }}>Save</Button> : <></>}
            </Paper>





            <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: '20px' }}>
                <Button variant="contained" color='blackRedBtn' sx={{ ...styleLink, display: activePage === 1 ? 'none' : 'block' }} onClick={(e) => {
                    e.preventDefault()
                    if (activePage === 1) return false
                    
                    // onHandlePrev()
                    const newPage = activePage - 1
                    dispatch(setActivePage(newPage))
                    // dispatch(changeSteps(newPage))
                    dispatch(hasOpen(activePage))
                }}>Back</Button>
                <Button variant="contained" color='blackRedBtn' sx={{ ...styleLink, display: activePage === 6 ? 'none' : 'block', ml: 'auto', mr:'0' }} onClick={(e) => {
                    e.preventDefault()
                    // onHandleNext()
                    const newPage = activePage + 1
                    dispatch(setActivePage(newPage))
                    // dispatch(changeSteps(newPage))
                    dispatch(hasOpen(activePage))
                }}>Next</Button>
            </Box>
        </>

    )
}