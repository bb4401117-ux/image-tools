const LOCALES = ['en', 'fr', 'es', 'de', 'ar', 'zh-CN', 'ja'] as const

function getLocalizedPath(pathname: string, locale: string) {
  const segments = pathname.split('/').filter(Boolean)
  const firstSegment = segments[0]

  const hasLocalePrefix = LOCALES.includes(
    firstSegment as (typeof LOCALES)[number],
  )

  let currentPath = hasLocalePrefix
    ? '/' + segments.slice(1).join('/')
    : pathname || '/'

  if (currentPath !== '/' && !currentPath.endsWith('.html')) {
    currentPath += '.html'
  }

  return `/${locale}${currentPath === '/' ? '' : currentPath}`
}

function setCanonical(href: string) {
  let link = document.head.querySelector(
    'link[data-seo-link="canonical"]',
  ) as HTMLLinkElement | null

  if (!link) {
    link = document.createElement('link')
    link.setAttribute('rel', 'canonical')
    link.setAttribute('data-seo-link', 'canonical')
    document.head.appendChild(link)
  }

  link.setAttribute('href', href)
}

function updateSeoLinks() {
  const origin = window.location.origin
  const pathname = window.location.pathname

  const currentSegments = pathname.split('/').filter(Boolean)
  const firstSegment = currentSegments[0]
  const currentLocale = LOCALES.includes(
    firstSegment as (typeof LOCALES)[number],
  )
    ? firstSegment
    : 'en'

  const currentLocalizedPath = getLocalizedPath(pathname, currentLocale)
  const englishPath = getLocalizedPath(pathname, 'en')

  setCanonical(`${origin}${currentLocalizedPath}`)

  document.head
    .querySelectorAll('link[data-seo-link="alternate"]')
    .forEach((element) => element.remove())

  for (const locale of LOCALES) {
    const link = document.createElement('link')
    link.setAttribute('rel', 'alternate')
    link.setAttribute('hreflang', locale)
    link.setAttribute('href', `${origin}${getLocalizedPath(pathname, locale)}`)
    link.setAttribute('data-seo-link', 'alternate')
    document.head.appendChild(link)
  }

  const defaultLink = document.createElement('link')
  defaultLink.setAttribute('rel', 'alternate')
  defaultLink.setAttribute('hreflang', 'x-default')
  defaultLink.setAttribute('href', `${origin}${englishPath}`)
  defaultLink.setAttribute('data-seo-link', 'alternate')
  document.head.appendChild(defaultLink)
}

export function setPageSEO(title: string, description: string) {
  document.title = title

  let meta = document.querySelector('meta[name="description"]')

  if (!meta) {
    meta = document.createElement('meta')
    meta.setAttribute('name', 'description')
    document.head.appendChild(meta)
  }

  meta.setAttribute('content', description)

  updateSeoLinks()
}
