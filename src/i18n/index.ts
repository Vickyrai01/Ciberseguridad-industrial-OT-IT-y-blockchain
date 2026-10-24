import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import en from './locales/en'
import es from './locales/es'

export const LANGUAGE_STORAGE_KEY = 'ot-under-attack-language'
export const supportedLanguages = ['es', 'en'] as const
export type SupportedLanguage = (typeof supportedLanguages)[number]

const storedLanguage = localStorage.getItem(LANGUAGE_STORAGE_KEY) as SupportedLanguage | null
const initialLanguage: SupportedLanguage =
  storedLanguage && supportedLanguages.includes(storedLanguage) ? storedLanguage : 'es'

void i18n.use(initReactI18next).init({
  resources: { es: { translation: es }, en: { translation: en } },
  lng: initialLanguage,
  fallbackLng: 'es',
  interpolation: { escapeValue: false },
})

export default i18n
