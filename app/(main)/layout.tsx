import { Container, Paper } from "@mui/material";
import { NavigationSite } from "../components/navigation-site/navigation";
import { theme } from "@/config/ThemeMUI/theme";
import GlobalErrorProvider from "../components/client-side-handler/global-error";
import { UserProvider } from "../components/user-alert/user-context";





export default function RootLayout({ children, }: Readonly<{ children: React.ReactNode; }>) {
  const styledPaperHome = {
    backgroundColor: 'secondary.main',
    borderRadius: '20px 0 0 20px',
    color: 'text.primary',
    width: "calc(100% - 165px)",

    [theme.breakpoints.down("md")]: {
      width: "calc(100% - 60px)",
    },
    [theme.breakpoints.down(500)]: {
      width: "calc(100% - 45px)",
    }
  }



  return (
    <GlobalErrorProvider>
      <NavigationSite></NavigationSite>
      <Paper sx={styledPaperHome}>
        <Container maxWidth={false} sx={{
          height: '100dvh',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          [theme.breakpoints.down("md")]: {
            pl: "10px",
            pr: '10px'
          },
          position: 'relative',
        }}>
          <UserProvider>
            {children}
          </UserProvider>
        </Container>

      </Paper>
    </GlobalErrorProvider>
  )
}
