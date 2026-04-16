'use client'

import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from 'react'
import type { SiteLocale } from '@/lib/site-locale'

export type Lang = SiteLocale

interface LangContextValue {
  lang: Lang
  setLang: (lang: Lang) => void
  t: (de: string, en: string) => string
}

const LangContext = createContext<LangContextValue | null>(null)

export function LangProvider({
  children,
  initialLang = 'de',
}: {
  children: ReactNode
  initialLang?: Lang
}) {
  const [lang, setLangState] = useState<Lang>(initialLang)

  const setLang = useCallback((l: Lang) => {
    setLangState(l)
  }, [])

  useEffect(() => {
    setLangState(initialLang)
  }, [initialLang])

  useEffect(() => {
    if (typeof document === 'undefined') {
      return
    }

    document.documentElement.lang = lang
    document.body.classList.toggle('lang-en', lang === 'en')
  }, [lang])

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
