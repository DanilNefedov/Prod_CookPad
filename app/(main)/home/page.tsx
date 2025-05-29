import { BlockContent } from "@/app/components/home/content/block-content"
import { NavigationProvider } from "@/app/components/home/context-navigation"
import Header from "@/app/components/home/header/header"
import { Container, Paper } from "@mui/material"
import { mainContainer, mainContent } from "./style"

export default async function Main() {

  return (
    <NavigationProvider>
      <Header></Header>
      <Paper sx={mainContent} elevation={0}>
        <Container sx={mainContainer} maxWidth={false}>
          <BlockContent></BlockContent>
        </Container>
      </Paper>
    </NavigationProvider>
  )
}