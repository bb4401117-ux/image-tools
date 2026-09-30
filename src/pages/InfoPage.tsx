import './InfoPage.css'

interface Props {
  type: 'about' | 'privacy' | 'terms' | 'contact'
}

const content = {
  about: {
    title: 'About ImageTools',
    intro: 'Simple, fast and privacy-friendly tools for working with images online.',
    sections: [
      {
        title: 'What is ImageTools?',
        text: 'ImageTools is a collection of browser-based image utilities designed to make common image tasks simple and accessible. You can compress, resize, convert and create PDF files from images without installing software.'
      },
      {
        title: 'Privacy first',
        text: 'Our image tools are designed to process files directly in your browser whenever possible. This means your images do not need to be uploaded to a remote server for the core image operations.'
      },
      {
        title: 'Our goal',
        text: 'We aim to provide fast, simple and useful online tools that work well on both phones and computers.'
      }
    ]
  },
  privacy: {
    title: 'Privacy Policy',
    intro: 'Your privacy matters to us. This page explains how ImageTools handles information.',
    sections: [
      {
        title: 'Image files',
        text: 'The core image processing features are designed to process your selected files directly in your browser. We do not need to receive your images on our servers to perform these operations.'
      },
      {
        title: 'Information we may collect',
        text: 'If analytics, advertising or contact services are enabled in the future, those services may process information according to their own privacy policies. We will update this page when such services are added.'
      },
      {
        title: 'Cookies and advertising',
        text: 'ImageTools may use cookies or similar technologies in the future for analytics, advertising and site functionality. Where required by law, appropriate consent mechanisms will be provided.'
      },
      {
        title: 'Changes to this policy',
        text: 'This Privacy Policy may be updated when the website or its services change. The latest version will always be published on this page.'
      }
    ]
  },
  terms: {
    title: 'Terms of Use',
    intro: 'By using ImageTools, you agree to use the website responsibly and in accordance with applicable laws.',
    sections: [
      {
        title: 'Use of the service',
        text: 'You may use ImageTools for lawful personal or commercial purposes. You are responsible for the files you process and for ensuring that you have the necessary rights to use them.'
      },
      {
        title: 'No guarantee',
        text: 'We work to keep the tools available and reliable, but the service is provided without a guarantee that every operation will work with every file, browser or device.'
      },
      {
        title: 'Your responsibility',
        text: 'You are responsible for keeping backups of important files and for checking generated files before using them for important purposes.'
      },
      {
        title: 'Changes',
        text: 'We may improve, modify or discontinue features as the website develops.'
      }
    ]
  },
  contact: {
    title: 'Contact ImageTools',
    intro: 'Have a question, suggestion or problem with one of our tools?',
    sections: [
      {
        title: 'Get in touch',
        text: 'For support, feedback or business inquiries, please contact us using the email address published on this website.'
      },
      {
        title: 'Feedback',
        text: 'We welcome reports about broken tools, browser compatibility problems and suggestions for useful new image utilities.'
      }
    ]
  }
}

export default function InfoPage({ type }: Props) {
  const page = content[type]

  return (
    <main className="info-page">
      <section className="info-hero">
        <span className="info-badge">IMAGETOOLS</span>
        <h1>{page.title}</h1>
        <p>{page.intro}</p>
      </section>

      <section className="info-card">
        {page.sections.map((section) => (
          <article key={section.title} className="info-section">
            <h2>{section.title}</h2>
            <p>{section.text}</p>
          </article>
        ))}
      </section>
    </main>
  )
}
