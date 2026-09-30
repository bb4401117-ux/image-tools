import { useState, useRef, useEffect, lazy, Suspense } from 'react'
import './App.css'
import ResizeImage from './pages/ResizeImage'
import ImageConverter from './pages/ImageConverter'
import Home from './pages/Home'
import InfoPage from './pages/InfoPage'

const ImageToPdf = lazy(() => import('./pages/ImageToPdf'))
import { compressImage, processFiles, createZip, compressImageWithTargetSize, IMAGE_FORMATS, isValidImage } from './utils/imageProcessor'
import { useLocale } from './i18n/context'
import { type Locale } from './i18n/locales'
import { setPageSEO } from './utils/seo'

interface FileItem {
  id: number
  name: string
  size: number
  type: string
  file: File
  preview: string
  status: 'pending' | 'processing' | 'completed' | 'error'
  compressedSize?: number
  compressedFile?: File
}

const LOCALE_LABELS: Record<Locale, string> = {
  en: 'English',
  fr: 'Français',
  es: 'Español',
  de: 'Deutsch',
  ar: 'العربية',
  'zh-CN': '中文',
  ja: '日本語',
}

const CONCURRENCY = 4

let nextId = 0

function App() {
  const [, setRoute] = useState(window.location.pathname)

  useEffect(() => {
    const handleRouteChange = () => {
      setRoute(window.location.pathname)
    }

    window.addEventListener('popstate', handleRouteChange)

    return () => {
      window.removeEventListener('popstate', handleRouteChange)
    }
  }, [])

  const path = window.location.pathname

  if (path === '/') {
    setPageSEO(
      'Free Online Image Tools – Compress, Resize & Convert',
      'Free online image tools to compress, resize and convert JPG, PNG and WebP images. Fast, private and processed directly in your browser.'
    )
    return <Home />
  }

  if (path === '/resize-image') {
    setPageSEO(
      'Resize Image Online Free – Change JPG, PNG & WebP Dimensions',
      'Resize JPG, PNG and WebP images online for free. Change image dimensions quickly and privately directly in your browser.'
    )
    return <ResizeImage />
  }

  if (path === '/compress-image') {
    setPageSEO(
      'Compress Image Online Free – Reduce JPG, PNG & WebP Size',
      'Compress JPG, PNG and WebP images online for free. Reduce image file size and keep your images private with browser-based image compression.'
    )
    return <CompressorApp />
  }

  if (path === '/about') {
    return <InfoPage type="about" />
  }

  if (path === '/privacy') {
    return <InfoPage type="privacy" />
  }

  if (path === '/terms') {
    return <InfoPage type="terms" />
  }

  if (path === '/contact') {
    return <InfoPage type="contact" />
  }

  if (path === '/image-to-pdf') {
    setPageSEO(
      'Image to PDF Converter Online Free – Convert Images to PDF',
      'Convert JPG, PNG and WebP images to PDF online for free. Combine multiple images into one PDF quickly and privately in your browser.'
    )
    return (
      <Suspense fallback={<main className="converter-page"><p>Loading PDF tools…</p></main>}>
        <ImageToPdf />
      </Suspense>
    )
  }

  if (path === '/jpg-to-png') {
    setPageSEO(
      'JPG to PNG Converter Online Free – Convert JPG to PNG',
      'Convert JPG images to PNG online for free. Fast, private and easy conversion directly in your browser.'
    )
    return (
      <ImageConverter
        title="JPG to PNG Converter"
        description="Convert JPG images to PNG format directly in your browser."
        fromLabel="JPG"
        outputFormat="png"
        accept="image/jpeg,.jpg,.jpeg"
      />
    )
  }

  if (path === '/png-to-jpg') {
    setPageSEO(
      'PNG to JPG Converter Online Free – Convert PNG to JPG',
      'Convert PNG images to JPG online for free. Fast, private and easy conversion directly in your browser.'
    )
    return (
      <ImageConverter
        title="PNG to JPG Converter"
        description="Convert PNG images to JPG format directly in your browser."
        fromLabel="PNG"
        outputFormat="jpeg"
        accept="image/png,.png"
      />
    )
  }

  if (path === '/jpg-to-webp') {
    setPageSEO(
      'JPG to WebP Converter Online Free – Convert JPG to WebP',
      'Convert JPG images to WebP online for free. Create smaller, modern image files quickly and privately in your browser.'
    )
    return (
      <ImageConverter
        title="JPG to WebP Converter"
        description="Convert JPG images to WebP format directly in your browser."
        fromLabel="JPG"
        outputFormat="webp"
        accept="image/jpeg,.jpg,.jpeg"
      />
    )
  }

  if (path === '/png-to-webp') {
    setPageSEO(
      'PNG to WebP Converter Online Free – Convert PNG to WebP',
      'Convert PNG images to WebP online for free. Create smaller, modern image files quickly and privately in your browser.'
    )
    return (
      <ImageConverter
        title="PNG to WebP Converter"
        description="Convert PNG images to WebP format directly in your browser."
        fromLabel="PNG"
        outputFormat="webp"
        accept="image/png,.png"
      />
    )
  }

  if (path === '/webp-to-jpg') {
    setPageSEO(
      'WebP to JPG Converter Online Free – Convert WebP to JPG',
      'Convert WebP images to JPG online for free. Fast, private and easy conversion directly in your browser.'
    )
    return (
      <ImageConverter
        title="WebP to JPG Converter"
        description="Convert WebP images to JPG format directly in your browser."
        fromLabel="WebP"
        outputFormat="jpeg"
        accept="image/webp,.webp"
      />
    )
  }

  return <Home />
}

