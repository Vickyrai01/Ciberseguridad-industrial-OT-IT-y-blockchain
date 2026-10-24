import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import en from './locales/en'
import es from './locales/es'

export const LANGUAGE = { ES: 'es', EN: 'en' } as const
export const LANGUAGE_STORAGE_KEY = 'ot-under-attack-language'
export const supportedLanguages = [LANGUAGE.ES, LANGUAGE.EN] as const
export type SupportedLanguage = (typeof LANGUAGE)[keyof typeof LANGUAGE]

const storedLanguage = localStorage.getItem(LANGUAGE_STORAGE_KEY) as SupportedLanguage | null
const initialLanguage: SupportedLanguage =
  storedLanguage && supportedLanguages.includes(storedLanguage) ? storedLanguage : LANGUAGE.ES

void i18n.use(initReactI18next).init({
  resources: { [LANGUAGE.ES]: { translation: es }, [LANGUAGE.EN]: { translation: en } },
  lng: initialLanguage,
  fallbackLng: LANGUAGE.ES,
  interpolation: { escapeValue: false },
})

export default i18n
