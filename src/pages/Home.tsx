import './Home.css';
import { useLocale } from '../i18n/context';
import { type Locale, type MessageKey } from '../i18n/locales';

const LOCALE_LABELS: Record<Locale, string> = {
  en: 'English',
  fr: 'Français',
  es: 'Español',
  de: 'Deutsch',
  ar: 'العربية',
  'zh-CN': '中文',
  ja: '日本語',
};

interface Tool {
  path: string;
  icon: string;
  title: MessageKey;
  description: MessageKey;
  available: boolean;
}

const tools: Tool[] = [
  {
    path: '/compress-image',
    icon: '🗜️',
    title: 'home.compress.title',
    description: 'home.compress.description',
    available: true,
  },
  {
    path: '/resize-image',
    icon: '📐',
    title: 'home.resize.title',
    description: 'home.resize.description',
    available: true,
  },
  {
    path: '/jpg-to-png',
    icon: '🔄',
    title: 'home.jpgToPng.title',
    description: 'home.jpgToPng.description',
    available: true,
  },
  {
    path: '/png-to-jpg',
    icon: '🔄',
    title: 'home.pngToJpg.title',
    description: 'home.pngToJpg.description',
    available: true,
  },
  {
    path: '/jpg-to-webp',
    icon: '🌐',
    title: 'home.jpgToWebp.title',
    description: 'home.jpgToWebp.description',
    available: true,
  },
  {
    path: '/png-to-webp',
    icon: '🌐',
    title: 'home.pngToWebp.title',
    description: 'home.pngToWebp.description',
    available: true,
  },
  {
    path: '/webp-to-jpg',
    icon: '🔄',
    title: 'home.webpToJpg.title',
    description: 'home.webpToJpg.description',
    available: true,
  },
  {
    path: '/image-to-pdf',
    icon: '📄',
    title: 'home.imageToPdf.title',
    description: 'home.imageToPdf.description',
    available: true,
  },
];

export default function Home() {
  const { locale, setLocale, t } = useLocale();

  const localizedPath = (path: string, nextLocale: Locale = locale) => {
    return `/${nextLocale}${path === '/' ? '' : path}`;
  };

  const openTool = (tool: Tool) => {
    if (!tool.available) return;

    window.history.pushState({}, '', localizedPath(tool.path));
    window.dispatchEvent(new PopStateEvent('popstate'));
  };

  const changeLanguage = (nextLocale: Locale) => {
    setLocale(nextLocale);

    const pathname = window.location.pathname;
    const segments = pathname.split('/');
    const firstSegment = segments[1] as Locale;
    const hasLocalePrefix = Object.keys(LOCALE_LABELS).includes(firstSegment);

    const currentPath = hasLocalePrefix
      ? '/' + segments.slice(2).join('/')
      : pathname;

    const nextPath = localizedPath(currentPath || '/', nextLocale);

    window.history.pushState({}, '', nextPath);
    window.dispatchEvent(new PopStateEvent('popstate'));
  };

  return (
    <main className="home-page">
      <div className="home-language-switcher">
        <span className="language-icon" aria-hidden="true">🌐</span>
        <select
          aria-label="Select language"
          value={locale}
          onChange={(e) => changeLanguage(e.target.value as Locale)}
        >
          {Object.entries(LOCALE_LABELS).map(([key, label]) => (
            <option key={key} value={key}>{label}</option>
          ))}
        </select>
      </div>
      <section className="home-hero">
        <p className="home-eyebrow">IMAGETOOLS</p>

        <h1>{t('home.title')}</h1>

        <p>
          Compress, resize and convert your images quickly and privately.
          Your files are processed directly in your browser.
        </p>
      </section>

      <section className="tools-section">
        <div className="tools-heading">
          <h2>{t('home.toolsTitle')}</h2>
          <p>{t('home.toolsSubtitle')}</p>
        </div>

        <div className="tools-grid">
          {tools.map((tool) => (
            <button
              key={tool.path}
              type="button"
              className={`tool-card ${tool.available ? '' : 'tool-card-disabled'}`}
              onClick={() => openTool(tool)}
              disabled={!tool.available}
            >
              <span className="tool-icon" aria-hidden="true">
                {tool.icon}
              </span>

              <span className="tool-content">
                <strong>{t(tool.title)}</strong>
                <span>{t(tool.description)}</span>
              </span>

              {!tool.available && (
                <span className="tool-status">Coming soon</span>
              )}

              {tool.available && (
                <span className="tool-arrow" aria-hidden="true">
                  →
                </span>
              )}
            </button>
          ))}
        </div>
      </section>

      <section className="home-privacy">
        <div>
          <span className="privacy-icon" aria-hidden="true">🔒</span>
        </div>

        <div>
          <h2>{t('home.privacyTitle')}</h2>
          <p>
            {t('home.privacyText')}
          </p>
        </div>
      </section>

      <footer className="home-footer">
        <div className="home-footer-brand">
          <strong>ImageTools</strong>
          <span>{t('home.footerDescription')}</span>
        </div>

        <nav className="home-footer-links" aria-label="Footer navigation">
          <button
            type="button"
            onClick={() => {
  window.history.pushState({}, '', '/about');
  window.dispatchEvent(new PopStateEvent('popstate'));
}}
          >
            About
          </button>

          <button
            type="button"
            onClick={() => {
  window.history.pushState({}, '', '/privacy');
  window.dispatchEvent(new PopStateEvent('popstate'));
}}
          >
            Privacy
          </button>

          <button
            type="button"
            onClick={() => {
  window.history.pushState({}, '', '/terms');
  window.dispatchEvent(new PopStateEvent('popstate'));
}}
          >
            Terms
          </button>

          <button
            type="button"
            onClick={() => {
  window.history.pushState({}, '', '/contact');
  window.dispatchEvent(new PopStateEvent('popstate'));
}}
          >
            Contact
          </button>
        </nav>

        <p className="home-footer-copy">
          © {new Date().getFullYear()} ImageTools. {t('home.rights')}
        </p>
      </footer>
    </main>
  );
}
