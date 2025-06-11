import { signIn } from "@/config/auth/auth"
import { Box, Button, Typography } from "@mui/material"
import '../style.css';
import { SignInForm } from "./sign-in";








export default function SignIn() {
 




  return (
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


        <Box sx={{display:'flex', gap:'15px'}}>
          <Button
            type="submit"
            variant="contained"
            fullWidth
            name="provider"
            value="google"
            color="grayButton"
            sx={{ fontWeight: "700", borderRadius: "10px", width: "100%", }}
          >
            
            Google
          </Button>
  
          <Button
            type="submit"
            variant="contained"
            fullWidth
            name="provider"
            value="discord"
            color="grayButton"
            sx={{ fontWeight: "700", borderRadius: "10px", width: "100%", }}
          >
            Discord
          </Button>
        </Box>
      
      </form>



      <SignInForm></SignInForm>
      {/* <form
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
          // required
          fullWidth
          label="Email Address"
          autoComplete="off"
          name="email"
          type="email"
          slotProps={{
            inputLabel: {
              shrink: true,
            },
          }}
          sx={regiterIntup}
        />
        <TextField
          margin="normal"
          autoComplete="new-password"
          // required
          fullWidth
          name="password"
          label="Password"
          type="password"
          slotProps={{
            inputLabel: {
              shrink: true,
            },
          }}
          sx={regiterIntup}
        />

        <Button
          type="submit"
          fullWidth
          variant="contained"
          color="darkButton"
          sx={{ mt: 2, fontWeight: 600, borderRadius: "10px" }}
        >
          Sign in
        </Button>


        <Link className="link-register" href={'/register'}>Create a new Account</Link>
      </form> */}
    </>


    // </Container>
  )
} 