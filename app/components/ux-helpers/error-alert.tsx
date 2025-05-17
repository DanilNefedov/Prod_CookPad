'use client';

import { useEffect, useRef } from 'react';
import { useSnackbar, closeSnackbar } from 'notistack';
import { Alert, Slide, SlideProps } from '@mui/material';
import { closeErrorWindow, OperationKey } from '@/state/slices/list-recipe-slice';
import { useAppDispatch, useAppSelector } from '@/state/hook';


const SlideTransition = (props: SlideProps) => <Slide {...props} direction="down" />;

const SUCCESS_MESSAGES: Partial<Record<OperationKey, string>> = {
    newListRecipe: 'Recipe list created successfully!',
    deleteListRecipe: 'Recipe deleted.',
};



const ERROR_MESSAGES: Partial<Record<OperationKey, string>> = {
    preLoaderMain: 'Error loading recipes',
    ingredientsListRecipe: 'Error loading ingredients',
    deleteListRecipe: 'Failed to delete a recipe',
    // newListRecipe: 'newListRecipeDefaultStatus',
    // shopIngrListRecipe:'defaultStatus',
    // deleteIngrRecipeList:'defaultStatus',
    // shopUnitListRecipe:'defaultStatus',
    // newAmountListRecipe:'defaultStatus',
    // newUnitListRecipe:'defaultStatus',
    // deleteUnitListRecipe:'defaultStatus',
};


export function GlobalErrorNotifier() {
    const dispatch = useAppDispatch();
    const { enqueueSnackbar, closeSnackbar } = useSnackbar();

    const operations = useAppSelector((state) => state.listRecipe.operations);

    const shownRef = useRef<Record<OperationKey, boolean>>({} as Record<OperationKey, boolean>);
    const wasLoadingRef = useRef<Record<OperationKey, boolean>>({} as Record<OperationKey, boolean>);

    useEffect(() => {
        (Object.entries(operations) as [OperationKey, { error: boolean; loading: boolean }][]).forEach(
            ([operationKey, status]) => {
                const prevWasLoading = wasLoadingRef.current[operationKey] || false;

                if (status.loading) {
                    wasLoadingRef.current[operationKey] = true;
                }

                if (status.error && !shownRef.current[operationKey]) {
                    const message = ERROR_MESSAGES[operationKey] ?? "Something went wrong.";

                    enqueueSnackbar('', {
                        content: (snackbarKey) => (
                            <Alert
                                severity="error"
                                onClose={() => {
                                    closeSnackbar(snackbarKey);
                                    dispatch(closeErrorWindow(operationKey));
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
                        TransitionComponent: SlideTransition,
                        anchorOrigin: { vertical: 'top', horizontal: 'center' },
                        autoHideDuration: 4000,
                    });

                    shownRef.current[operationKey] = true;

                    setTimeout(() => {
                        shownRef.current[operationKey] = false;
                    }, 5000);
                }

                if (
                    prevWasLoading &&
                    !status.loading &&
                    !status.error &&
                    !shownRef.current[operationKey] &&
                    SUCCESS_MESSAGES[operationKey]
                ) {
                    const message = SUCCESS_MESSAGES[operationKey];

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
                        TransitionComponent: SlideTransition,
                        anchorOrigin: { vertical: 'top', horizontal: 'center' },
                        autoHideDuration: 3000,
                    });

                    wasLoadingRef.current[operationKey] = false;
                    shownRef.current[operationKey] = true;

                    setTimeout(() => {
                        shownRef.current[operationKey] = false;
                    }, 4000);
                }
            }
        );
    }, [operations, enqueueSnackbar, dispatch]);

    return null;
}
