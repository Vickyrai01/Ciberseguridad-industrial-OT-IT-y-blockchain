import { useTranslation } from 'react-i18next'
import i18n, { LANGUAGE, LANGUAGE_STORAGE_KEY, type SupportedLanguage } from '../../../i18n'

export function LanguageSwitcher() {
  const { i18n: instance } = useTranslation()
  const currentLanguage = instance.language.startsWith(LANGUAGE.EN) ? LANGUAGE.EN : LANGUAGE.ES

  const changeLanguage = (language: SupportedLanguage) => {
    if (typeof window !== 'undefined') window.localStorage.setItem(LANGUAGE_STORAGE_KEY, language)
    void i18n.changeLanguage(language)
  }

  return (
    <div className="language-switcher" aria-label={instance.t('common.languageSelector')}>
      <button
        type="button"
        className={currentLanguage === LANGUAGE.ES ? 'active' : ''}
        onClick={() => changeLanguage(LANGUAGE.ES)}
        aria-pressed={currentLanguage === LANGUAGE.ES}>
        ES
      </button>
      <span>/</span>
      <button
        type="button"
        className={currentLanguage === LANGUAGE.EN ? 'active' : ''}
        onClick={() => changeLanguage(LANGUAGE.EN)}
        aria-pressed={currentLanguage === LANGUAGE.EN}>
        EN
      </button>
    </div>
  )
}
