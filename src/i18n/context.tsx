import {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
  type ReactNode,
} from 'react'
import { type Locale, type MessageKey, messages } from './locales'

const SUPPORTED_LOCALES: Locale[] = [
  'en',
  'fr',
  'es',
  'de',
  'ar',
  'zh-CN',
  'ja',
]

const STORAGE_KEY = 'imagetools-locale'

function detectLocale(): Locale {
  try {
    const saved = localStorage.getItem(STORAGE_KEY)
    if (saved && SUPPORTED_LOCALES.includes(saved as Locale)) {
      return saved as Locale
    }
  } catch {
    // Ignore storage errors.
  }

  const browserLang = navigator.language.toLowerCase()

  if (browserLang.startsWith('fr')) return 'fr'
  if (browserLang.startsWith('es')) return 'es'
  if (browserLang.startsWith('de')) return 'de'
  if (browserLang.startsWith('ar')) return 'ar'
  if (browserLang.startsWith('zh')) return 'zh-CN'
  if (browserLang.startsWith('ja')) return 'ja'
  if (browserLang.startsWith('en')) return 'en'

  return 'en'
}

interface LocaleContextValue {
  locale: Locale
  setLocale: (locale: Locale) => void
  t: (key: MessageKey) => string
}

const LocaleContext = createContext<LocaleContextValue | null>(null)

export function LocaleProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>(detectLocale)

  const setLocale = useCallback((next: Locale) => {
    if (SUPPORTED_LOCALES.includes(next)) {
      setLocaleState(next)

      try {
        localStorage.setItem(STORAGE_KEY, next)
      } catch {
        // Ignore storage errors.
      }
    }
  }, [])

  useEffect(() => {
    document.documentElement.lang = locale
    document.documentElement.dir = locale === 'ar' ? 'rtl' : 'ltr'
  }, [locale])

  const t = useCallback(
    (key: MessageKey) => {
      return messages[locale][key] ?? messages.en[key] ?? key
    },
    [locale],
  )

  return (
    <LocaleContext.Provider value={{ locale, setLocale, t }}>
      {children}
    </LocaleContext.Provider>
  )
}

export function useLocale(): LocaleContextValue {
  const ctx = useContext(LocaleContext)

  if (!ctx) {
    throw new Error('useLocale must be used within a LocaleProvider')
  }

  return ctx
}
