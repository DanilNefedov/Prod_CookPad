import Paper from '@mui/material/Paper';
import { Box, Container } from "@mui/material";
import { MainBuildPage } from '@/app/components/new-recipe/MainBuildPage';
import { StepperProgress } from '@/app/components/new-recipe/StepperProgress';
import { centerFlexBlock } from '@/app/styles';
import { container, form, mainPaper } from './style';





export default function FormBuild() {
    
    return (
        <Paper sx={[centerFlexBlock, mainPaper]}>
            <Container sx={container}>

                <StepperProgress></StepperProgress>

                <Box
                    component="form"
                    sx={form}
                    noValidate
                    autoComplete="off"
                >
                    <MainBuildPage></MainBuildPage>
                </Box>

            </Container>

        </Paper>
    )
}