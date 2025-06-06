'use client'


import { Box, Button, TextField, Typography } from "@mui/material";
import Link from "next/link";
import { useActionState } from "react";
import { hash } from "bcryptjs";
import { v4 as uuidv4 } from 'uuid';
import { signIn } from "@/config/auth/auth";
import { handleRegister } from "./function";
import { useFormState } from "react-dom";





export default function Register() {
  const [state, formAction] = useActionState(handleRegister, { error: null })

  return (
    <form
      style={{ width: '100%', marginTop: '20px' }}
      action={formAction}
    >
      
      {state.error && (
        <Box sx={{ color: 'red', textAlign: 'center', mb: 2 }}>
          {state.error}
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
        Register
      </Button>


      <Link href={'/login'}>Back to Login</Link>
    </form>
  )
}
