import { signOut } from 'next-auth/react'
import NextLink from 'next/link'
import { Button } from '@mui/material'


export function LogOut() {

    const styleLink = {
        // fontWeight:'400', 
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
            <button type="submit">Sign Out</button>
        </form>
        
        // <Button variant="contained" color='secondary' 
        // sx={styleLink} 
        // component={NextLink} 
        // href='/' onClick={() => signOut()}>
        //     Sign Out
        // </Button>
    )
}