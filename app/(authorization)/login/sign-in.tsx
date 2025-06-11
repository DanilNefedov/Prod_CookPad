'use client'

import { Box, Button, TextField, Typography } from "@mui/material";
import Link from "next/link";
import { regiterIntup } from "../style";
import { signIn } from "@/config/auth/auth";
import { signInCall } from "./function";
import { useActionState, useEffect, useState } from "react";





export function SignInForm() {
    const [emailInput, setEmailInput] = useState('');
    const [state, formAction] = useActionState(signInCall, { error: false, email: '' });

    useEffect(() => {
        if (state.email) setEmailInput(state.email);
    }, [state.email]);


    console.log(state)
    return (
        <form
            style={{ width: '100%', marginTop: '20px' }}
            action={formAction}
        >
            {state.error && (
                <Box sx={{ color: '#FF7269', textAlign: 'center' }}>
                    {state.error && <>Check the data you have entered. You may not be registered yet.<br /></>}
                </Box>
            )}

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
                error={state.error}
                value={emailInput}
                onChange={(e) => setEmailInput(e.target.value)}
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
                error={state.error}
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
                color="grayButton"
                sx={{ mt: 2, fontWeight: 600, borderRadius: "10px",  }}
            >
                Sign in
            </Button>


            <Link className="link-register" href={'/register'}>Create a new Account</Link>
        </form>
    )
}