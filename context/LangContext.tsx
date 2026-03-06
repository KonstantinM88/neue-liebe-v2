'use client'

import { createContext, useContext, useState, useCallback, type ReactNode } from 'react'

type Lang = 'de' | 'en'

interface LangContextValue {
  lang: Lang
  setLang: (lang: Lang) => void
  t: (de: string, en: string) => string
}

const LangContext = createContext<LangContextValue | null>(null)

export function LangProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>('de')

  const setLang = useCallback((l: Lang) => {
    setLangState(l)
    if (typeof document !== 'undefined') {
      document.documentElement.lang = l
      document.body.classList.toggle('lang-en', l === 'en')
    }
  }, [])

  const t = useCallback(
    (de: string, en: string) => (lang === 'de' ? de : en),
    [lang]
  )

  return (
    <LangContext.Provider value={{ lang, setLang, t }}>
      {children}
    </LangContext.Provider>
  )
}

export function useLang(): LangContextValue {
  const ctx = useContext(LangContext)
  if (!ctx) throw new Error('useLang must be used within LangProvider')
  return ctx
}
