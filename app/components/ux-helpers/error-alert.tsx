'use client';

import { useEffect, useRef } from 'react';
import { useSnackbar, SnackbarKey } from 'notistack';
import { Alert, Slide, SlideProps } from '@mui/material';
import { closeErrorWindow, OperationKey } from '@/state/slices/list-recipe-slice';
import { useAppDispatch, useAppSelector } from '@/state/hook';
import { ERROR_MESSAGES_LIST_RECIPE, LOADING_MESSAGES_LIST_RECIPE, SUCCESS_MESSAGES_LIST_RECIPE } from './dictionaries';
import { RootState } from '@/state/store';



type OperationConfig = {
    sliceSelector: (state: RootState) => Record<OperationKey, { error: boolean; loading: boolean }>;
    successMessages: Record<string, string>;
    errorMessages: Record<string, string>;
    loadingMessages: Record<string, string>;
    closeErrorAction: (key: OperationKey) => any;
};


const SlideTransition = (props: SlideProps) => <Slide {...props} direction="down" />;


export function GlobalErrorNotifier({ operationConfigs }: { operationConfigs: OperationConfig[] }) {
    const dispatch = useAppDispatch();
    const { enqueueSnackbar, closeSnackbar } = useSnackbar();

    const duration = 3000;

    const shownRef = useRef<Record<OperationKey, boolean>>({} as Record<OperationKey, boolean>);
    const wasLoadingRef = useRef<Record<OperationKey, boolean>>({} as Record<OperationKey, boolean>);
    const shownLoadingRef = useRef<Record<OperationKey, SnackbarKey | null>>({} as Record<OperationKey, SnackbarKey | null>);

    const operationsByConfig = operationConfigs.map((config) => ({
        // key: config.key,
        operations: useAppSelector(config.sliceSelector),
    }));

    useEffect(() => {
        operationsByConfig.forEach(({ operations }) => {
            (Object.entries(operations) as [OperationKey, { error: boolean; loading: boolean }][]).forEach(
                ([operationKey, status]) => {
                    const prevWasLoading = wasLoadingRef.current[operationKey] || false;

                    // 1. Handle loading state
                    if (status.loading && LOADING_MESSAGES_LIST_RECIPE[operationKey] && !shownLoadingRef.current[operationKey]) {
                        const message = LOADING_MESSAGES_LIST_RECIPE[operationKey]!;

                        const key = enqueueSnackbar('', {
                            content: () => (
                                <Alert severity="info" sx={{
                                    bgcolor: '#0288D1',
                                    color: '#fff',
                                    '& .MuiSvgIcon-root': { fill: '#fff' },
                                }}>
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

                    // 2. Handle success state
                    if (
                        prevWasLoading &&
                        !status.loading &&
                        !status.error &&
                        !shownRef.current[operationKey] &&
                        SUCCESS_MESSAGES_LIST_RECIPE[operationKey]
                    ) {
                        const key = shownLoadingRef.current[operationKey];
                        if (key) closeSnackbar(key);

                        const message = SUCCESS_MESSAGES_LIST_RECIPE[operationKey]!;

                        enqueueSnackbar('', {
                            content: (snackbarKey) => (
                                <Alert severity="success" onClose={() => closeSnackbar(snackbarKey)} sx={{
                                    bgcolor: '#388E3C',
                                    color: '#fff',
                                    '& .MuiSvgIcon-root': { fill: '#fff' },
                                }}>
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

                    // 3. Handle error state
                    if (status.error && !shownRef.current[operationKey]) {
                        const key = shownLoadingRef.current[operationKey];
                        if (key) closeSnackbar(key);

                        const message = ERROR_MESSAGES_LIST_RECIPE[operationKey] ?? 'Something went wrong.';

                        enqueueSnackbar('', {
                            content: (snackbarKey) => (
                                <Alert severity="error" onClose={() => {
                                    closeSnackbar(snackbarKey);
                                    dispatch(closeErrorWindow(operationKey));
                                }} sx={{
                                    bgcolor: '#d32f2f',
                                    color: '#fff',
                                    '& .MuiSvgIcon-root': { fill: '#fff' },
                                }}>
                                    {message}
                                </Alert>
                            ),
                            autoHideDuration: duration,
                            anchorOrigin: { vertical: 'top', horizontal: 'center' },
                            TransitionComponent: SlideTransition,
                        });

                        shownRef.current[operationKey] = true;
                        shownLoadingRef.current[operationKey] = null;

                        setTimeout(() => {
                            shownRef.current[operationKey] = false;
                        }, duration + 500);
                    }
                }
            );
        });
    }, [operationsByConfig, enqueueSnackbar, closeSnackbar, dispatch]);

    return null;
}
