import fs from 'node:fs'
import path from 'node:path'

const SITE_URL = 'https://image-tools-6vq.pages.dev'

const LOCALES = ['en', 'fr', 'es', 'de', 'ar', 'zh-CN', 'ja']

const PAGES = [
  '/',
  '/resize-image',
  '/compress-image',
  '/about',
  '/privacy',
  '/terms',
  '/contact',
  '/image-to-pdf',
  '/jpg-to-png',
  '/png-to-jpg',
  '/jpg-to-webp',
  '/png-to-webp',
  '/webp-to-jpg',
]

function localizedPath(pagePath, locale) {
  if (pagePath === '/') {
    return `/${locale}`
  }

  return `/${locale}${pagePath}.html`
}

function escapeXml(value) {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&apos;')
}

const urls = []

for (const pagePath of PAGES) {
  for (const locale of LOCALES) {
    const loc = `${SITE_URL}${localizedPath(pagePath, locale)}`

    const alternates = LOCALES.map((altLocale) => {
      const href = `${SITE_URL}${localizedPath(pagePath, altLocale)}`
      return `    <xhtml:link rel="alternate" hreflang="${altLocale}" href="${escapeXml(href)}" />`
    }).join('\n')

    const xDefault =
      `    <xhtml:link rel="alternate" hreflang="x-default" href="${SITE_URL}${localizedPath(pagePath, 'en')}" />`

    urls.push(`  <url>
    <loc>${escapeXml(loc)}</loc>
${alternates}
${xDefault}
  </url>`)
  }
}

const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
  xmlns:xhtml="http://www.w3.org/1999/xhtml">
${urls.join('\n')}
</urlset>
`

const output = path.resolve('dist/sitemap.xml')

fs.writeFileSync(output, sitemap)

console.log(`Generated sitemap with ${urls.length} URLs.`)
