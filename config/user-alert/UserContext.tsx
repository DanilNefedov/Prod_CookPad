"use client";

import { createContext, useContext, useEffect } from "react";
import { useAppDispatch, useAppSelector } from "@/state/hook";
import { Box, Typography } from "@mui/material";
import { useSession } from "next-auth/react";
import { fetchUser } from "@/state/slices/user-slice";
import { centerFlexBlock, userAlertHeader, userAlertSubtitle, userLertBox } from "@/app/styles";

type UserContextType = {
    error: boolean;
};

const UserContext = createContext<UserContextType>({ error: false });

export const useUserContext = () => useContext(UserContext);

export function UserProvider({ children }: { children: React.ReactNode }) {
    const error = useAppSelector((state) => state.user.operations.fetchUser.error);
    const dispatch = useAppDispatch();
    const { data: session, update } = useSession();
    const connection_id = session?.user.connection_id;

    useEffect(() => {
        const fetchAndUpdate = async () => {
            await update();// eslint error. asks to put a function into a dependency

            if (connection_id) {
                dispatch(fetchUser(connection_id));
            }
        };

        fetchAndUpdate();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [dispatch, connection_id]);

    if (error) {
        return (
            <Box
                sx={[centerFlexBlock, userLertBox]}
            >
                <Typography variant="h1" color="error" sx={userAlertHeader}>
                    Failed to load user data.
                </Typography>
                <Typography variant="subtitle2" color="error" sx={userAlertSubtitle}>
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
