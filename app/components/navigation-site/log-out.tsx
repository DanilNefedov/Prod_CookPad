import NextLink from 'next/link'
import { Button } from '@mui/material'
import { signOut } from '@/config/auth/auth'
import LogoutIcon from '@mui/icons-material/Logout';
import { theme } from '@/config/ThemeMUI/theme';

export function LogOut() {

    const styleLink = {
        lineHeight: 'inherit',
        textTransform: 'initial',
        color: 'text.secondary',
        ':hover': {
            bgcolor: 'primary.main',
            color: 'text.primary'
        },
        width: '100%',

        [theme.breakpoints.down("md")]: {
            ml:'-16px',
            pl:'20px'
        },

        '& span':{
            [theme.breakpoints.down("md")]: {
                display:'none'
            },
        }
    }

    return (
        <form
            action={async () => {
                "use server"
                await signOut({ redirectTo: '/login' })
            }}
        >
            <Button 
                variant="contained" 
                color='secondary' 
                type="submit"
                sx={styleLink}
            >
                <LogoutIcon sx={{mr:'5px'}}></LogoutIcon>
                <span>Sign Out</span> 
            </Button>
        </form>
    )
}