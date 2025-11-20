import { Paper } from "@mui/material";
import GlobalErrorProvider from "../../config/client-side-handler/GlobalError";
import { UserProvider } from "../../config/user-alert/UserContext";
import { styledPaperHome } from "./home/styles";
import { NavigationSite } from "../components/navigation-site/NavigationSite";
import DynamicContainer from "@/config/wrapper/DynamicContainer";
import React from "react";



export default async function RootLayout({ children }: Readonly<{ children: React.ReactNode; }>)  {
  // const session = await auth();
  // const connection_id = session?.user?.connection_id ?? null;
  // console.log(connection_id)
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
