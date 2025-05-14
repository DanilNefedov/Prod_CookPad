import { theme } from "@/config/ThemeMUI/theme";
import { useAppDispatch, useAppSelector } from "@/state/hook";
import { closeErrorWindow } from "@/state/slices/list-recipe-slice";
import { Alert } from "@mui/material";
import { memo, useEffect, useRef, useState } from "react";






export const StatusBar = memo(() => {
    const status = useAppSelector(state => state.listRecipe.operations.newListRecipe);
    const dispatch = useAppDispatch();

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

    
    if (!status.error && !status.loading && !showSuccess) return null;

    const handleClose = () => {
        if (status.error) {
            dispatch(closeErrorWindow('newListRecipe'))
        }
        
        if (showSuccess) {
            setShowSuccess(false);
        }
        
        wasLoading.current = false;
    };

    return (
        <Alert 
        onClose={handleClose}
        sx={{
            alignItems: 'center',
            position: 'absolute',
            top: '25px',
            left: '50%',
            transform: 'translateX(-50%)',
            zIndex: 200,
            maxWidth: '380px',
            width: 'fit-content',
            bgcolor: status.loading ? "#0288D1" : status.error ? '#bd3030' : '#388E3C',
            color:'text.primary',
            '& .MuiSvgIcon-root':{
                fill:'#fff'
            },
            '& .MuiAlert-action':{
                mr:'0',
                p:'0 0 0 12px'
            },
            [theme.breakpoints.down('sm')]: {
                maxWidth: '70dvw', 
                width: '100%',
            }

        }}
        severity={status.loading ? "info" : status.error ? 'error' : 'success'}>
            
            {status.loading ? "Loading..." : status.error ? 'Something happened during the recording' : 'Success!'}
        </Alert>
            
    );
});