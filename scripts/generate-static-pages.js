import fs from 'node:fs'
import path from 'node:path'

const DIST_DIR = path.resolve('dist')
const SITE_URL = 'https://image-tools-6vq.pages.dev'

const LOCALES = ['en', 'fr', 'es', 'de', 'ar', 'zh-CN', 'ja']

const PAGES = {
  home: '/',
  resize: '/resize-image',
  compress: '/compress-image',
  about: '/about',
  privacy: '/privacy',
  terms: '/terms',
  contact: '/contact',
  imageToPdf: '/image-to-pdf',
  jpgToPng: '/jpg-to-png',
  pngToJpg: '/png-to-jpg',
  jpgToWebp: '/jpg-to-webp',
  pngToWebp: '/png-to-webp',
  webpToJpg: '/webp-to-jpg',
}

const SEO = {
  home: {
    en: ['Free Online Image Tools – Compress, Resize & Convert', 'Free online image tools to compress, resize and convert JPG, PNG and WebP images. Fast, private and processed directly in your browser.'],
    fr: ['Outils image en ligne gratuits – Compresser, redimensionner et convertir', 'Compressez, redimensionnez et convertissez gratuitement vos images JPG, PNG et WebP directement dans votre navigateur.'],
    es: ['Herramientas de imagen online gratis – Comprimir, redimensionar y convertir', 'Comprime, cambia el tamaño y convierte imágenes JPG, PNG y WebP gratis directamente en tu navegador.'],
    de: ['Kostenlose Online-Bildtools – Komprimieren, Ändern und Konvertieren', 'Komprimiere, ändere die Größe und konvertiere JPG-, PNG- und WebP-Bilder kostenlos direkt im Browser.'],
    ar: ['أدوات الصور المجانية عبر الإنترنت – ضغط وتغيير وتحويل الصور', 'اضغط وغيّر حجم وحوّل صور JPG وPNG وWebP مجانًا مباشرة في متصفحك.'],
    'zh-CN': ['免费在线图片工具 – 压缩、调整大小和转换', '免费在线压缩、调整大小和转换 JPG、PNG 和 WebP 图片，文件直接在浏览器中处理。'],
    ja: ['無料オンライン画像ツール – 圧縮・サイズ変更・ 変換', 'JPG、PNG、WebP画像を無料で圧縮、サイズ変更、変換できます。'],
  },
  resize: {
    en: ['Resize Image Online Free – Change JPG, PNG & WebP Dimensions', 'Resize JPG, PNG and WebP images online for free. Change image dimensions quickly and privately directly in your browser.'],
    fr: ['Redimensionner une image en ligne gratuitement – JPG, PNG et WebP', 'Redimensionnez gratuitement vos images JPG, PNG et WebP directement dans votre navigateur.'],
    es: ['Cambiar tamaño de imagen online gratis – JPG, PNG y WebP', 'Cambia gratis las dimensiones de imágenes JPG, PNG y WebP directamente en tu navegador.'],
    de: ['Bilder kostenlos online skalieren – JPG, PNG und WebP', 'Ändere die Abmessungen von JPG-, PNG- und WebP-Bildern kostenlos direkt im Browser.'],
    ar: ['تغيير حجم الصور عبر الإنترنت مجانًا – JPG وPNG وWebP', 'غيّر أبعاد صور JPG وPNG وWebP مجانًا وبسرعة مباشرة في متصفحك.'],
    'zh-CN': ['免费在线调整图片大小 – JPG、PNG 和 WebP', '免费在线调整 JPG、PNG 和 WebP 图片尺寸。'],
    ja: ['画像サイズ変更オンライン無料 – JPG、PNG、WebP', 'JPG、PNG、WebP画像のサイズを無料で変更できます。'],
  },
  compress: {
    en: ['Compress Image Online Free – Reduce JPG, PNG & WebP Size', 'Compress JPG, PNG and WebP images online for free. Reduce image file size and keep your images private.'],
    fr: ['Compresser une image en ligne gratuitement – JPG, PNG et WebP', 'Compressez gratuitement vos images JPG, PNG et WebP directement dans votre navigateur.'],
    es: ['Comprimir imágenes online gratis – JPG, PNG y WebP', 'Comprime gratis imágenes JPG, PNG y WebP directamente en tu navegador.'],
    de: ['Bilder kostenlos online komprimieren – JPG, PNG und WebP', 'Komprimiere JPG-, PNG- und WebP-Bilder kostenlos direkt im Browser.'],
    ar: ['ضغط الصور عبر الإنترنت مجانًا – JPG وPNG وWebP', 'اضغط صور JPG وPNG وWebP مجانًا لتقليل حجمها مع الحفاظ على خصوصية ملفاتك.'],
    'zh-CN': ['免费在线压缩图片 – JPG、PNG 和 WebP', '免费在线压缩 JPG、PNG 和 WebP 图片，减小文件大小并保护隐私。'],
    ja: ['画像圧縮オンライン無料 – JPG、PNG、WebP', 'JPG、PNG、WebP画像を無料で圧縮できます。'],
  },
  about: {
    en: ['About ImageTools', 'Learn more about ImageTools and our browser-based image tools.'],
    fr: ['À propos d’ImageTools', 'Découvrez ImageTools et nos outils de traitement d’images dans votre navigateur.'],
    es: ['Acerca de ImageTools', 'Conoce ImageTools y nuestras herramientas de imágenes basadas en el navegador.'],
    de: ['Über ImageTools', 'Erfahren Sie mehr über ImageTools und unsere browserbasierten Bildtools.'],
    ar: ['حول ImageTools', 'تعرّف على ImageTools وأدوات الصور التي تعمل مباشرة في المتصفح.'],
    'zh-CN': ['关于 ImageTools', '了解 ImageTools 以及我们的浏览器图片工具。'],
    ja: ['ImageToolsについて', 'ImageToolsとブラウザで利用できる画像ツールについてご紹介します。'],
  },
  privacy: {
    en: ['Privacy Policy – ImageTools', 'Read the ImageTools privacy policy and learn how your files and information are handled.'],
    fr: ['Politique de confidentialité – ImageTools', 'Consultez la politique de confidentialité d’ImageTools et découvrez comment vos fichiers sont traités.'],
    es: ['Política de privacidad – ImageTools', 'Consulta la política de privacidad de ImageTools y cómo se gestionan tus archivos.'],
    de: ['Datenschutzerklärung – ImageTools', 'Lesen Sie die Datenschutzerklärung von ImageTools und erfahren Sie, wie Ihre Dateien verarbeitet werden.'],
    ar: ['سياسة الخصوصية – ImageTools', 'اطّلع على سياسة الخصوصية في ImageTools وكيفية التعامل مع ملفاتك ومعلوماتك.'],
    'zh-CN': ['隐私政策 – ImageTools', '了解 ImageTools 如何处理您的文件和信息。'],
    ja: ['プライバシーポリシー – ImageTools', 'ImageToolsのプライバシーポリシーとファイルや情報の取り扱いについて説明します。'],
  },
  terms: {
    en: ['Terms of Use – ImageTools', 'Read the terms of use for ImageTools.'],
    fr: ['Conditions d’utilisation – ImageTools', 'Consultez les conditions d’utilisation d’ImageTools.'],
    es: ['Términos de uso – ImageTools', 'Consulta los términos de uso de ImageTools.'],
    de: ['Nutzungsbedingungen – ImageTools', 'Lesen Sie die Nutzungsbedingungen von ImageTools.'],
    ar: ['شروط الاستخدام – ImageTools', 'اطّلع على شروط استخدام ImageTools.'],
    'zh-CN': ['使用条款 – ImageTools', '了解 ImageTools 的使用条款。'],
    ja: ['利用規約 – ImageTools', 'ImageToolsの利用規約をご確認ください。'],
  },
  contact: {
    en: ['Contact – ImageTools', 'Contact ImageTools for questions, feedback or suggestions.'],
    fr: ['Contact – ImageTools', 'Contactez ImageTools pour toute question, remarque ou suggestion.'],
    es: ['Contacto – ImageTools', 'Contacta con ImageTools para preguntas, comentarios o sugerencias.'],
    de: ['Kontakt – ImageTools', 'Kontaktieren Sie ImageTools bei Fragen, Feedback oder Vorschlägen.'],
    ar: ['اتصل بنا – ImageTools', 'تواصل مع ImageTools للاستفسارات أو الملاحظات أو الاقتراحات.'],
    'zh-CN': ['联系 ImageTools', '如有问题、反馈或建议，请联系 ImageTools。'],
    ja: ['お問い合わせ – ImageTools', 'ご質問、ご意見、ご提案がある場合はImageToolsまでお問い合わせください。'],
  },
  imageToPdf: {
    en: ['Image to PDF Converter Online Free – Convert Images to PDF', 'Convert JPG, PNG and WebP images to PDF online for free.'],
    fr: ['Convertisseur image en PDF gratuit', 'Convertissez gratuitement les images JPG, PNG et WebP en PDF.'],
    es: ['Convertidor de imagen a PDF gratis', 'Convierte imágenes JPG, PNG y WebP a PDF gratis.'],
    de: ['Bild in PDF umwandeln – Kostenlos', 'Konvertiere JPG-, PNG- und WebP-Bilder kostenlos in PDF.'],
    ar: ['تحويل الصور إلى PDF مجانًا', 'حوّل صور JPG وPNG وWebP إلى PDF مجانًا.'],
    'zh-CN': ['图片转 PDF 在线免费转换器', '免费将 JPG、PNG 和 WebP 图片转换为 PDF。'],
    ja: ['画像からPDFへの変換 – 無料', 'JPG、PNG、WebP画像を無料でPDFに変換できます。'],
  },
  jpgToPng: {
    en: ['JPG to PNG Converter Online Free – Convert JPG to PNG', 'Convert JPG images to PNG online for free.'],
    fr: ['Convertisseur JPG en PNG gratuit', 'Convertissez gratuitement les images JPG en PNG.'],
    es: ['Convertidor JPG a PNG gratis', 'Convierte imágenes JPG a PNG gratis.'],
    de: ['JPG in PNG umwandeln – Kostenlos', 'Konvertiere JPG-Bilder kostenlos in PNG.'],
    ar: ['تحويل JPG إلى PNG مجانًا', 'حوّل صور JPG إلى PNG مجانًا.'],
    'zh-CN': ['JPG 转 PNG 在线免费转换器', '免费将 JPG 图片转换为 PNG。'],
    ja: ['JPGからPNGへの変換 – 無料', 'JPG画像を無料でPNGに変換できます。'],
  },
  pngToJpg: {
    en: ['PNG to JPG Converter Online Free – Convert PNG to JPG', 'Convert PNG images to JPG online for free.'],
    fr: ['Convertisseur PNG en JPG gratuit', 'Convertissez gratuitement les images PNG en JPG.'],
    es: ['Convertidor PNG a JPG gratis', 'Convierte imágenes PNG a JPG gratis.'],
    de: ['PNG in JPG umwandeln – Kostenlos', 'Konvertiere PNG-Bilder kostenlos in JPG.'],
    ar: ['تحويل PNG إلى JPG مجانًا', 'حوّل صور PNG إلى JPG مجانًا.'],
    'zh-CN': ['PNG 转 JPG 在线免费转换器', '免费将 PNG 图片转换为 JPG。'],
    ja: ['PNGからJPGへの変換 – 無料', 'PNG画像を無料でJPGに変換できます。'],
  },
  jpgToWebp: {
    en: ['JPG to WebP Converter Online Free – Convert JPG to WebP', 'Convert JPG images to WebP online for free.'],
    fr: ['Convertisseur JPG en WebP gratuit', 'Convertissez gratuitement les images JPG en WebP.'],
    es: ['Convertidor JPG a WebP gratis', 'Convierte imágenes JPG a WebP gratis.'],
    de: ['JPG in WebP umwandeln – Kostenlos', 'Konvertiere JPG-Bilder kostenlos in WebP.'],
    ar: ['تحويل JPG إلى WebP مجانًا', 'حوّل صور JPG إلى WebP مجانًا.'],
    'zh-CN': ['JPG 转 WebP 在线免费转换器', '免费将 JPG 图片转换为 WebP。'],
    ja: ['JPGからWebPへの変換 – 無料', 'JPG画像を無料でWebPに変換できます。'],
  },
  pngToWebp: {
    en: ['PNG to WebP Converter Online Free – Convert PNG to WebP', 'Convert PNG images to WebP online for free.'],
    fr: ['Convertisseur PNG en WebP gratuit', 'Convertissez gratuitement les images PNG en WebP.'],
    es: ['Convertidor PNG a WebP gratis', 'Convierte imágenes PNG a WebP gratis.'],
    de: ['PNG in WebP umwandeln – Kostenlos', 'Konvertiere PNG-Bilder kostenlos in WebP.'],
    ar: ['تحويل PNG إلى WebP مجانًا', 'حوّل صور PNG إلى WebP مجانًا.'],
    'zh-CN': ['PNG 转 WebP 在线免费转换器', '免费将 PNG 图片转换为 WebP。'],
    ja: ['PNGからWebPへの変換 – 無料', 'PNG画像を無料でWebPに変換できます。'],
  },
  webpToJpg: {
    en: ['WebP to JPG Converter Online Free – Convert WebP to JPG', 'Convert WebP images to JPG online for free.'],
    fr: ['Convertisseur WebP en JPG gratuit', 'Convertissez gratuitement les images WebP en JPG.'],
    es: ['Convertidor WebP a JPG gratis', 'Convierte imágenes WebP a JPG gratis.'],
    de: ['WebP in JPG umwandeln – Kostenlos', 'Konvertiere WebP-Bilder kostenlos in JPG.'],
    ar: ['تحويل WebP إلى JPG مجانًا', 'حوّل صور WebP إلى JPG مجانًا.'],
    'zh-CN': ['WebP 转 JPG 在线免费转换器', '免费将 WebP 图片转换为 JPG。'],
    ja: ['WebPからJPGへの変換 – 無料', 'WebP画像を無料でJPGに変換できます。'],
  },
}

