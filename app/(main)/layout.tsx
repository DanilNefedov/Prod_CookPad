import { Container, Paper } from "@mui/material";
import GlobalErrorProvider from "../../config/client-side-handler/GlobalError";
import { UserProvider } from "../../config/user-alert/UserContext";
import { containerHome, styledPaperHome } from "./home/styles";
import { NavigationSite } from "../components/navigation-site/navigation";





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
