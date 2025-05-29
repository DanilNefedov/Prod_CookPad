import { useCallback } from 'react';




export function usePingGate() {
    const withPingCheck = useCallback(async (callback: () => void) => {
        try {
            const res = await fetch('/api/ping');
            if (res.ok) {
                callback();
            } else {
                console.warn('Server not ready after ping.');
            }
        } catch (err) {
            console.warn('Ping failed:', err);
        }
    }, []);

    return withPingCheck;
}
