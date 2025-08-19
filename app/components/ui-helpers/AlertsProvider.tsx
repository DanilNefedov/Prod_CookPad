'use client';

import { SnackbarProvider } from 'notistack';
import { GlobalStatusNotifier } from './StatusAlert';
import { SLICE_CONFIGS, SliceKey } from './slice-config';





export function AlertsProvider({ children, sliceKeys, }: { children: React.ReactNode; sliceKeys: SliceKey[] }) {
  const configs = sliceKeys.map((key) => SLICE_CONFIGS[key]);

  return (
    <SnackbarProvider
      maxSnack={2}
      anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
    >
      <GlobalStatusNotifier operationConfigs={configs} />
      {children}
    </SnackbarProvider>
  );
}
