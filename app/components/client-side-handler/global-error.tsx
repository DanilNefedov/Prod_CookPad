'use client';

import { Alert, Stack } from '@mui/material';
import { ReactNode, useEffect, useState } from 'react';



export default function GlobalErrorProvider({ children }: { children: ReactNode }) {
    const [globalError, setGlobalError] = useState<string | null>(null);

    useEffect(() => {
        const originalFetch = window.fetch;
        window.fetch = async (...args) => {
            try {
                const res = await originalFetch(...args);
                // if (!res.ok && (res.status === 504 || res.status >= 500)) {
                //   setGlobalError('The server is not responding. Try refreshing the page.');
                // }
                if (res.status === 504) {
                    setGlobalError('The response time has been exceeded. Try again.');
                } else if (res.status === 502) {
                    setGlobalError('Server connection error. Reload the page.');
                } else if (res.status === 503) {
                    setGlobalError('The server is unavailable. Please wait a moment.');
                } else if (res.status === 500) {
                    setGlobalError('Internal server error.');
                }
                return res;
            } catch (error) {
                setGlobalError('Network error. Try again later.');
                throw error;
            }
        };

        return () => {
            window.fetch = originalFetch;
        };
    }, []);

    return (
        <>
            {globalError && (
                <Stack sx={{
                    maxWidth:"250px", 
                    width: '100%',
                    position:'absolute', 
                    bottom:'20px', 
                    right:'20px', 
                    zIndex:"99999",
                    
                }} spacing={2}>
                    <Alert sx={{bgcolor:'#A5514F', color:'#dbcaca'}} onClose={() => {setGlobalError(null)}} severity="error">{globalError}</Alert>
                </Stack> 
            )}
            {children}
        </>
    );
}
