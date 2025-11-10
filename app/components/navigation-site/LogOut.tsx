'use client'

import LogoutIcon from '@mui/icons-material/Logout';
import { useRouter } from 'next/navigation';
import { useAppDispatch } from '@/state/hook';
import { RESET_APP } from '@/state/store';
import { signOut } from 'next-auth/react';
import { exitButton, exitIcon } from '@/app/(main)/home/styles';
import { Button } from '@mui/material';
import { clearCachedUser } from '@/app/helpers/user-data-cashe';

export function LogOut() {
    const dispatch = useAppDispatch()
    const router = useRouter()

    const handleLogout = async () => {
        await signOut({ redirect: false })
        clearCachedUser()
        dispatch({ type: RESET_APP })
        router.push('/login')
    }



    return (
        <Button
            color='grayButton' 
            type="submit"
            sx={exitButton}
            onClick={handleLogout}
        >
            <LogoutIcon sx={exitIcon}></LogoutIcon>
            <span>Sign Out</span> 
        </Button>
    )
}