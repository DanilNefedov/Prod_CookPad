import { theme } from "@/config/ThemeMUI/theme";
import { useAppDispatch, useAppSelector } from "@/state/hook";
import { closeErrorWindow } from "@/state/slices/list-recipe-slice";
import { Alert } from "@mui/material";
import { memo, useEffect, useRef, useState } from "react";
import { StatusAlert } from "../../ux-helpers/status-alert";






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

    
    

    const handleClose = () => {
        if (status.error) {
            dispatch(closeErrorWindow('newListRecipe'))
        }
        
        if (showSuccess) {
            setShowSuccess(false);
        }
        
        wasLoading.current = false;
    };
    
    if (!status.error && !status.loading && !showSuccess) return null;

    console.log(status)

    return (
        <StatusAlert error={status.error} loading={status.loading} handleClose={handleClose}></StatusAlert>
            
    );
});