const templatePath = path.join(DIST_DIR, 'index.html')

if (!fs.existsSync(templatePath)) {
  throw new Error('dist/index.html not found. Run vite build first.')
}

const template = fs.readFileSync(templatePath, 'utf8')

function escapeHtml(value) {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('"', '&quot;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
}

function localizedPath(pagePath, locale) {
  return `/${locale}${pagePath === '/' ? '' : pagePath}`
}

function buildHead(page, locale) {
  const [title, description] = SEO[page][locale]
  const pagePath = PAGES[page]
  const canonical = `${SITE_URL}${localizedPath(pagePath, locale)}`

  const alternates = LOCALES.map((altLocale) => {
    const href = `${SITE_URL}${localizedPath(pagePath, altLocale)}`
    return `<link rel="alternate" hreflang="${altLocale}" href="${href}">`
  }).join('\n')

  const xDefault = `<link rel="alternate" hreflang="x-default" href="${SITE_URL}${localizedPath(pagePath, 'en')}">`

  return [
    `<title>${escapeHtml(title)}</title>`,
    `<meta name="description" content="${escapeHtml(description)}">`,
    `<link rel="canonical" href="${canonical}">`,
    alternates,
    xDefault,
  ].join('\n')
}

function injectSeo(html, page, locale) {
  const head = buildHead(page, locale)

  return html.replace(
    /<head>([\s\S]*?)<\/head>/i,
    (match, existingHead) => {
      const cleanedHead = existingHead
        .replace(/<title>[\s\S]*?<\/title>/gi, '')
        .replace(/<meta\s+name=["']description["'][^>]*>/gi, '')
        .replace(/<link\s+rel=["']canonical["'][^>]*>/gi, '')
        .replace(/<link\s+rel=["']alternate["'][^>]*>/gi, '')

      return `<head>${head}\n${cleanedHead}</head>`
    },
  )
}

let generated = 0

for (const [page, pagePath] of Object.entries(PAGES)) {
  for (const locale of LOCALES) {
    const outputPath =
      pagePath === '/'
        ? path.join(DIST_DIR, locale, 'index.html')
        : path.join(DIST_DIR, locale, pagePath.slice(1) + '.html')

    fs.mkdirSync(path.dirname(outputPath), { recursive: true })

    const html = injectSeo(template, page, locale)
    fs.writeFileSync(outputPath, html)

    generated += 1
  }
}

console.log(`Generated ${generated} localized SEO pages.`)
