import { Button } from '@mui/material'
import { signOut } from '@/config/auth/auth'
import LogoutIcon from '@mui/icons-material/Logout';
import { theme } from '@/config/ThemeMUI/theme';

export function LogOut() {

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
            '& span':{
                display:'none'
            }
        },
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
                <LogoutIcon sx={{mr:'5px',  [theme.breakpoints.down("md")]: {
                    mr:'0'
                },}}></LogoutIcon>
                <span>Sign Out</span> 
            </Button>
        </form>
    )
}