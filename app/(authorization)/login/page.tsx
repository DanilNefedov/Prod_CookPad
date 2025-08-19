import { signIn } from "@/config/auth/auth"
import { Box, Button, Typography } from "@mui/material"
import { SignInForm } from "./SignIn";
import { templateHeaderAuth } from "../styles";








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
        <Typography sx={[templateHeaderAuth, { marginBottom: '10px' }]}>
          Sign in with
        </Typography>
        <Box sx={{ display: 'flex', gap: '15px' }}>
          <Button
            type="submit"
            name="provider"
            value="google"
            color="blackRedBtn"
            sx={{ width: "50%", fontSize: '16px' }}
          >
            Google
          </Button>

          <Button
            type="submit"
            name="provider"
            value="discord"
            color="blackRedBtn"
            sx={{ width: "50%", fontSize: '16px' }}
          >
            Discord
          </Button>
        </Box>
      </form>
      <SignInForm></SignInForm>

    </>
  )
} 