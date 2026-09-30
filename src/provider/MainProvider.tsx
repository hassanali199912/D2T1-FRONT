import type { ReactNode } from 'react'
import { CssBaseline, ThemeProvider } from '@mui/material'
import { theme } from '../theme.ts'
import LanguageSwitch from '../components/LanguageSwitch.tsx'
import { I18nextProvider } from 'react-i18next';
import { i18n } from '../language/index';

type MainProviderProps = {
    children: ReactNode
}

export default function MainProvider({ children }: MainProviderProps) {
    return (
        <ThemeProvider theme={theme}>
            <I18nextProvider i18n={i18n}>
                <CssBaseline />
                <LanguageSwitch />
                {children}
            </I18nextProvider>
        </ThemeProvider>
    )
}
