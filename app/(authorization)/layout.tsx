import { Container } from "@mui/material";
import { layoutAuth } from "./style";




export default function RootLayout({ children, }: Readonly<{ children: React.ReactNode; }>) {
  return (
    <Container component="main" maxWidth="xs"
      sx={layoutAuth}
    >{ children }</Container>
  );
}
