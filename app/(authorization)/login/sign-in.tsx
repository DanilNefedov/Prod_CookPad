'use client'

import Link from "next/link";
import { signInCall } from "./function";
import { useActionState, useEffect, useState} from "react";
import { useRouter } from "next/navigation";
import { Box, Button, TextField, Typography } from "@mui/material";
import { regiterIntup } from "../style";
import { UXLoading } from "@/app/components/ux-helpers/loading";
import { ModalInfo } from "../modal-info";





export function SignInForm() {
    const [state, formAction, isPending] = useActionState(signInCall, { error: false, email: '', success: false });
    const [emailInput, setEmailInput] = useState(state.email);
    const router = useRouter();

    useEffect(() => {
        if (state.success) {
            router.push('/home');
        }
    }, [state.success]);

    
    
    useEffect(() => {

        if (state.email) setEmailInput(state.email);
        
    }, [state.email]);


    return (
        <>
            {   
                isPending ? 
                <Box sx={{position:'absolute', top:'0', bottom:'0', width:'100%', height:'100%', zIndex:'9999', bgcolor: 'rgba(0, 0, 0, 0.5)'}}>
                    <UXLoading></UXLoading>
                </Box> 
                : null
            }

            <form
                style={{ width: '100%', marginTop: '20px' }}
                action={formAction}
            >
                

                {state.error && (
                    <Box sx={{ color: '#FF7269', textAlign: 'center' }}>
                        Check the data you have entered. You may not be registered yet.<br />
                    </Box>
                )} 
                <Box sx={{display:'flex', alignItems:'center', gap:'20px', justifyContent:'center'}}>
                    <Typography
                        sx={{ textAlign: "center", fontWeight: "600", padding: "15px 0", fontSize: "1.2rem" }}
                        color="text.primary"
                    >
                        Or sign in with email
                    </Typography>
                    <ModalInfo></ModalInfo>
                </Box>
                

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
                    disabled={isPending}
                    sx={{ mt: 2, fontWeight: 600, borderRadius: "10px" }}
                >
                    {isPending ? 'Signing in...' : 'Sign in'}
                </Button>
                <Link className="link-register" href={'/register'}>Create a new Account</Link>
            </form>
        </>

        
    )
}