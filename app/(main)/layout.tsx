import { Paper } from "@mui/material";
import GlobalErrorProvider from "../../config/client-side-handler/GlobalError";
import { UserProvider } from "../../config/user-alert/UserContext";
import { styledPaperHome } from "./home/styles";
import { NavigationSite } from "../components/navigation-site/NavigationSite";
import DynamicContainer from "@/config/wrapper/DynamicContainer";





export default function RootLayout({ children, }: Readonly<{ children: React.ReactNode; }>) {


  return (
    <GlobalErrorProvider>
      <NavigationSite></NavigationSite>
      <Paper sx={styledPaperHome}>
        <DynamicContainer>
          <UserProvider>
            {children}
          </UserProvider>
        </DynamicContainer>
        {/* <Container maxWidth={false} sx={containerHome}> */}
          
        {/* </Container> */}
      </Paper>
    </GlobalErrorProvider>
  )
}
