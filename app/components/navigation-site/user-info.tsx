'use client'

import { theme } from '@/config/ThemeMUI/theme';
import { useAppSelector } from '@/state/hook';
import { Avatar, Box, Tooltip, Typography } from '@mui/material';



export function AboutUser() {
    const userStore = useAppSelector(state => state.user.user)

    return (
        <Box sx={{ display: 'flex', alignItems: 'center', textAlign: 'center', width:'100%', justifyContent:'center', flexDirection:'column',}}>
            <Tooltip title={userStore.name}>
                {/* {userStore.img ? (
                    <Image
                    alt={userStore.name}
                    src={userStore.img}
                    width={45}
                    height={45}
                    style={{ borderRadius: '50%' }}
                    />
                ) : null} */}
                <Avatar 
                alt={userStore.name}
                src={userStore.img } 
                slotProps={{
                    img: {
                        alt: userStore.name,
                    },
                }}
                sx={{ 
                    width: 45, 
                    height: 45,
                    [theme.breakpoints.down("md")]: {
                        width:35,
                        height: 35,
                    },
                }}></Avatar>
            </Tooltip>
            <Typography fontWeight='600' mt={1} color='text.secondary' sx={{
                maxWidth: '90px',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',

                [theme.breakpoints.down("md")]: {
                    display:'none'
                },
            }}>{userStore.name}</Typography>
        </Box>
    )
}