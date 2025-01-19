import NextLink from 'next/link'
import { Button } from '@mui/material'
import { signOut } from '@/config/auth/auth'


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
            >Sign Out</Button>
        </form>
    )
}