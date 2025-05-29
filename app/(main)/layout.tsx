import { Container, Paper } from "@mui/material";
import { NavigationSite } from "../components/navigation-site/navigation";
import { theme } from "@/config/ThemeMUI/theme";
import GlobalErrorProvider from "../components/client-side-handler/global-error";
import { UserProvider } from "../components/user-alert/user-context";




export const metadata = {
  icons: {
    icon: [
      { url: '/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
      { url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
      { url: '/favicon-96x96.png', sizes: '96x96', type: 'image/png' },
      { url: '/android-icon-192x192.png', sizes: '192x192', type: 'image/png' },
    ],
    apple: [
      { url: '/apple-icon-57x57.png', sizes: '57x57', type: 'image/png' },
      { url: '/apple-icon-60x60.png', sizes: '60x60', type: 'image/png' },
      { url: '/apple-icon-72x72.png', sizes: '72x72', type: 'image/png' },
      { url: '/apple-icon-76x76.png', sizes: '76x76', type: 'image/png' },
      { url: '/apple-icon-114x114.png', sizes: '114x114', type: 'image/png' },
      { url: '/apple-icon-120x120.png', sizes: '120x120', type: 'image/png' },
      { url: '/apple-icon-144x144.png', sizes: '144x144', type: 'image/png' },
      { url: '/apple-icon-152x152.png', sizes: '152x152', type: 'image/png' },
      { url: '/apple-icon-180x180.png', sizes: '180x180', type: 'image/png' },
    ],
    shortcut: '/favicon-96x96.png',
  },
  manifest: '/manifest.json',
  
}




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