function CompressorApp() {
  const { locale, setLocale, t } = useLocale()
  const [files, setFiles] = useState<FileItem[]>([])
  const [isDragging, setIsDragging] = useState(false)
  const [quality, setQuality] = useState(0.7)
  const [format, setFormat] = useState('jpeg')
  const [isCompressing, setIsCompressing] = useState(false)
  const [compressionMode, setCompressionMode] = useState<'quality' | 'size'>('size')
  const [targetSize, setTargetSize] = useState(200)
  const [targetSizeStr, setTargetSizeStr] = useState('200')
  const [lockResolution, setLockResolution] = useState(false)
  const [completedCount, setCompletedCount] = useState(0)
  const dropRef = useRef<HTMLDivElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const previewUrlsRef = useRef<Set<string>>(new Set())

  const createPreviewUrl = (file: File) => {
    const url = URL.createObjectURL(file)
    previewUrlsRef.current.add(url)
    return url
  }

  const revokePreviewUrl = (url: string) => {
    URL.revokeObjectURL(url)
    previewUrlsRef.current.delete(url)
  }

  // Release every remaining preview URL when the compressor unmounts.
  useEffect(() => {
    return () => {
      previewUrlsRef.current.forEach((url) => URL.revokeObjectURL(url))
      previewUrlsRef.current.clear()
    }
  }, [])

  const addFiles = async (newFiles: FileItem[]) => {
    setFiles(prev => [...prev, ...newFiles])
    setCompletedCount(0)
  }

  const filterValidImages = async (items: { file: File; name: string; size: number; type: string }[]): Promise<FileItem[]> => {
    const valid: FileItem[] = []
    for (const item of items) {
      if (await isValidImage(item.file)) {
        valid.push({
          id: nextId++,
          name: item.name,
          size: item.size,
          type: item.type,
          file: item.file,
          preview: createPreviewUrl(item.file),
          status: 'pending' as const,
        })
      }
    }
    return valid
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = (e: React.DragEvent) => {
    // Only set false if leaving the drop zone (not entering a child)
    if (e.currentTarget === e.target || !e.currentTarget.contains(e.relatedTarget as Node)) {
      setIsDragging(false)
    }
  }

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)

    if (e.dataTransfer.items) {
      const processed = await processFiles(e.dataTransfer.items)
      const validFiles = await filterValidImages(processed)
      addFiles(validFiles)
    }
  }

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files
    if (!selected) return

    const items: FileItem[] = []
    for (let i = 0; i < selected.length; i++) {
      const file = selected[i]
      if (IMAGE_FORMATS.includes(file.type) && await isValidImage(file)) {
        items.push({
          id: nextId++,
          name: file.name,
          size: file.size,
          type: file.type,
          file,
          preview: createPreviewUrl(file),
          status: 'pending',
        })
      }
    }
    addFiles(items)
    e.target.value = '' // reset so same file can be re-selected
  }

  const handleRemoveFile = (id: number) => {
    setFiles(prev => {
      const item = prev.find(f => f.id === id)
      if (item) revokePreviewUrl(item.preview)
      return prev.filter(f => f.id !== id)
    })
  }

  const handleClearAll = () => {
    files.forEach(f => revokePreviewUrl(f.preview))
    setFiles([])
    setCompletedCount(0)
  }

  const handleTargetSizeBlur = () => {
    const num = parseInt(targetSizeStr)
    if (!isNaN(num) && num >= 1) {
      setTargetSize(num)
      setTargetSizeStr(String(num))
    } else {
      // Restore from valid targetSize
      setTargetSizeStr(String(targetSize))
    }
  }

  const handleCompress = async () => {
    if (files.length === 0 || isCompressing) return

    // Reset all files to pending
    const resetFiles = files.map(f => ({
      ...f,
      status: 'pending' as const,
      compressedSize: undefined,
      compressedFile: undefined,
    }))
    setFiles(resetFiles)
    setCompletedCount(0)
    setIsCompressing(true)

    const queue = [...resetFiles]
    let done = 0

    const processOne = async (item: FileItem) => {
      // Mark as processing
      setFiles(prev => prev.map(f => f.id === item.id ? { ...f, status: 'processing' as const } : f))

      try {
        let compressedFile: File
        if (compressionMode === 'size') {
          const targetSizeBytes = targetSize * 1024
          compressedFile = await compressImageWithTargetSize(item.file, targetSizeBytes, format, lockResolution)
        } else {
          compressedFile = await compressImage(item.file, quality, format)
        }

        setFiles(prev => prev.map(f =>
          f.id === item.id
            ? { ...f, status: 'completed' as const, compressedFile, compressedSize: compressedFile.size }
            : f
        ))
      } catch {
        setFiles(prev => prev.map(f => f.id === item.id ? { ...f, status: 'error' as const } : f))
      }

      done++
      setCompletedCount(done)
    }

    // Process with concurrency limit
    const running: Promise<void>[] = []
    for (const item of queue) {
      const p = processOne(item).then(() => {
        running.splice(running.indexOf(p), 1)
      })
      running.push(p)
      if (running.length >= CONCURRENCY) {
        await Promise.race(running)
      }
    }
    await Promise.all(running)
    setIsCompressing(false)
  }

  const triggerDownload = (blob: Blob, filename: string) => {
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')

    a.href = url
    a.download = filename
    a.style.display = 'none'

    document.body.appendChild(a)
    a.click()
    a.remove()

    // Give the browser time to start the download before releasing the URL.
    window.setTimeout(() => {
      URL.revokeObjectURL(url)
    }, 1000)
  }

  const handleDownloadAll = async () => {
    if (files.length === 0 || isCompressing) return

    const compressedFiles = files
      .filter(f => f.compressedFile)
      .map(f => f.compressedFile!)

    if (compressedFiles.length === 0) return

    const blob = await createZip(compressedFiles)
    triggerDownload(blob, `compressed-images-${Date.now()}.zip`)
  }

  const handleDownloadSingle = (file: File) => {
    if (isCompressing) return
    triggerDownload(file, file.name)
  }

  const getFileSize = (size: number) => {
    if (size < 1024) return `${size} B`
    if (size < 1024 * 1024) return `${(size / 1024).toFixed(2)} KB`
    return `${(size / (1024 * 1024)).toFixed(2)} MB`
  }

  const getSavingPercent = (original: number, compressed: number) => {
    if (original === 0) return 0
    return Math.round(((original - compressed) / original) * 100)
  }

  const getSavingClass = (percent: number) => {
    if (percent >= 50) return 'saving-good'
    if (percent >= 20) return 'saving-ok'
    return 'saving-low'
  }

  const statusText = (status: string) => {
    switch (status) {
      case 'pending': return t('status.pending')
      case 'processing': return t('status.processing')
      case 'completed': return t('status.completed')
      case 'error': return t('status.error')
      default: return status
    }
  }

  const progressPercent = files.length > 0 ? Math.round((completedCount / files.length) * 100) : 0
  const allDone = files.length > 0 && files.every(f => f.status === 'completed' || f.status === 'error')
  const hasCompressed = files.some(f => f.status === 'completed' && f.compressedFile)
  const hasAnyFile = files.length > 0

  const completedFiles = files.filter(
    f => f.status === 'completed' && f.compressedFile
  )

  const totalOriginalSize = completedFiles.reduce(
    (sum, f) => sum + f.size,
    0
  )

  const totalCompressedSize = completedFiles.reduce(
    (sum, f) => sum + (f.compressedSize ?? 0),
    0
  )

  const totalSavingPercent =
    totalOriginalSize > 0
      ? Math.round(
          ((totalOriginalSize - totalCompressedSize) / totalOriginalSize) * 100
        )
      : 0

  return (
    <div className="app">
      <div className="container">
        {/* Header with language switcher */}
        <header className="header">
          <div className="header-top">
            <div className="lang-switcher">
              <span className="lang-label">{t('lang.switch')}</span>
              <select
                value={locale}
                onChange={(e) => setLocale(e.target.value as Locale)}
                className="lang-select"
              >
                {Object.entries(LOCALE_LABELS).map(([key, label]) => (
                  <option key={key} value={key}>{label}</option>
                ))}
              </select>
            </div>
          </div>
          <h1 className="title">{t('app.title')}</h1>
          <p className="subtitle">{t('app.subtitle')}</p>
        </header>

        {/* Settings toolbar — always visible */}
        <div className="settings-toolbar">
          <div className="toolbar-item">
            <span className="toolbar-label">{t('settings.mode')}</span>
            <select
              value={compressionMode}
              onChange={(e) => setCompressionMode(e.target.value as 'quality' | 'size')}
              className="setting-select"
            >
              <option value="size">{t('settings.modeSize')}</option>
              <option value="quality">{t('settings.modeQuality')}</option>
            </select>
          </div>

          <div className="toolbar-item toolbar-item-grow">
            <span className="toolbar-label">
              {compressionMode === 'quality' ? t('settings.quality') : t('settings.targetSize')}
            </span>
            {compressionMode === 'quality' ? (
              <div className="quality-row">
                <input
                  type="range"
                  min="0.1"
                  max="1"
                  step="0.1"
                  value={quality}
                  onChange={(e) => setQuality(parseFloat(e.target.value))}
                  className="setting-range"
                />
                <span className="quality-value">{Math.round(quality * 100)}%</span>
              </div>
            ) : (
              <div className="size-row">
                <input
                  type="text"
                  inputMode="numeric"
                  value={targetSizeStr}
                  onChange={(e) => {
                    const v = e.target.value
                    if (v === '' || /^\d+$/.test(v)) {
                      setTargetSizeStr(v)
                      const num = parseInt(v)
                      if (!isNaN(num) && num >= 1) {
                        setTargetSize(num)
                      }
                    }
                  }}
                  onBlur={handleTargetSizeBlur}
                  className="setting-input size-input"
                />
                <label className="lock-resolution-label">
                  <input
                    type="checkbox"
                    checked={lockResolution}
                    onChange={(e) => setLockResolution(e.target.checked)}
                  />
                  <span className="lock-resolution-toggle" />
                  {t('settings.lockResolution')}
                </label>
              </div>
            )}
          </div>

          <div className="toolbar-item">
            <span className="toolbar-label">{t('settings.format')}</span>
            <select value={format} onChange={(e) => setFormat(e.target.value)} className="setting-select">
              <option value="webp">WebP</option>
              <option value="jpeg">JPEG</option>
              <option value="png">PNG</option>
            </select>
          </div>
        </div>

        {/* Main upload area */}
        <div
          ref={dropRef}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          className={`drop-area ${isDragging ? 'drag-over' : ''} ${hasAnyFile ? 'drop-area-compact' : ''}`}
        >
          <div className="drop-content">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="drop-icon"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M7 16a4 4 0 01-.88-7.903A5 5 0 0115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
              />
            </svg>

            <div className="drop-text-group">
              <p className="drop-heading">
                {hasAnyFile ? t('drop.subtitle') : t('drop.title')}
              </p>

              <p className="drop-hint">
                JPG, PNG, WebP
              </p>

              <button
                type="button"
                className="btn-upload"
                onClick={() => fileInputRef.current?.click()}
                disabled={isCompressing}
              >
                {hasAnyFile ? '+ Add Images' : 'Choose Images'}
              </button>

              <p className="drop-desktop-hint">
                or drag & drop your images here
              </p>
            </div>
          </div>
        </div>

        <input
          ref={fileInputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp,image/gif,image/avif"
          multiple
          onChange={handleFileSelect}
          style={{ display: 'none' }}
        />

        {/* File cards */}
        {hasAnyFile && (
          <>
            {/* Progress bar */}
            {isCompressing && (
              <div className="progress-section">
                <div className="progress-bar-track">
                  <div className="progress-bar-fill" style={{ width: `${progressPercent}%` }} />
                </div>
                <p className="progress-text">
                  {t('progress.compressOne').replace('{current}', String(completedCount)).replace('{total}', String(files.length))}
                </p>
              </div>
            )}

            {/* File list header */}
            <div className="file-list-header">
              <h2 className="file-list-title">
                {t('fileList.title')} ({files.length})
              </h2>
              <div className="file-list-actions">
                <button onClick={() => fileInputRef.current?.click()} className="btn-small btn-secondary">
                  + {t('button.addFiles')}
                </button>
                <button onClick={handleClearAll} className="btn-small btn-danger" disabled={isCompressing}>
                  {t('button.clearAll')}
                </button>
              </div>
            </div>

            {/* Card grid */}
            <div className="card-grid">
              {files.map(file => (
                <div key={file.id} className={`file-card ${file.status === 'processing' ? 'card-processing' : ''}`}>
                  {/* Remove button */}
                  <button
                    className="card-remove"
                    onClick={() => handleRemoveFile(file.id)}
                    disabled={isCompressing}
                    title={t('button.remove')}
                  >
                    &times;
                  </button>

                  {/* Thumbnail */}
                  <div className="card-preview">
                    <img src={file.preview} alt={file.name} className="card-thumb" />
                    {file.status === 'processing' && <div className="card-spinner" />}
                  </div>

                  {/* Info */}
                  <div className="card-body">
                    <p className="card-name" title={file.name}>{file.name}</p>
                    <div className="card-sizes">
                      <span className="card-original">{getFileSize(file.size)}</span>
                      {file.compressedSize != null && file.status === 'completed' ? (
                        <>
                          <span className="card-arrow">&rarr;</span>
                          <span className="card-compressed">{getFileSize(file.compressedSize)}</span>
                          {(() => {
                            const pct = getSavingPercent(file.size, file.compressedSize)
                            return pct > 0 ? (
                              <span className={`card-saving ${getSavingClass(pct)}`}>-{pct}%</span>
                            ) : null
                          })()}
                        </>
                      ) : (
                        <span className={`card-status-badge status-${file.status}`}>
                          {statusText(file.status)}
                        </span>
                      )}
                    </div>

                    {/* Download single */}
                    {file.status === 'completed' && file.compressedFile && (
                      <button
                        className="btn-card-download"
                        onClick={() => handleDownloadSingle(file.compressedFile!)}
                      >
                        {t('button.download')}
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Bottom action bar */}
            {allDone && completedFiles.length > 0 && (
              <div className="compression-summary">
                <div className="summary-item">
                  <span className="summary-label">Images</span>
                  <strong>{completedFiles.length}</strong>
                </div>

                <div className="summary-item">
                  <span className="summary-label">Original</span>
                  <strong>{getFileSize(totalOriginalSize)}</strong>
                </div>

                <div className="summary-item">
                  <span className="summary-label">Compressed</span>
                  <strong>{getFileSize(totalCompressedSize)}</strong>
                </div>

                <div className="summary-item">
                  <span className="summary-label">
                    {totalSavingPercent > 0 ? 'Saved' : 'Size change'}
                  </span>
                  <strong>
                    {totalSavingPercent > 0
                      ? `${totalSavingPercent}%`
                      : totalSavingPercent === 0
                        ? '0%'
                        : `+${Math.abs(totalSavingPercent)}%`}
                  </strong>
                </div>
              </div>
            )}

            <div className="action-bar">
              {!isCompressing && !allDone && (
                <button onClick={handleCompress} className="btn-primary btn-compress">
                  {t('button.compress')}
                </button>
              )}
              {isCompressing && (
                <button disabled className="btn-primary btn-compress btn-disabled">
                  <span className="btn-spinner" />
                  {t('button.compressing')}
                </button>
              )}
              {allDone && hasCompressed && files.length > 1 && (
                <button onClick={handleDownloadAll} className="btn-primary btn-download">
                  <svg xmlns="http://www.w3.org/2000/svg" className="download-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                  </svg>
                  {t('button.downloadAll')}
                </button>
              )}
              {allDone && files.length === 1 && files[0].compressedFile && (
                <button
                  onClick={() => handleDownloadSingle(files[0].compressedFile!)}
                  className="btn-primary btn-download"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="download-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                  </svg>
                  {t('button.downloadFile')}
                </button>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  )
}

export default App
