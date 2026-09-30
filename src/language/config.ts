import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import translationARIndex from './locales/ar.json';
import translationENIndex from './locales/en.json';

const resources = {
    ar: {
        index: translationARIndex,
    },
    en: {
        index: translationENIndex,

    },
};

function directionFor(lng: string) {
    return lng.startsWith('ar') ? 'rtl' : 'ltr';
}

function applyLanguage(lng: string) {
    const html = document.documentElement;
    html.lang = lng;
    html.dir = directionFor(lng);
    localStorage.setItem('lang', lng);
}

function storedLanguage() {
    const stored = localStorage.getItem('lang');
    return stored === 'en' || stored === 'ar' ? stored : 'ar';
}

i18n.on('languageChanged', applyLanguage);

void i18n
    .use(initReactI18next)
    .init({
        resources,
        lng: storedLanguage(),
        fallbackLng: 'ar',
        supportedLngs: ['ar', 'en'],
        ns: ['index'],
        defaultNS: 'index',
        interpolation: {
            escapeValue: false,
        },
        react: {
            transSupportBasicHtmlNodes: true,
            transKeepBasicHtmlNodesFor: ['br', 'strong', 'i', 'p'],
        },
        detection: {
            order: ['localStorage', 'navigator', 'htmlTag'],
            caches: ['localStorage'],
            lookupLocalStorage: 'i18nextLng',
        },
    })
    .then(() => {
        applyLanguage(i18n.resolvedLanguage ?? i18n.language);
    });

export function switchLanguage() {
    const next = i18n.language.startsWith('ar') ? 'en' : 'ar';
    return i18n.changeLanguage(next);
}

export function nextLanguageLabel() {
    return i18n.language.startsWith('ar') ? 'English' : 'العربية';
}

export default i18n;