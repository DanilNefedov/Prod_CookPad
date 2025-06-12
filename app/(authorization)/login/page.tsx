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
            color="darkButton"
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
            color="darkButton"
            sx={{ fontWeight: "700", borderRadius: "10px", width: "100%", }}
          >
            Discord
          </Button>
        </Box>
      
      </form>



      <SignInForm></SignInForm>
     
    </>
  )
} 