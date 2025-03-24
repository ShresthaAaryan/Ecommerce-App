
'use client';

import { ThemeProvider as NextThemeProvider } from 'next-themes';
import React from 'react';

interface ThemeProviderProps {
  attribute?: string;
  defaultTheme?: string;
  enableSystem?: boolean;
  disableTransitionOnChange?: boolean;
  children: React.ReactNode;
}

export function ThemeProvider({
  attribute = 'class',
  defaultTheme,
  enableSystem,
  disableTransitionOnChange,
  children,
}: ThemeProviderProps) {
  return (
    <NextThemeProvider
      attribute={attribute}
      defaultTheme={defaultTheme}
      enableSystem={enableSystem}
      disableTransitionOnChange={disableTransitionOnChange}
    >
      {children}
    </NextThemeProvider>
  );
}
