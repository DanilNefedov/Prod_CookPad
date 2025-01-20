import { Container, Paper } from '@mui/material'
import style from './main-content.module.css'
import { mainContainer, mainContent } from '@/app/(main)/home/style'
import { BlockContent } from './block-content'



export function MainContent(){
    return(
        <Paper sx={mainContent} elevation={0}>
            <Container sx={mainContainer} maxWidth={false}>
                <BlockContent></BlockContent>
            </Container>
        </Paper>
    )
}
