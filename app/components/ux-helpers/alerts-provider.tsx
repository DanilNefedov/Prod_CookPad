'use client';

import { SnackbarProvider } from 'notistack';
import { GlobalErrorNotifier } from './error-alert';
import { SLICE_CONFIGS, SliceKey } from './slice-config';





export function AlertsProvider({ children, sliceKeys, }: { children: React.ReactNode; sliceKeys: SliceKey[] }) {
  const configs = sliceKeys.map((key) => SLICE_CONFIGS[key]);

  console.log(configs)
  return (
    <SnackbarProvider
      maxSnack={2}
      anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
    >
      <GlobalErrorNotifier operationConfigs={configs} />
      {children}
    </SnackbarProvider>
  );
}
