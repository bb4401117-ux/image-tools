import { useEffect } from 'react'
import { useLocale } from '../i18n/context'

export default function NotFound() {
  const { locale } = useLocale()

  useEffect(() => {
    document.title = '404 – Page Not Found'

    let meta = document.querySelector('meta[name="robots"]')

    if (!meta) {
      meta = document.createElement('meta')
      meta.setAttribute('name', 'robots')
      document.head.appendChild(meta)
    }

    meta.setAttribute('content', 'noindex, nofollow')
  }, [])

  const homePath = `/${locale}`

  return (
    <main className="info-page">
      <section className="info-hero">
        <span className="info-badge">404</span>
        <h1>Page Not Found</h1>
        <p>The page you are looking for does not exist.</p>
        <a href={homePath} className="btn-primary">
          Go to Home
        </a>
      </section>
    </main>
  )
}
