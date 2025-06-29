import { BlockContent } from "@/app/components/home/content/block-content"
import Header from "@/app/components/home/header/header"
import { Container, Paper } from "@mui/material"
import { mainContainer, mainContent } from "./style"
import { NavigationProvider } from "@/config/home-navigation/context-navigation"

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