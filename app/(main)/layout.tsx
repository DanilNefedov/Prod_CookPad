import { useAppDispatch, useAppSelector } from "@/state/hook";
import { fetchUser } from "@/state/slices/user-slice";
import { Container, Paper } from "@mui/material";
import { useSession } from "next-auth/react";
import { useEffect } from "react";
import { NavigationSite } from "../components/navigation-site/navigation";
import { ClientUser } from "../components/client-side-handler/client-user";


export default function RootLayout({ children, }: Readonly<{ children: React.ReactNode; }>) {
  const styledPaperHome = {
    backgroundColor: 'secondary.main',
    borderRadius: '20px 0 0 20px',
    color: 'text.primary',
    width: "calc(100% - 140px)",
  }
  //change to use hook (method)

  return (
    <>
      <ClientUser></ClientUser>
      <NavigationSite></NavigationSite>
      <Paper sx={styledPaperHome}>
        <Container maxWidth={false} sx={{
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center'
        }}>
          {children}
        </Container>
      </Paper>

    </>
  )
}
