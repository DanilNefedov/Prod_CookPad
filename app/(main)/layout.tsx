import { Container, Paper } from "@mui/material";
import { NavigationSite } from "../components/navigation-site/navigation";
import { ClientUser } from "../components/client-side-handler/client-user";


export default function RootLayout({ children, }: Readonly<{ children: React.ReactNode; }>) {
  const styledPaperHome = {
    backgroundColor: 'secondary.main',
    borderRadius: '20px 0 0 20px',
    color: 'text.primary',
    width: "calc(100% - 140px)",
  }

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
