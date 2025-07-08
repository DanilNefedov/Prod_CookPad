import { Container } from "@mui/material";
import { layoutAuth } from "./styles";
import { centerFlexBlock } from "../styles";




export default function RootLayout({ children }: Readonly<{ children: React.ReactNode; }>) {
  return (
    <Container component="main" maxWidth="xs"sx={[layoutAuth, centerFlexBlock]}>
      { children }
    </Container>
  );
}
