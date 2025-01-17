import { Container, Paper } from "@mui/material";


export default function RootLayout({ children, }: Readonly<{ children: React.ReactNode; }>) {
  const styledPaperHome = {
    backgroundColor: 'secondary.main',
    borderRadius: '20px 0 0 20px',
    color: 'text.primary',
    width: "calc(100% - 140px)",
  }

  



  return (
    <>
      {/* <NavigationSite></NavigationSite> */}
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
