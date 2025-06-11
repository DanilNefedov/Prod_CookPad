"use client"


import { Avatar, Box, Button, TextField, Typography } from "@mui/material";
import Link from "next/link";
import { registerAndSignIn } from "./function";
import '../style.css';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import { useActionState, useState } from "react";
import { VisuallyHiddenInput } from "@/app/(main)/new-recipe/style";

export const regiterIntup = {
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


export default function Register() {
  const [state, formAction] = useActionState(registerAndSignIn, { error: null })
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [sizeAvatar, setSizeAvatar] = useState<boolean>(false)

  console.log(sizeAvatar, state)
  return (
    <form
      style={{ width: '100%', }}
      action={formAction}
    >

      {state.error && (
        <Box sx={{ color: '#FF7269', textAlign: 'center' }}>
          {(state.error.server || state.error.post) && <>Whoa, something's wrong.<br />Check the data or the connection.</>}
          {state.error.name && <>Enter the correct name.<br /></>}
          {(state.error.avatar || sizeAvatar) && <>Check your avatar or connection.<br /></>}
          {state.error.email && <>Email already used or invalid input.<br /></>}
          {state.error.password && <>Enter the password correctly.<br /></>}
        </Box>
      )}


      <Typography
        sx={{ textAlign: "center", fontWeight: "600", padding: "15px 0", fontSize: "1.2rem" }}
        color="text.primary"
      >
        Register with email
      </Typography>

      <TextField
        margin="normal"
        error={state.error?.name}
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
        helperText={
          "*Name: 1-15 letters & numbers"
        }
        sx={[regiterIntup, {'& .MuiFormHelperText-root':{color:'#c2c6cf'}}]}
      />
      <TextField
        margin="normal"
        // required
        fullWidth
        label="Email Address"
        autoComplete="off"
        error={state.error?.email}
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
        error={state.error?.password}
        label="Password"
        type="password"
        slotProps={{
          inputLabel: {
            shrink: true,
          },
          
        }}
        sx={[regiterIntup, {'& .MuiFormHelperText-root':{color:'#c2c6cf'}}]}
        helperText={
          "*Password: 4-8 chars, needs A-Z and 0-9"
        }
      />

      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mt: '10px', position:'relative', mb:'23px' }} >
        <Typography variant="body1" sx={{position:'absolute', bottom:'-23px', left:'calc(50% - 79px)', fontSize:'12px', color:sizeAvatar ? '#FF7269' : '#c2c6cf'}}>{'*JPG, PNG, SVG — max 1 MB'}</Typography>

        <Avatar
          alt="User avatar"
          src={avatarPreview !== null ? avatarPreview : ''} 
          sx={{ width: 45, height: 45, mr: 2,}}
          
        />


        <Button
          color="grayButton"
          component="label"
          role={undefined}
          variant="contained"
          tabIndex={-1}
          startIcon={<CloudUploadIcon />}
          
        >
          Upload avatar
          <VisuallyHiddenInput
            accept=".jpg,.png,.svg"
            onChange={(e) => {
              const file = e.target.files?.[0];

              if (!file) return;

              const maxSize = 1 * 1024 * 1024; // 1MB

              if (file.size > maxSize) {
                setSizeAvatar(true)
                e.target.value = '';
                return;
              }

              setSizeAvatar(false)
              const url = URL.createObjectURL(file);
              setAvatarPreview(url);
              
            }}
            name="image"
            type="file"
            
          />
        </Button>
      </Box>


      <Button
        type="submit"
        fullWidth
        variant="contained"
        color="grayButton"
        sx={{ mt: 2, fontWeight: 600, borderRadius: "10px" }}
      >
        Register
      </Button>


      <Link className="link-register" href={'/login'}>Back to the Login</Link>
    </form>
  )
}
