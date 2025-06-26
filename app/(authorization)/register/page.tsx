"use client"


import { Avatar, Box, Button, TextField, Typography } from "@mui/material";
import Link from "next/link";
import { registerAndSignIn, uploadFile } from "./function";
import '../style.css';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import { startTransition, useActionState, useState } from "react";
import { VisuallyHiddenInput } from "@/app/(main)/new-recipe/style";
import { UXLoading } from "@/app/components/ui-helpers/loading";
import { v4 as uuidv4 } from 'uuid';
import { regiterIntup } from "../style";
import { ModalInfo } from "../modal-info";
import { InputErrorState, RegisterFormData } from "../types";


export default function Register() {
  const [state, formAction] = useActionState(registerAndSignIn, { error: null });
  const [isLoading, setIsLoading] = useState(false);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [sizeAvatar, setSizeAvatar] = useState(false);
  const [inputErrorState, setInputErrorState] = useState<InputErrorState>({
    email: false,
    password: false,
    name: false,
    image: false,
  });

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsLoading(true)

    const formData = new FormData(event.currentTarget);

    const email = formData.get("email")?.toString().trim() || "";
    const password = formData.get("password")?.toString().trim() || "";
    const name = formData.get("name")?.toString().trim() || "";
    const imageFile = formData.get("image") as File | null;
    const connection_id = uuidv4();

    const fieldErrors: InputErrorState = {
      email: !email || !/^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/.test(email),
      password: !password || !/^(?=.*[A-Z])(?=.*\d)[A-Za-z\d]{4,8}$/.test(password),
      name: !name || !/^[A-Za-z0-9 ]{1,15}$/.test(name),
      image: false,
    };

    const hasValidationError = Object.values(fieldErrors).some(Boolean);
    if (hasValidationError) {
      setInputErrorState(fieldErrors);
      setIsLoading(false);
      return;
    }

    let imageUrl = "";
    if (imageFile instanceof File && imageFile.size > 0) {
      try {
        imageUrl = await uploadFile({ connection_id, image: imageFile }); 
      } catch (e) {
        fieldErrors.image = true;
      }
    }


    if (fieldErrors.image) {
      setInputErrorState(prev => ({ ...prev, ...fieldErrors }));
      setIsLoading(false);
      return;
    }

    const serverFormData: RegisterFormData = {
      email,
      password,
      name,
      image: imageUrl,
      connection_id,
    };

    startTransition(() => {
      formAction(serverFormData);
      setIsLoading(false);
    });
    // await formAction(serverFormData);
  }

  return (
    <>
      {
        isLoading ?
          <Box sx={{ position: 'absolute', top: '0', bottom: '0', width: '100%', height: '100%', zIndex: '9999', bgcolor: 'rgba(0, 0, 0, 0.5)' }}>
            <UXLoading></UXLoading>
          </Box>
          : null
      }


      <form
        style={{ width: '100%' }}
        onSubmit={handleSubmit}
      >

        
        {/* {state.error && ( */}
        <Box sx={{ color: "#FF7269", textAlign: "center" }}>
          {(state.error?.server || state.error?.post) && <>Whoa, something's wrong.<br />Check the data or the connection.</>}
          {inputErrorState.name && <>Enter the correct name.<br /></>}
          {inputErrorState.image && <>Check your avatar or connection.<br /></>}
          {sizeAvatar && <>Your avatar is not supported.<br /></>}
          {state.error?.email && <>Email already used or invalid input.<br /></>}
          {inputErrorState.password && <>Enter the password correctly.<br /></>}
        </Box>
        {/* )} */}


        <Box sx={{display:'flex', alignItems:'center', gap:'20px', justifyContent:'center'}}>
          <Typography
            sx={{ textAlign: "center", fontWeight: "600", padding: "15px 0", fontSize: "1.2rem" }}
            color="text.primary"
          >
            Register with your email
          </Typography>
          <ModalInfo></ModalInfo>

        </Box>
        

        <TextField
          margin="normal"
          error={inputErrorState.name}
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
          sx={[regiterIntup, { '& .MuiFormHelperText-root': { color: '#c2c6cf' } }]}
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
          error={inputErrorState.password}
          label="Password"
          type="password"
          slotProps={{
            inputLabel: {
              shrink: true,
            },

          }}
          sx={[regiterIntup, { '& .MuiFormHelperText-root': { color: '#c2c6cf' } }]}
          helperText={
            "*Password: 4-8 chars, needs A-Z and 0-9"
          }
        />

        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mt: '10px', position: 'relative', mb: '23px' }} >
          <Typography variant="body1" sx={{ 
            position: 'absolute', 
            bottom: '-23px', 
            left: 'calc(50% - 79px)', 
            fontSize: '12px', 
            color: sizeAvatar || inputErrorState.image ? '#FF7269' : '#c2c6cf' }}
          >{'*JPG, PNG, SVG — max 1 MB'}</Typography>

          <Avatar
            alt="User avatar"
            src={avatarPreview !== null ? avatarPreview : ''}
            sx={{ width: 45, height: 45, mr: 2, }}

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

                if (file.size > 1024 * 1024) {
                  setSizeAvatar(true);
                  // e.target.value = '';
                  // return;
                }else{
                  setSizeAvatar(false);
                  // setAvatarFile(file);
                  setAvatarPreview(URL.createObjectURL(file));
                }

                
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
          color="darkButton"
          sx={{ mt: 2, fontWeight: 600, borderRadius: "10px" }}
        >
          Register
        </Button>


        <Link className="link-register" href={'/login'}>Back to the Login</Link>
      </form>
    </>


  )
}
