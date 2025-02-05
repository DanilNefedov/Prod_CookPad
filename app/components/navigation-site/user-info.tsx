'use client'

import { theme } from '@/config/ThemeMUI/theme';
import { useAppSelector } from '@/state/hook';
import { Avatar, Box, Tooltip, Typography } from '@mui/material';
import Image from 'next/image';



export function AboutUser() {
    const userStore = useAppSelector(state => state.user)

   

    // console.log(userStore.user.img)
    return (
        <Box sx={{ display: 'flex', alignItems: 'center', textAlign: 'center', width:'100%', justifyContent:'center', flexDirection:'column',}}>
            <Tooltip title={userStore.user.name}>
                <Avatar src={userStore.user.img} sx={{ 
                    width: 45, 
                    height: 45,
                    [theme.breakpoints.down("md")]: {
                        width:35,
                        height: 35,
                    },

                    // [theme.breakpoints.down(500)]: {
                    //     width:,
                    //     height: 30,
                    // }


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
            }}>{userStore.user.name}</Typography>
        </Box>
    )
}