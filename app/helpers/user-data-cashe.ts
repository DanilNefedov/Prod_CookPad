import { auth } from "@/config/auth/auth";
import { Session } from "next-auth";



let cachedSession: Session | null = null;

/*
    Returns the user's connection_id or null if the user is logged out
    Caches the session to avoid calling auth() unnecessarily
*/
export async function getUserId(): Promise<string | null> {
    console.log('cachedSessioncachedSession', cachedSession)

    if (cachedSession !== null ) return cachedSession.user.connection_id;

    const session = await auth();

    console.log(session, 'dontwork')
    if (!session) {
        clearCachedUser();
        return null;
    }

    cachedSession = session;
    return session.user.connection_id;
}


export function clearCachedUser() {
    cachedSession = null;
}