'use client';

import { useEffect, useRef } from 'react';
import { useSnackbar, SnackbarKey } from 'notistack';
import { Alert, Slide, SlideProps } from '@mui/material';
import { useAppDispatch, useAppSelector } from '@/state/hook';
import { RootState } from '@/state/store';



export type OperationConfig<K extends string = string> = {
    sliceSelector: (state: RootState) => Record<K, { error: boolean; loading: boolean }>;
    successMessages: Partial<Record<K, string>>;
    errorMessages: Partial<Record<K, string>>;
    loadingMessages: Partial<Record<K, string>>;
    closeErrorAction: (key: string) => void;
};




const SlideTransition = (props: SlideProps) => <Slide {...props} direction="down" />;


type AnyOperationConfig = OperationConfig<string>;

type GlobalStatusNotifierProps = {
  operationConfigs: AnyOperationConfig[];
};

export function GlobalStatusNotifier<K extends string = string>({ operationConfigs }: GlobalStatusNotifierProps) {
    const dispatch = useAppDispatch();
    const { enqueueSnackbar, closeSnackbar } = useSnackbar();

    const allOperations = operationConfigs.map(config => useAppSelector(config.sliceSelector));
    const operationsByConfig = operationConfigs.map((config, index) => ({
        operations: allOperations[index],
        config
    }));
    
    const duration = 3000;

    const shownRef = useRef<Record<K, boolean>>({} as Record<K, boolean>);
    const wasLoadingRef = useRef<Record<K, boolean>>({} as Record<K, boolean>);
    const shownLoadingRef = useRef<Record<K, SnackbarKey | null>>({} as Record<K, SnackbarKey | null>);

    

    useEffect(() => {
        operationsByConfig.forEach(({ operations, config }) => {
            (Object.entries(operations) as [K, { error: boolean; loading: boolean }][]).forEach(
                ([operationKey, status]) => {
                    const prevWasLoading = wasLoadingRef.current[operationKey] || false;
                    
                    // Loading
                    if (status.loading && config.loadingMessages[operationKey] && !shownLoadingRef.current[operationKey]) {
                        const message = config.loadingMessages[operationKey];
                        const key = enqueueSnackbar('', {
                            content: () => (
                                <Alert severity="info" sx={{ bgcolor: '#0288D1', color: '#fff', '& .MuiSvgIcon-root': { fill: '#fff' } }}>
                                    {message}
                                </Alert>
                            ),
                            persist: true,
                            anchorOrigin: { vertical: 'top', horizontal: 'center' },
                            TransitionComponent: SlideTransition,
                        });

                        shownLoadingRef.current[operationKey] = key;
                        wasLoadingRef.current[operationKey] = true;
                    }

                    // Success
                    if (prevWasLoading && !status.loading && !status.error && !shownRef.current[operationKey] && config.successMessages[operationKey]) {
                        const key = shownLoadingRef.current[operationKey];
                        if (key) closeSnackbar(key);

                        const message = config.successMessages[operationKey];
                        enqueueSnackbar('', {
                            content: (snackbarKey) => (
                                <Alert
                                    severity="success"
                                    onClose={() => closeSnackbar(snackbarKey)}
                                    sx={{ bgcolor: '#388E3C', color: '#fff', '& .MuiSvgIcon-root': { fill: '#fff' } }}
                                >
                                    {message}
                                </Alert>
                            ),
                            autoHideDuration: duration,
                            anchorOrigin: { vertical: 'top', horizontal: 'center' },
                            TransitionComponent: SlideTransition,
                        });

                        shownRef.current[operationKey] = true;
                        wasLoadingRef.current[operationKey] = false;
                        shownLoadingRef.current[operationKey] = null;

                        setTimeout(() => {
                            shownRef.current[operationKey] = false;
                        }, duration + 500);
                    }

                    // Error
                    if (status.error && !shownRef.current[operationKey]) {
                        const key = shownLoadingRef.current[operationKey];
                        
                        if (key) closeSnackbar(key);

                        const message = config.errorMessages[operationKey] ?? 'Something went wrong.';
                        enqueueSnackbar('', {
                            content: (snackbarKey) => (
                                <Alert
                                    severity="error"
                                    onClose={() => {
                                        closeSnackbar(snackbarKey);
                                        // dispatch(config.closeErrorAction(operationKey));
                                        //  Don't use this dispatch yet. Because it will disable all flags, 
                                        //  which means that if all flags are false, it will throw the Success window
                                        // BUT DON'T REMOVE THE FUNCTIONALITY OF THIS DISPATCH.
                                        shownRef.current[operationKey] = false; 
                                    }}
                                    sx={{ bgcolor: '#d32f2f', color: '#fff', '& .MuiSvgIcon-root': { fill: '#fff' } }}
                                >
                                    {message}
                                </Alert>
                            ),
                            persist: true, 
                            anchorOrigin: { vertical: 'top', horizontal: 'center' },
                            TransitionComponent: SlideTransition,
                        });

                        shownRef.current[operationKey] = true;
                        shownLoadingRef.current[operationKey] = null;
                    }
                }
            );
        });
    }, [operationsByConfig, enqueueSnackbar, closeSnackbar, dispatch]);

    return null;
}
