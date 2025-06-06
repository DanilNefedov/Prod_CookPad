import { signIn } from "@/config/auth/auth"
import { Button, Container, TextField, Typography } from "@mui/material"
import Link from "next/link";


export default function SignIn() {
  return (

    // <Container component="main" maxWidth="xs"
    //   sx={{
    //     backgroundColor: 'background.paper',
    //     borderRadius: '20px',
    //     height: '500px',
    //     margin: 'auto',
    //     display: 'flex',
    //     flexDirection: 'column',
    //     justifyContent: 'center',
    //     alignItems: 'center',
    //   }}
    // >
    <>
      <form
        style={{ width: '100%' }}
        action={async (formData: FormData) => {
          "use server";
          const provider = formData.get("provider") as string;

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
          sx={{ fontWeight: "700", borderRadius: "10px", width: "100%" }}
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
          sx={{ fontWeight: "700", borderRadius: "10px", width: "100%", }}
        >
          Discord
        </Button>



      </form>




      <form
        style={{ width: '100%', marginTop: '20px' }}
        action={async (formData: FormData) => {
          "use server";
          const email = formData.get("email") as string;
          const password = formData.get("password") as string;

          await signIn("credentials", {
            email,
            password,
            redirectTo: "/home",
          });
        }}
      >
        <Typography
          sx={{ textAlign: "center", fontWeight: "600", padding: "15px 0", fontSize: "1.2rem" }}
          color="text.primary"
        >
          Or sign in with email
        </Typography>

        <TextField
          margin="normal"
          required
          fullWidth
          label="Email Address"
          name="email"
          type="email"
        />
        <TextField
          margin="normal"
          required
          fullWidth
          name="password"
          label="Password"
          type="password"
        />

        <Button
          type="submit"
          fullWidth
          variant="contained"
          color="primary"
          sx={{ mt: 2, fontWeight: 600, borderRadius: "10px" }}
        >
          Sign in
        </Button>


        <Link href={'/register'}>Create a new Account</Link>
      </form>
    </>


    // </Container>
  )
} 