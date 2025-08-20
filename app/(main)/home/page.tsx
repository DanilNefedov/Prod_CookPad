import { BlockContent } from "@/app/components/home/content/BlockContent"
import { Container, Paper } from "@mui/material"
import { mainContainer, mainContent } from "./styles"
import { NavigationProvider } from "@/config/home-navigation/ContextNavigation"
import HomeHeader from "@/app/components/home/header/HomeHeader"

export default async function Main() {

  return (
    <NavigationProvider>
      <HomeHeader></HomeHeader>
      <Paper sx={mainContent} elevation={0}>
        <Container sx={mainContainer} maxWidth={false} disableGutters>
          <BlockContent></BlockContent>
        </Container>
      </Paper>
    </NavigationProvider>
  )
}