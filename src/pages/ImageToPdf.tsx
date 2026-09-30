import { useEffect, useRef, useState } from 'react'
import { jsPDF } from 'jspdf'
import { useLocale } from '../i18n/context'

interface PdfImage {
  file: File
  preview: string
}

export default function ImageToPdf() {
  const { t } = useLocale()
  const [images, setImages] = useState<PdfImage[]>([])
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')
  const [pdfBlob, setPdfBlob] = useState<Blob | null>(null)

  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    return () => {
      images.forEach((image) => URL.revokeObjectURL(image.preview))
    }
  }, [images])

  const chooseImages = (files: FileList | null) => {
    if (!files) return

    const selected = Array.from(files).filter((file) =>
      file.type.startsWith('image/'),
    )

    if (!selected.length) {
      setError(t('pdf.chooseOneOrMore'))
      return
    }

    images.forEach((image) => URL.revokeObjectURL(image.preview))

    setImages(
      selected.map((file) => ({
        file,
        preview: URL.createObjectURL(file),
      })),
    )

    setPdfBlob(null)
    setError('')
  }

  const createPdf = async () => {
    if (!images.length) {
      setError(t('pdf.chooseAtLeastOne'))
      return
    }

    setBusy(true)
    setError('')
    setPdfBlob(null)

    try {
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4',
      })

      for (let index = 0; index < images.length; index += 1) {
        const image = images[index]

        const dataUrl = await new Promise<string>((resolve, reject) => {
          const img = new Image()

          img.onload = () => {
            const canvas = document.createElement('canvas')
            canvas.width = img.naturalWidth
            canvas.height = img.naturalHeight

            const ctx = canvas.getContext('2d')

            if (!ctx) {
              reject(new Error(t('pdf.couldNotCreateCanvas')))
              return
            }

            ctx.drawImage(img, 0, 0)

            resolve(canvas.toDataURL('image/jpeg', 0.92))
          }

          img.onerror = () => {
            reject(new Error(t('pdf.couldNotRead').replace('{name}', image.file.name)))
          }

          img.src = image.preview
        })

        if (index > 0) {
          pdf.addPage()
        }

        const pageWidth = 210
        const pageHeight = 297
        const margin = 10
        const maxWidth = pageWidth - margin * 2
        const maxHeight = pageHeight - margin * 2

        const img = new Image()

        await new Promise<void>((resolve, reject) => {
          img.onload = () => resolve()
          img.onerror = () => reject(new Error(t('pdf.couldNotPrepareImage')))
          img.src = dataUrl
        })

        const ratio = Math.min(
          maxWidth / img.naturalWidth,
          maxHeight / img.naturalHeight,
        )

        const width = img.naturalWidth * ratio
        const height = img.naturalHeight * ratio

        const x = (pageWidth - width) / 2
        const y = (pageHeight - height) / 2

        pdf.addImage(dataUrl, 'JPEG', x, y, width, height)
      }

      const blob = pdf.output('blob')
      setPdfBlob(blob)
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : t('pdf.couldNotCreate'),
      )
    } finally {
      setBusy(false)
    }
  }


  const downloadPdf = async () => {
    if (!pdfBlob) return

    const file = new File(
      [pdfBlob],
      'images-to-pdf.pdf',
      { type: 'application/pdf' },
    )

    try {
      if (
        'share' in navigator &&
        'canShare' in navigator &&
        navigator.canShare({ files: [file] })
      ) {
        await navigator.share({
          files: [file],
          title: 'Images to PDF',
        })
        return
      }
    } catch {
      // Fall back to a normal browser download.
    }

    const url = URL.createObjectURL(pdfBlob)
    const link = document.createElement('a')

    link.href = url
    link.download = 'images-to-pdf.pdf'
    link.rel = 'noopener'

    document.body.appendChild(link)
    link.click()
    link.remove()

    setTimeout(() => URL.revokeObjectURL(url), 2000)
  }

  const reset = () => {
    images.forEach((image) => URL.revokeObjectURL(image.preview))

    setImages([])
    setPdfBlob(null)
    setError('')

    if (inputRef.current) {
      inputRef.current.value = ''
    }
  }

  return (
    <main className="converter-page">
      <section className="converter-hero">
        <span className="converter-badge">
          IMAGE → PDF
        </span>

        <h1>{t('pdf.title')}</h1>

        <p>
          {t('pdf.description')}
        </p>
      </section>

      <section className="converter-card">
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          multiple
          hidden
          onChange={(event) => chooseImages(event.target.files)}
        />

        {!images.length ? (
          <button
            className="converter-upload"
            onClick={() => inputRef.current?.click()}
          >
            {t('pdf.chooseImages')}
          </button>
        ) : (
          <>
            <div className="pdf-file-list">
              {images.map((image) => (
                <div
                  className="pdf-file-item"
                  key={`${image.file.name}-${image.file.lastModified}`}
                >
                  <img
                    src={image.preview}
                    alt={image.file.name}
                  />

                  <span>{image.file.name}</span>
                </div>
              ))}
            </div>

            {!pdfBlob && (
              <button
                className="converter-primary"
                onClick={createPdf}
                disabled={busy}
              >
                {busy ? t('pdf.creating') : t('pdf.create')}
              </button>
            )}

            {pdfBlob && (
              <div className="converter-result">
                <strong>{t('pdf.created')}</strong>

                <span>
                  {images.length}{' '}
                  {images.length === 1 ? t('pdf.image') : t('pdf.images')} {t('pdf.addedToPdf')}
                </span>

                <button
                  className="converter-download"
                  onClick={downloadPdf}
                >
                  {t('common.download')} PDF
                </button>
              </div>
            )}

            <button
              className="converter-secondary"
              onClick={reset}
              disabled={busy}
            >
              {t('common.chooseAnotherImage')}
            </button>
          </>
        )}

        {error && (
          <p className="converter-error">
            {error}
          </p>
        )}
      </section>
    </main>
  )
}
