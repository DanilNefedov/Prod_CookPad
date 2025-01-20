'use client'

import { useAppSelector } from '@/state/hook';
import { Avatar, Box, Tooltip, Typography } from '@mui/material';
import Image from 'next/image';



export function AboutUser() {
    const userStore = useAppSelector(state => state.user)

   

    // console.log(userStore.user.img)
    return (
        <Box sx={{ display: 'flex', alignItems: 'center', textAlign: 'center', width:'100%', justifyContent:'center', flexDirection:'column', }}>
            <Tooltip title={userStore.user.name}>
                <Avatar src={userStore.user.img} sx={{ width: 45, height: 45 }}></Avatar>
                {/* {userStore.user.img === '' ? <Avatar sx={{ width: 45, height: 45 }}>!</Avatar> :
                <Avatar src={userStore.user.img} sx={{ width: 45, height: 45 }}></Avatar>} */}
                {/* <Avatar src={userStore.user.img} sx={{ width: 45, height: 45 }}></Avatar> */}
                {/* <Image src={userStore.user.img} alt={userStore.user.name}></Image> */}
            </Tooltip>
            <Typography fontWeight='600' mt={1} color='text.secondary' sx={{
                maxWidth: '90px',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
            }}>{userStore.user.name}</Typography>
        </Box>
    )
}