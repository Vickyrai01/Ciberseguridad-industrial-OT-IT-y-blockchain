import { useTranslation } from 'react-i18next'
import i18n, { LANGUAGE_STORAGE_KEY, type SupportedLanguage } from '../../i18n'

export function LanguageSwitcher() {
  const { i18n: instance } = useTranslation()
  const currentLanguage = instance.language.startsWith('en') ? 'en' : 'es'

  const changeLanguage = (language: SupportedLanguage) => {
    localStorage.setItem(LANGUAGE_STORAGE_KEY, language)
    void i18n.changeLanguage(language)
  }

  return (
    <div className="language-switcher" aria-label={instance.t('common.languageSelector')}>
      <button
        className={currentLanguage === 'es' ? 'active' : ''}
        onClick={() => changeLanguage('es')}
        aria-pressed={currentLanguage === 'es'}>
        ES
      </button>
      <span>/</span>
      <button
        className={currentLanguage === 'en' ? 'active' : ''}
        onClick={() => changeLanguage('en')}
        aria-pressed={currentLanguage === 'en'}>
        EN
      </button>
    </div>
  )
}
