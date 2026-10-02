import './InfoPage.css'
import { useLocale } from '../i18n/context'

interface Props {
  type: 'about' | 'privacy' | 'terms' | 'contact'
}

export default function InfoPage({ type }: Props) {
  const { t } = useLocale()

  const pages = {
    about: {
      title: t('info.about.title'),
      intro: t('info.about.intro'),
      sections: [
        { title: t('info.about.what.title'), text: t('info.about.what.text') },
        { title: t('info.about.privacy.title'), text: t('info.about.privacy.text') },
        { title: t('info.about.goal.title'), text: t('info.about.goal.text') },
      ],
    },
    privacy: {
      title: t('info.privacy.title'),
      intro: t('info.privacy.intro'),
      sections: [
        { title: t('info.privacy.files.title'), text: t('info.privacy.files.text') },
        { title: t('info.privacy.collect.title'), text: t('info.privacy.collect.text') },
        { title: t('info.privacy.cookies.title'), text: t('info.privacy.cookies.text') },
        { title: t('info.privacy.changes.title'), text: t('info.privacy.changes.text') },
      ],
    },
    terms: {
      title: t('info.terms.title'),
      intro: t('info.terms.intro'),
      sections: [
        { title: t('info.terms.use.title'), text: t('info.terms.use.text') },
        { title: t('info.terms.guarantee.title'), text: t('info.terms.guarantee.text') },
        { title: t('info.terms.responsibility.title'), text: t('info.terms.responsibility.text') },
        { title: t('info.terms.changes.title'), text: t('info.terms.changes.text') },
      ],
    },
    contact: {
      title: t('info.contact.title'),
      intro: t('info.contact.intro'),
      sections: [
        { title: t('info.contact.getInTouch.title'), text: t('info.contact.getInTouch.text') },
        { title: t('info.contact.feedback.title'), text: t('info.contact.feedback.text') },
      ],
    },
  }

  const page = pages[type]

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
