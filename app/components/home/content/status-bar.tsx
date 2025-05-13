import { useAppSelector } from "@/state/hook";
import { Alert, Box } from "@mui/material";
import { memo, useEffect, useRef, useState } from "react";






export const StatusBar = memo(() => {
    const status = useAppSelector(state => state.listRecipe.operations.preLoaderMain);

    const [showSuccess, setShowSuccess] = useState(false);
    const wasLoading = useRef(false);

    useEffect(() => {
        if (status.loading) {
            wasLoading.current = true;
        }

        if (
            wasLoading.current &&
            !status.loading &&
            !status.error
        ) {
            setShowSuccess(true);
            wasLoading.current = false;

            const timer = setTimeout(() => setShowSuccess(false), 3000); 
            return () => clearTimeout(timer);
        }
    }, [status.loading, status.error]);

    if (status.error && status.loading && showSuccess) return null;

    return (
        <Box>
            {status.loading && <Alert severity="info">loading...</Alert>}
            {status.error && <Alert severity="error">error</Alert>}
            {showSuccess && <Alert severity="success">success!</Alert>}
        </Box>
    );
});