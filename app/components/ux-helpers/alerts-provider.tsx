'use client';

import React from 'react';
import { SnackbarProvider } from 'notistack';
import { GlobalErrorNotifier } from './error-alert';






export function AlertsProvider({ children }: { children: React.ReactNode }) {
  return (
    <SnackbarProvider
      maxSnack={2}
      anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
    >
        <GlobalErrorNotifier></GlobalErrorNotifier>
        {children}
    </SnackbarProvider>
  );
}
