import { useEffect, useRef, useState } from 'react'

interface Props {
  title: string
  description: string
  fromLabel: string
  outputFormat: 'png' | 'jpeg' | 'webp'
  accept: string
}

export default function ImageConverter({
  title,
  description,
  fromLabel,
  outputFormat,
  accept,
}: Props) {
  const [file, setFile] = useState<File | null>(null)
  const [preview, setPreview] = useState('')
  const [output, setOutput] = useState<File | null>(null)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')

  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    return () => {
      if (preview) {
        URL.revokeObjectURL(preview)
      }
    }
  }, [preview])

  const chooseFile = (nextFile?: File) => {
    if (!nextFile) return

    if (!nextFile.type.startsWith('image/')) {
      setError('Please choose a valid image file.')
      return
    }

    if (preview) {
      URL.revokeObjectURL(preview)
    }

    setFile(nextFile)
    setPreview(URL.createObjectURL(nextFile))
    setOutput(null)
    setError('')
  }

  const convert = async () => {
    if (!file) {
      setError('Choose an image first.')
      return
    }

    setBusy(true)
    setError('')
    setOutput(null)

    try {
      const url = URL.createObjectURL(file)
      const img = new Image()

      await new Promise<void>((resolve, reject) => {
        img.onload = () => resolve()
        img.onerror = () => reject(
          new Error('Could not read the image.')
        )
        img.src = url
      })

      const canvas = document.createElement('canvas')

      canvas.width = img.naturalWidth
      canvas.height = img.naturalHeight

      const ctx = canvas.getContext('2d')

      if (!ctx) {
        URL.revokeObjectURL(url)
        throw new Error('Could not create the image canvas.')
      }

      if (outputFormat === 'jpeg') {
        ctx.fillStyle = '#ffffff'
        ctx.fillRect(0, 0, canvas.width, canvas.height)
      }

      ctx.drawImage(img, 0, 0)

      const blob = await new Promise<Blob | null>((resolve) => {
        canvas.toBlob(
          resolve,
          `image/${outputFormat}`,
          outputFormat === 'png' ? undefined : 0.92,
        )
      })

      URL.revokeObjectURL(url)

      if (!blob) {
        throw new Error('Conversion failed.')
      }

      const extension =
        outputFormat === 'jpeg' ? 'jpg' : outputFormat

      const baseName = file.name.replace(/\.[^/.]+$/, '')

      const converted = new File(
        [blob],
        `${baseName}.${extension}`,
        {
          type: `image/${outputFormat}`,
        },
      )

      setOutput(converted)

      canvas.width = 1
      canvas.height = 1
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'Conversion failed.',
      )
    } finally {
      setBusy(false)
    }
  }

  const download = () => {
    if (!output) return

    const url = URL.createObjectURL(output)
    const link = document.createElement('a')

    link.href = url
    link.download = output.name

    document.body.appendChild(link)
    link.click()
    link.remove()

    setTimeout(() => {
      URL.revokeObjectURL(url)
    }, 1000)
  }

  const reset = () => {
    if (preview) {
      URL.revokeObjectURL(preview)
    }

    setFile(null)
    setPreview('')
    setOutput(null)
    setError('')

    if (inputRef.current) {
      inputRef.current.value = ''
    }
  }

  return (
    <main className="converter-page">
      <section className="converter-hero">
        <span className="converter-badge">
          {fromLabel} → {outputFormat.toUpperCase()}
        </span>

        <h1>{title}</h1>
        <p>{description}</p>
      </section>

      <section className="converter-card">
        <input
          ref={inputRef}
          type="file"
          accept={accept}
          hidden
          onChange={(event) => {
            chooseFile(event.target.files?.[0])
          }}
        />

        {!file ? (
          <button
            className="converter-upload"
            onClick={() => inputRef.current?.click()}
          >
            Choose Image
          </button>
        ) : (
          <>
            <img
              className="converter-preview"
              src={preview}
              alt="Selected image preview"
            />

            <div className="converter-file">
              <strong>{file.name}</strong>
              <span>{(file.size / 1024).toFixed(1)} KB</span>
            </div>
            {!output && (
              <button
                className="converter-primary"
                onClick={convert}
                disabled={busy}
              >
                {busy
                  ? 'Converting…'
                  : `Convert to ${outputFormat.toUpperCase()}`}
              </button>
            )}

            {output && (
              <div className="converter-result">
                <strong>Conversion complete</strong>

                <span>
                  {output.name} · {(output.size / 1024).toFixed(1)} KB
                </span>

                <button
                  className="converter-download"
                  onClick={download}
                >
                  Download
                </button>
              </div>
            )}
            <button
              className="converter-secondary"
              onClick={reset}
              disabled={busy}
            >
              Choose Another Image
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
