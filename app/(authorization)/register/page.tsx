"use client"


import { Avatar, Box, Button, TextField, Typography } from "@mui/material";
import Link from "next/link";
import { registerAndSignIn, uploadFile } from "./function";
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import { startTransition, useActionState, useState } from "react";
import { UXLoading } from "@/app/components/ui-helpers/loading";
import { v4 as uuidv4 } from 'uuid';
import { ModalInfo } from "../modal-info";
import { InputErrorState, RegisterFormData } from "../types";
import { avatar, containerAvatar, containerLoading, helperTextAvatar, linksAuth, templateHeaderAuth } from "../styles";
import { centerFlexBlock, InputForMedia } from "@/app/styles";


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
        isLoading &&
        <Box sx={containerLoading}>
          <UXLoading></UXLoading>
        </Box>
      }
      <form
        style={{ width: '100%' }}
        onSubmit={handleSubmit}
      >
        <Box sx={{ color: "error.main", textAlign: "center" }}>
          {(state.error?.server || state.error?.post) && <>Whoa, something's wrong.<br />Check the data or the connection.</>}
          {inputErrorState.name && <>Enter the correct name.<br /></>}
          {inputErrorState.image && <>Check your avatar or connection.<br /></>}
          {sizeAvatar && <>Your avatar is not supported.<br /></>}
          {state.error?.email && <>Email already used or invalid input.<br /></>}
          {inputErrorState.password && <>Enter the password correctly.<br /></>}
        </Box>

        <Box sx={[centerFlexBlock, { gap: '20px' }]}>
          <Typography sx={templateHeaderAuth}>
            Register with your email
          </Typography>
          <ModalInfo></ModalInfo>
        </Box>

        <TextField
          error={inputErrorState.name}
          margin="normal"
          fullWidth
          autoComplete="off"
          label="Your name"
          name="name"
          type="text"
          helperText={
            "*Name: 1-15 letters & numbers"
          }
          sx={{ marginBottom: '0', '& .MuiFormHelperText-root': { color: 'text.disabled' } }}
        />
        <TextField
          margin="normal"
          fullWidth
          label="Email Address"
          autoComplete="off"
          error={state.error?.email}
          name="email"
          type="email"
        />
        <TextField
          margin="normal"
          autoComplete="new-password"
          fullWidth
          name="password"
          error={inputErrorState.password}
          label="Password"
          type="password"
          sx={{ '& .MuiFormHelperText-root': { color: 'text.disabled' } }}
          helperText={
            "*Password: 4-8 chars, needs A-Z and 0-9"
          }
        />

        <Box sx={[centerFlexBlock, containerAvatar]} >
          <Typography variant="body1" sx={[helperTextAvatar,
            { color: sizeAvatar || inputErrorState.image ? 'error.main' : 'text.disabled' }
          ]}
          >{'*JPG, PNG, SVG — max 1 MB'}</Typography>
          <Avatar
            alt="User avatar"
            src={avatarPreview !== null ? avatarPreview : ''}
            sx={avatar}
          />
          <Button
            color="blackRedBtn"
            component="label"
            role={undefined}
            variant="contained"
            tabIndex={-1}
            startIcon={<CloudUploadIcon />}
          >
            Upload avatar
            <Box
              component="input"
              type="file"
              accept=".jpg,.png,.svg"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (!file) return;

                if (file.size > 1024 * 1024) {
                  setSizeAvatar(true);

                } else {
                  setSizeAvatar(false);
                  setAvatarPreview(URL.createObjectURL(file));
                }
              }}
              name="image"
              sx={InputForMedia}
            />
            {/* <InputForMedia
              accept=".jpg,.png,.svg"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (!file) return;

                if (file.size > 1024 * 1024) {
                  setSizeAvatar(true);

                } else {
                  setSizeAvatar(false);
                  setAvatarPreview(URL.createObjectURL(file));
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
          color="blackRedBtn"
          sx={{ mt: 2, fontSize: '16px' }}
        >
          Register
        </Button>

        <Typography href={'/login'} component={Link} sx={linksAuth}>
          Back to the Login
        </Typography>
      </form>
    </>


  )
}
