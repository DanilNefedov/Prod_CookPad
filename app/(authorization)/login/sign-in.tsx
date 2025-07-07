'use client'

import Link from "next/link";
import { signInCall } from "./function";
import { useActionState, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Box, Button, TextField, Typography } from "@mui/material";
import { containerLoading, linksAuth, templateHeaderAuth } from "../style";
import { UXLoading } from "@/app/components/ui-helpers/loading";
import { ModalInfo } from "../modal-info";
import { centerFlexBlock } from "@/app/styles";





export function SignInForm() {
    const [state, formAction, isPending] = useActionState(signInCall, { error: false, email: '', success: false });
    const [emailInput, setEmailInput] = useState(state.email);
    const router = useRouter();

    useEffect(() => {
        if (state.success) {
            router.push('/home');
        }
    }, [state.success, router]);



    useEffect(() => {
        if (state.email) setEmailInput(state.email);
    }, [state.email]);


    return (
        <>
            {isPending && (
                <Box sx={containerLoading}>
                    <UXLoading />
                </Box>
            )}

            <form
                style={{ width: '100%', marginTop: '10px' }}
                action={formAction}
            >
                {state.error && (
                    <Typography sx={{ color: 'error.main', textAlign: 'center' }}>
                        Check the data you have entered. You may not be registered yet.<br />
                    </Typography>
                )}
                <Box sx={[centerFlexBlock, { gap: '20px' }]}>
                    <Typography sx={templateHeaderAuth}>
                        Or sign in with email
                    </Typography>
                    <ModalInfo></ModalInfo>
                </Box>
                <TextField
                    margin="normal"
                    fullWidth
                    label="Email Address"
                    autoComplete="off"
                    name="email"
                    type="email"
                    error={state.error}
                    value={emailInput}
                    onChange={(e) => setEmailInput(e.target.value)}
                />
                <TextField
                    margin="normal"
                    autoComplete="new-password"
                    fullWidth
                    name="password"
                    label="Password"
                    type="password"
                    error={state.error}
                />
                <Button
                    type="submit"
                    fullWidth
                    variant="contained"
                    color="blackRedBtn"
                    disabled={isPending}
                    sx={{ mt: 2, fontSize: '16px' }}
                >
                    {isPending ? 'Signing in...' : 'Sign in'}
                </Button>
                <Typography href={'/register'} component={Link} sx={linksAuth}>
                    Create a new Account
                </Typography>
            </form>
        </>


    )
}