import { useEffect, useRef } from 'react';
import { Alert, Slide, SlideProps } from '@mui/material';
import { useSnackbar, SnackbarKey } from 'notistack';
import { useAppDispatch, useAppSelector } from '@/state/hook';
import { OperationConfig } from './status-alert';

const SlideTransition = (props: SlideProps) => <Slide {...props} direction="down" />;

type Props = {
    config: OperationConfig;
};

export function GlobalStatusNotifierItem({ config }: Props) {
    const dispatch = useAppDispatch();
    const { enqueueSnackbar, closeSnackbar } = useSnackbar();

    const operations = useAppSelector(config.sliceSelector);

    const duration = 3000;

    const shownRef = useRef<Record<string, boolean>>({});
    const wasLoadingRef = useRef<Record<string, boolean>>({});
    const shownLoadingRef = useRef<Record<string, SnackbarKey | null>>({});

    useEffect(() => {
        Object.entries(operations).forEach(([operationKey, status]) => {
            const prevWasLoading = wasLoadingRef.current[operationKey] || false;

            // Loading
            if (
                status.loading &&
                config.loadingMessages[operationKey] &&
                !shownLoadingRef.current[operationKey]
            ) {
                const message = config.loadingMessages[operationKey];
                const key = enqueueSnackbar('', {
                    content: () => (
                        <Alert
                            severity="info"
                            sx={{
                                bgcolor: '#0288D1',
                                color: '#fff',
                                '& .MuiSvgIcon-root': { fill: '#fff' },
                            }}
                        >
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
            if (
                prevWasLoading &&
                !status.loading &&
                !status.error &&
                !shownRef.current[operationKey] &&
                config.successMessages[operationKey]
            ) {
                const key = shownLoadingRef.current[operationKey];
                if (key) closeSnackbar(key);

                const message = config.successMessages[operationKey];
                enqueueSnackbar('', {
                    content: (snackbarKey) => (
                        <Alert
                            severity="success"
                            onClose={() => closeSnackbar(snackbarKey)}
                            sx={{
                                bgcolor: '#388E3C',
                                color: '#fff',
                                '& .MuiSvgIcon-root': { fill: '#fff' },
                            }}
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
                                dispatch(config.closeErrorAction(operationKey));
                                console.log({operationKey, status, operations, config:config.sliceSelector})
                                //  Don't use this dispatch yet. Because it will disable all flags, 
                                //  which means that if all flags are false, it will throw the Success window
                                //  BUT DON'T REMOVE THE FUNCTIONALITY OF THIS DISPATCH.
                                shownRef.current[operationKey] = false;
                            }}
                            sx={{
                                bgcolor: '#d32f2f',
                                color: '#fff',
                                '& .MuiSvgIcon-root': { fill: '#fff' },
                            }}
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
        });
    }, [operations, config, enqueueSnackbar, closeSnackbar, dispatch]);

    return null;
}
