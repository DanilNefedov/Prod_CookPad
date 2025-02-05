'use client'
import { Box, Button, Paper } from "@mui/material"
import { styleLink } from "../home/header/header"
import { changeSteps, hasOpen } from "@/state/slices/step-by-step"
import { useAppDispatch, useAppSelector } from "@/state/hook"
import { SelectPage } from "./select-page"
import { saveForm } from "./save-form"
import { theme } from "@/config/ThemeMUI/theme"




export function MainBuildPage() {
    const stepperState = useAppSelector(state => state.setpForm)
    const dispatch = useAppDispatch()
    const userStore = useAppSelector(state => state.user)
    const id = userStore?.user?.connection_id
    const namaUser = userStore?.user?.name

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
                <SelectPage></SelectPage>

                {stepperState.page_step === 6 ? <Button variant="contained" color='darkButton' sx={{ ...styleLink, width: '150px', m: '0 auto' }} onClick={(e) => {
                    e.preventDefault()
                    saveForm(stepperState, id, dispatch, namaUser)
                    // savePhoto()
                }}>Save</Button> : <></>}
            </Paper>





            <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: '20px' }}>
                <Button variant="contained" color='blackRedBtn' sx={{ ...styleLink, display: stepperState.page_step === 1 ? 'none' : 'block' }} onClick={(e) => {
                    e.preventDefault()
                    if (stepperState.page_step === 1) return false
                    
                    // onHandlePrev()
                    const newPage = stepperState.page_step - 1
                    dispatch(changeSteps(newPage))
                    dispatch(hasOpen(stepperState.page_step))
                    console.log('111', stepperState)
                }}>Back</Button>
                <Button variant="contained" color='blackRedBtn' sx={{ ...styleLink, display: stepperState.page_step === 6 ? 'none' : 'block', ml: 'auto', mr:'0' }} onClick={(e) => {
                    e.preventDefault()
                    // onHandleNext()
                    const newPage = stepperState.page_step + 1
                    dispatch(changeSteps(newPage))
                    dispatch(hasOpen(stepperState.page_step))
                    console.log('111', stepperState)
                }}>Next</Button>
            </Box>
        </>

    )
}