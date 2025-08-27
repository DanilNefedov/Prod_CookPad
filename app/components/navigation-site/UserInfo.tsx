'use client'

import { containerUser, textAvatar } from '@/app/(main)/home/styles';
import { avatarSize, centerFlexBlock, textMaxWidth } from '@/app/styles';
import { useAppSelector } from '@/state/hook';
import { Avatar, Box, Tooltip, Typography } from '@mui/material';



export function AboutUser() {
    const userStore = useAppSelector(state => state.user.user)

    return (
        <Box sx={[centerFlexBlock, containerUser]}>
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
                    src={userStore.img } 
                    slotProps={{
                        img: {
                            alt: userStore.name,
                        },
                    }}
                    sx={avatarSize}
                ></Avatar>
            </Tooltip>
            <Typography color='text.disabled' sx={[textMaxWidth, textAvatar]}>{userStore.name}</Typography>
        </Box>
    )
}