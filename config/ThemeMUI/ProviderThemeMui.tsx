'use client';

import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { theme } from './theme';
import { ReactNode } from 'react';

interface ThemeRegistryProps {
  children: ReactNode;
}

export default function ThemeRegistry(props: ThemeRegistryProps) {
  const { children } = props;

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      {children}
    </ThemeProvider>
  );
}