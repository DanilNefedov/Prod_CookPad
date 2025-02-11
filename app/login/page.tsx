import { signIn } from "@/config/auth/auth"
import { Button, Container, Typography } from "@mui/material"


export default function SignIn() {
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
        lignItems: 'center', 
      }}
    >
      <form
        action={async (formData: FormData) => {
          "use server";
          const provider = formData.get("provider") as string;
          console.log(provider);
          await signIn(provider, { redirectTo: "/home" });
        }}
      >
        <Typography
          sx={{ textAlign: "center", fontWeight: "600", padding: "15px 0", fontSize: "1.3rem" }}
          color="text.primary"
        >
          Sign in with
        </Typography>

        <Button
          type="submit"
          variant="contained"
          fullWidth
          name="provider"
          value="google"
          color="darkButton"
          sx={{ fontWeight: "700", borderRadius: "10px"}}
        >
          Google
        </Button>

        <Typography
          sx={{ textAlign: "center", fontWeight: "600", padding: "15px 0", fontSize: "1.3rem" }}
          color="text.primary"
        >
          or
        </Typography>

        <Button
          type="submit"
          variant="contained"
          fullWidth
          name="provider"
          value="discord"
          color="darkButton"
          sx={{ fontWeight: "700", borderRadius: "10px" }}
        >
          Discord
        </Button>
      </form>



    </Container>
  )
} 