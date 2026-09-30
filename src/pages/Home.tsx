import './Home.css';

interface Tool {
  path: string;
  icon: string;
  title: string;
  description: string;
  available: boolean;
}

const tools: Tool[] = [
  {
    path: '/compress-image',
    icon: '🗜️',
    title: 'Compress Image',
    description: 'Reduce JPG, PNG and WebP file sizes directly in your browser.',
    available: true,
  },
  {
    path: '/resize-image',
    icon: '📐',
    title: 'Resize Image',
    description: 'Change image dimensions while keeping the quality you need.',
    available: true,
  },
  {
    path: '/jpg-to-png',
    icon: '🔄',
    title: 'JPG to PNG',
    description: 'Convert JPG images to PNG format quickly and privately.',
    available: true,
  },
  {
    path: '/png-to-jpg',
    icon: '🔄',
    title: 'PNG to JPG',
    description: 'Convert PNG images to JPG format in your browser.',
    available: true,
  },
  {
    path: '/jpg-to-webp',
    icon: '🌐',
    title: 'JPG to WebP',
    description: 'Convert JPG images to modern WebP format.',
    available: true,
  },
  {
    path: '/png-to-webp',
    icon: '🌐',
    title: 'PNG to WebP',
    description: 'Convert PNG images to smaller WebP files.',
    available: true,
  },
  {
    path: '/webp-to-jpg',
    icon: '🔄',
    title: 'WebP to JPG',
    description: 'Convert WebP images to JPG format directly in your browser.',
    available: true,
  },
  {
    path: '/image-to-pdf',
    icon: '📄',
    title: 'Image to PDF',
    description: 'Convert one or multiple images into a PDF directly in your browser.',
    available: true,
  },
];

export default function Home() {
  const openTool = (tool: Tool) => {
    if (!tool.available) return;

    window.history.pushState({}, '', tool.path);
    window.dispatchEvent(new PopStateEvent('popstate'));
  };

  return (
    <main className="home-page">
      <section className="home-hero">
        <p className="home-eyebrow">IMAGETOOLS</p>

        <h1>Free Online Image Tools</h1>

        <p>
          Compress, resize and convert your images quickly and privately.
          Your files are processed directly in your browser.
        </p>
      </section>

      <section className="tools-section">
        <div className="tools-heading">
          <h2>Image Tools</h2>
          <p>Choose a tool to get started.</p>
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
                <strong>{tool.title}</strong>
                <span>{tool.description}</span>
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
          <h2>Your images stay private</h2>
          <p>
            Image processing happens locally in your browser. Your images do
            not need to be uploaded to a server for these tools to work.
          </p>
        </div>
      </section>

      <footer className="home-footer">
        <div className="home-footer-brand">
          <strong>ImageTools</strong>
          <span>Simple and private image tools for everyone.</span>
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
          © {new Date().getFullYear()} ImageTools. All rights reserved.
        </p>
      </footer>
    </main>
  );
}
