"use client";

import { createContext, useContext, useEffect } from "react";
import { useAppDispatch, useAppSelector } from "@/state/hook";
import { Box, Typography } from "@mui/material";
import { useSession } from "next-auth/react";
import { fetchUser } from "@/state/slices/user-slice";
import { theme } from "@/config/ThemeMUI/theme";

type UserContextType = {
    error: boolean;
};

const UserContext = createContext<UserContextType>({ error: false });

export const useUserContext = () => useContext(UserContext);

export function UserProvider({ children }: { children: React.ReactNode }) {
    const error = useAppSelector((state) => state.user.operations.fetchUser.error);
    const dispatch = useAppDispatch();
    const { data: session, update } = useSession();
    const connection_id = session?.user?.connection_id;

    useEffect(() => {
        const fetchAndUpdate = async () => {
            await update();

            if (connection_id) {
                dispatch(fetchUser(connection_id));
            }
        };

        fetchAndUpdate();
    }, [dispatch, connection_id]);

    if (error) {
        return (
            <Box
                height="100dvh"
                display="flex"
                justifyContent="center"
                alignItems="center"
                flexDirection="column"
                sx={{ textAlign: "center", px: 2 }}
            >
                <Typography variant="h1" color="error" sx={{fontSize:"30px", pb:'20px', [theme.breakpoints.down("md")]: {fontSize:'25px'}}}>
                    Failed to load user data.
                </Typography>
                <Typography variant="subtitle2" color="error" sx={{fontSize:"20px", maxWidth:'520px', [theme.breakpoints.down("md")]: {fontSize:'16px',  maxWidth:'300px'}}}>
                    There may be a problem with the internet or authorization.
                    Try reloading the page or logging in again.
                </Typography>
            </Box>
        );
    }

    return (
        <UserContext.Provider value={{ error }}>
            {children}
        </UserContext.Provider>
    );
}
