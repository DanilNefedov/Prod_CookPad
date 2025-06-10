"use client"


import { Avatar, Box, Button, TextField, Typography } from "@mui/material";
import Link from "next/link";
import { handleRegister, registerAndSignIn } from "./function";
import '../style.css';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import { signIn } from "@/config/auth/auth";
import { useActionState } from "react";




export default function Register() {
  const [state, formAction] = useActionState(registerAndSignIn, { error: null })
  // const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  
 const regiterIntup = {
  '& .MuiFormLabel-root': {
    color: 'white'
  },
  '& .MuiInputBase-input': {
    p: '10px 14px'
  },
  '& .MuiInputBase-root': {
    backgroundColor: "#696d78",
  },
  '& .MuiOutlinedInput-notchedOutline': {
    border: '1px solid #b3b9c3'
  },
  '& .MuiInputLabel-root.Mui-focused': {
    color: 'white',
  },
}
  console.log(state)
  return (
    <form
      style={{ width: '100%', marginTop: '20px' }}
      // action={formAction}

      action={formAction}
    >
      
      {/* {state.error?.server && (
        <Box sx={{ color: 'red', textAlign: 'center', mb: 2 }}>
          Whoa, something's wrong. Check the data or the connection.
        </Box>
      )} */}
      <Typography
        sx={{ textAlign: "center", fontWeight: "600", padding: "15px 0", fontSize: "1.2rem" }}
        color="text.primary"
      >
        Register with email
      </Typography>

      <TextField
        margin="normal"
        // error={state.error?.name}
        // required
        fullWidth
        label="Your name"
        autoComplete="off"
        name="name"
        type="text"
        slotProps={{
          inputLabel: {
            shrink: true,
          },
        }}
        sx={regiterIntup}
      />
      <TextField
        margin="normal"
        // required
        fullWidth
        label="Email Address"
        autoComplete="off"
        // error={state.error?.email}
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
        // error={state.error?.password}
        label="Password"
        type="password"
        slotProps={{
          inputLabel: {
            shrink: true,
          },
        }}
        sx={regiterIntup}
      />

      <Box sx={{display:'flex', alignItems:'center', justifyContent:'center', mt:'10px'}}>
        <Avatar
          alt="User avatar"
          // src={avatarPreview !== null ? avatarPreview : ''} 
          sx={{ width: 45, height: 45, mr: 2 }}
        />
        

        <Button
          color="darkButton"
          component="label"
          role={undefined}
          variant="contained"
          tabIndex={-1}
          startIcon={<CloudUploadIcon />}
          
        >
          Upload avatar
          {/* <VisuallyHiddenInput
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) {
                const url = URL.createObjectURL(file);
                // setAvatarPreview(url);
              }
            }}
            name="image"
            type="file"
          /> */}
        </Button>
      </Box>
      

      <Button
        type="submit"
        fullWidth
        variant="contained"
        color="darkButton"
        sx={{ mt: 2, fontWeight: 600, borderRadius: "10px" }}
      >
        Register
      </Button>


      <Link className="link-register" href={'/login'}>Back to the Login</Link>
    </form>
  )
}
