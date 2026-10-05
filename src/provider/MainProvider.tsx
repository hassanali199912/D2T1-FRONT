import type { ReactNode } from 'react'
import { CssBaseline, ThemeProvider } from '@mui/material'
import { theme } from '../theme.ts'
import { I18nextProvider } from 'react-i18next';
import { i18n } from '../language/index';
import { QueryProvider } from './QueryProvider.tsx';

type MainProviderProps = {
    children: ReactNode
}

export default function MainProvider({ children }: MainProviderProps) {
    return (
        <QueryProvider>
            <ThemeProvider theme={theme}>
                <I18nextProvider i18n={i18n}>
                    <CssBaseline />
                    {children}
                </I18nextProvider>
            </ThemeProvider>
        </QueryProvider>
    )
}
