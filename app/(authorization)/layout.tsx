import { Container } from "@mui/material";




export default function RootLayout({ children, }: Readonly<{ children: React.ReactNode; }>) {
  return (
    <Container component="main" maxWidth="xs"
      sx={{
        backgroundColor: 'background.paper',
        borderRadius: '20px',
        height: '500px',
        margin: 'auto',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >{ children }</Container>
  );
}
