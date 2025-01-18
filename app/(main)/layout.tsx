"use client";

import { useAppDispatch, useAppSelector } from "@/state/hook";
import { fetchUser } from "@/state/slices/user-slice";
import { Container, Paper } from "@mui/material";
import { useSession } from "next-auth/react";
import { useEffect } from "react";
import { NavigationSite } from "../components/navigation-site/navigation";


export default function RootLayout({ children, }: Readonly<{ children: React.ReactNode; }>) {
  const styledPaperHome = {
    backgroundColor: 'secondary.main',
    borderRadius: '20px 0 0 20px',
    color: 'text.primary',
    width: "calc(100% - 140px)",
  }

  const dispatch = useAppDispatch()
  const session = useSession()
  const connection_id = session?.data?.user?.connection_id

  useEffect(() => {
    async function fetchData() {
      if (session.data) {
        dispatch(fetchUser(connection_id))
      } 
    }
    fetchData();
  }, [connection_id]);

  //change to use hook (method)

  return (
    <>
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
