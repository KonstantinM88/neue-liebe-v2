'use client'

import { useCallback, useEffect, useState } from 'react'

export type AdminLang = 'de' | 'ru'

const ADMIN_LANG_STORAGE_KEY = 'nl_admin_lang'

function normalizeAdminLang(value: string | null | undefined): AdminLang {
  return value === 'ru' ? 'ru' : 'de'
}

export function useAdminLang() {
  const [lang, setLangState] = useState<AdminLang>('de')

  useEffect(() => {
    try {
      const stored = window.localStorage.getItem(ADMIN_LANG_STORAGE_KEY)
      setLangState(normalizeAdminLang(stored))
    } catch {
      setLangState('de')
    }
  }, [])

  const setLang = useCallback((next: AdminLang) => {
    setLangState(next)
    try {
      window.localStorage.setItem(ADMIN_LANG_STORAGE_KEY, next)
    } catch {
      // ignore storage errors
    }
  }, [])

  const t = useCallback((de: string, ru: string): string => (lang === 'de' ? de : ru), [lang])

  return { lang, setLang, t }
}
