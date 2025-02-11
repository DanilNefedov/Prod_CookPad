import Paper from '@mui/material/Paper';
import { Box, Container } from "@mui/material";
import { MainBuildPage } from '@/app/components/new-recipe/main-build-page';
import { StepperProgress } from '@/app/components/new-recipe/stepper-progress';





export default function FormBuild() {
    // const { onHandlePrev, onHandleNext, step, updateFormData, saveFrom, formData } = useFormState();
    

    // const activeSaveBtn = stepperState.steps_info.find(el => el?.open && !el?.error_status)


    // const styleLink = {
    //     // fontWeight:'400', 
    //     lineHeight: 'inherit',
    //     textTransform: 'initial',
    //     color: 'text.secondary',

    //     ':hover': {
    //         bgcolor: 'primary.main',
    //         color: 'text.primary'
    //     },
    //     // width:'100%',
    //     backgroudColor: 'background.main'
    // }

    // function handleSave () {
    //     saveForm(stepperState)

    // }
    // console.log(step, formData, ingredients)

    return (
        <Paper sx={{ display: "flex", alignItems: 'center', justifyContent: 'center', boxShadow: 'none', width: '100%', 
           
         }}>
            <Container sx={{
                // display: "flex", 
                width: '100%', maxWidth:'100%', 
                '&.MuiContainer-root': {
                    paddingLeft: 0,
                    paddingRight: 0,
                },
                display: "flex",
                flexDirection: "column",
                height: "100vh",
                padding: "10px 0",
            }}>

                <StepperProgress></StepperProgress>

                <Box
                    component="form"
                    sx={{
                        '& .MuiTextField-root': { m: 1, },
                        flexGrow: 1,
                        display: 'flex',
                        flexDirection: 'column',
                        // mr: '10px',
                        mt: '20px',
                        width: '100%',
                        maxHeight:'84vh',
                    }}
                    noValidate
                    autoComplete="off"
                >
                    <MainBuildPage></MainBuildPage>
                </Box>

                {/* <Preview></Preview> */}
            </Container>

        </Paper>
    )
}