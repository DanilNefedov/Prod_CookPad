import { Container, Paper } from "@mui/material";
import { NavigationSite } from "../components/navigation-site/navigation";
import GlobalErrorProvider from "../../config/client-side-handler/global-error";
import { UserProvider } from "../../config/user-alert/user-context";
import { containerHome, styledPaperHome } from "./home/styles";





export default function RootLayout({ children, }: Readonly<{ children: React.ReactNode; }>) {


  return (
    <GlobalErrorProvider>
      <NavigationSite></NavigationSite>
      <Paper sx={styledPaperHome}>
        <Container maxWidth={false} sx={containerHome}>
          <UserProvider>
            {children}
          </UserProvider>
        </Container>
      </Paper>
    </GlobalErrorProvider>
  )
}
