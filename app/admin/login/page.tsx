'use client'

import { FormEvent, useState } from 'react'
import { useRouter } from 'next/navigation'
import Cursor from '@/components/Cursor'
import { useAdminLang } from '@/lib/admin-lang'
import styles from './login.module.css'

export default function AdminLoginPage() {
  const router = useRouter()
  const { lang, setLang, t } = useAdminLang()
  const [username, setUsername] = useState('admin')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setError('')
    setLoading(true)

    try {
      const response = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      })

      const payload = await response.json().catch(() => ({}))

      if (!response.ok) {
        setError(
          lang === 'ru'
            ? (payload.error ?? t('Autorisierungsfehler.', 'Ошибка авторизации.'))
            : t('Autorisierungsfehler.', 'Ошибка авторизации.')
        )
        return
      }

      router.push('/admin/gallery')
      router.refresh()
    } catch (submitError) {
      console.error('[Admin login]', submitError)
      setError(t('Anmeldung fehlgeschlagen. Bitte versuchen Sie es erneut.', 'Не удалось выполнить вход. Попробуйте еще раз.'))
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className={styles.page}>
      <Cursor />

      <main className={styles.panel}>
        <div className={styles.topBar}>
          <div className={styles.langSwitch}>
            <button
              type="button"
              className={`${styles.langBtn}${lang === 'de' ? ` ${styles.langBtnActive}` : ''}`}
              onClick={() => setLang('de')}
            >
              DE
            </button>
            <button
              type="button"
              className={`${styles.langBtn}${lang === 'ru' ? ` ${styles.langBtnActive}` : ''}`}
              onClick={() => setLang('ru')}
            >
              RU
            </button>
          </div>
        </div>

        <div className={styles.brand}>
          Neue Liebe
          <span>{t('Admin-Bereich', 'Админ-панель')}</span>
        </div>

        <section className={styles.card}>
          <div className={styles.cardHeader}>
            <div className={styles.icon}>🔒</div>
            <div>
              <h1 className={styles.title}>{t('Anmeldung', 'Вход в систему')}</h1>
              <p className={styles.subtitle}>{t('Nur für Administratoren', 'Только для администратора')}</p>
            </div>
          </div>

          <form className={styles.form} onSubmit={handleSubmit}>
            <label className={styles.label} htmlFor="admin-username">{t('Benutzername', 'Логин')}</label>
            <input
              id="admin-username"
              className={styles.input}
              type="text"
              value={username}
              onChange={(event) => setUsername(event.target.value)}
              required
              autoComplete="username"
            />

            <label className={styles.label} htmlFor="admin-password">{t('Passwort', 'Пароль')}</label>
            <input
              id="admin-password"
              className={styles.input}
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              required
              autoComplete="current-password"
            />

            {error && <p className={styles.error}>{error}</p>}

            <button className={styles.submit} type="submit" disabled={loading}>
              {loading ? t('Anmeldung...', 'Вход...') : t('Anmelden', 'Войти')}
            </button>
          </form>
        </section>
      </main>
    </div>
  )
}
