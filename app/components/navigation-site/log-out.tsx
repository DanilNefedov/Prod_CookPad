'use client'

import { Button } from '@mui/material'
import LogoutIcon from '@mui/icons-material/Logout';
import { theme } from '@/config/ThemeMUI/theme';
import { useRouter } from 'next/navigation';
import { useAppDispatch } from '@/state/hook';
import { RESET_APP } from '@/state/store';
import { signOut } from 'next-auth/react';

export function LogOut() {
    const dispatch = useAppDispatch()
    const router = useRouter()

    const styleLink = {
        lineHeight: 'inherit',
        textTransform: 'initial',
        color: 'text.secondary',
        '@media (hover: hover) and (pointer: fine)': {
            ':hover': {
                bgcolor: 'primary.main',
                color: 'text.primary'
            },
        },
        width: '100%',

        [theme.breakpoints.down("md")]: {
            minWidth:'auto',
            ml:'0px',
            p:'5px',
            borderRadius:'0 20px 20px 0',
            width:'40px',
            '& span':{
                display:'none'
            }
        },
    }



    const handleLogout = async () => {
        await signOut({ redirect: false })
        dispatch({ type: RESET_APP })
        router.push('/login')
    }

    return (


        <Button
            variant="contained" 
            color='secondary' 
            type="submit"
            sx={styleLink}
            onClick={handleLogout}
        >
            <LogoutIcon sx={{
                mr:'5px',  
                [theme.breakpoints.down("md")]: {
                    mr:'0'
                },
            }}></LogoutIcon>
            <span>Sign Out</span> 
        </Button>
    )
}