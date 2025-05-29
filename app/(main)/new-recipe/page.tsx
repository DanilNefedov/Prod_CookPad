import Paper from '@mui/material/Paper';
import { Box, Container } from "@mui/material";
import { MainBuildPage } from '@/app/components/new-recipe/main-build-page';
import { StepperProgress } from '@/app/components/new-recipe/stepper-progress';





export default function FormBuild() {
    
    return (
        <Paper sx={{ display: "flex", alignItems: 'center', justifyContent: 'center', boxShadow: 'none', width: '100%', 
           
         }}>
            <Container sx={{
                width: '100%', maxWidth:'100%', 
                '&.MuiContainer-root': {
                    paddingLeft: 0,
                    paddingRight: 0,
                },
                display: "flex",
                flexDirection: "column",
                height: "100dvh",
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
                        mt: '20px',
                        width: '100%',
                        maxHeight:'84dvh',
                    }}
                    noValidate
                    autoComplete="off"
                >
                    <MainBuildPage></MainBuildPage>
                </Box>

            </Container>

        </Paper>
    )
}