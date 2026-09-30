import { useRef, useState } from 'react';
import { useLocale } from '../i18n/context';

export default function ResizeImage() {
  const { t } = useLocale();
  const inputRef = useRef<HTMLInputElement>(null);
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState('');
  const [width, setWidth] = useState('');
  const [height, setHeight] = useState('');
  const [originalWidth, setOriginalWidth] = useState(0);
  const [originalHeight, setOriginalHeight] = useState(0);
  const [lockRatio, setLockRatio] = useState(true);
  const [error, setError] = useState('');

  const chooseFile = (selected: File) => {
    if (!selected.type.startsWith('image/')) {
      setError(t('common.invalidImage'));
      return;
    }

    const url = URL.createObjectURL(selected);
    const img = new Image();

    img.onload = () => {
      setFile(selected);
      setPreview(url);
      setOriginalWidth(img.naturalWidth);
      setOriginalHeight(img.naturalHeight);
      setWidth(String(img.naturalWidth));
      setHeight(String(img.naturalHeight));
      setError('');
    };

    img.onerror = () => {
      URL.revokeObjectURL(url);
      setError('This image could not be opened.');
    };

    img.src = url;
  };

  const changeWidth = (value: string) => {
    setWidth(value);

    if (lockRatio && originalWidth && Number(value) > 0) {
      setHeight(
        String(Math.round((Number(value) / originalWidth) * originalHeight))
      );
    }
  };

  const changeHeight = (value: string) => {
    setHeight(value);

    if (lockRatio && originalHeight && Number(value) > 0) {
      setWidth(
        String(Math.round((Number(value) / originalHeight) * originalWidth))
      );
    }
  };

  const resize = async () => {
    if (!file) return;

    const w = Number(width);
    const h = Number(height);

    if (!w || !h || w < 1 || h < 1) {
      setError(t('resize.invalidDimensions'));
      return;
    }

    try {
      const url = URL.createObjectURL(file);
      const img = new Image();

      await new Promise<void>((resolve, reject) => {
        img.onload = () => resolve();
        img.onerror = reject;
        img.src = url;
      });

      const canvas = document.createElement('canvas');
      canvas.width = Math.round(w);
      canvas.height = Math.round(h);

      const ctx = canvas.getContext('2d');
      if (!ctx) throw new Error('Canvas unavailable');

      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      URL.revokeObjectURL(url);

      const type =
        file.type === 'image/png'
          ? 'image/png'
          : file.type === 'image/webp'
            ? 'image/webp'
            : 'image/jpeg';

      const blob = await new Promise<Blob | null>((resolve) =>
        canvas.toBlob(resolve, type, 0.92)
      );

      if (!blob) throw new Error('Conversion failed');

      const ext = type === 'image/png' ? 'png' : type === 'image/webp' ? 'webp' : 'jpg';
      const name = file.name.replace(/\.[^/.]+$/, '');
      const downloadUrl = URL.createObjectURL(blob);
      const link = document.createElement('a');

      link.href = downloadUrl;
      link.download = `${name}-${canvas.width}x${canvas.height}.${ext}`;
      link.click();

      setTimeout(() => URL.revokeObjectURL(downloadUrl), 1000);
      setError('');
    } catch {
      setError(t('resize.failed'));
    }
  };

  const reset = () => {
    setFile(null);
    setPreview('');
    setWidth('');
    setHeight('');
    setError('');
    if (inputRef.current) inputRef.current.value = '';
  };

  return (
    <main className="resize-page">
      <section className="resize-hero">
        <p className="resize-eyebrow">IMAGE TOOL</p>
        <h1>{t('resize.title')}</h1>
        <p>{t('resize.description')}</p>
      </section>

      <section className="resize-card">
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          hidden
          onChange={(e) => {
            const selected = e.target.files?.[0];
            if (selected) chooseFile(selected);
          }}
        />

        {!file ? (
          <button
            type="button"
            className="resize-upload"
            onClick={() => inputRef.current?.click()}
          >
            <strong>{t('resize.choose')}</strong>
            <span>{t('resize.formatHint')}</span>
          </button>
        ) : (
          <>
            <div className="resize-preview">
              <img src={preview} alt={t('resize.selectedPreview')} />
            </div>

            <p className="resize-original">
              {t('resize.original')}: {originalWidth} × {originalHeight}px
            </p>

            <div className="resize-fields">
              <label>
                {t('resize.width')}
                <input
                  type="number"
                  min="1"
                  value={width}
                  onChange={(e) => changeWidth(e.target.value)}
                />
              </label>

              <span>×</span>

              <label>
                {t('resize.height')}
                <input
                  type="number"
                  min="1"
                  value={height}
                  onChange={(e) => changeHeight(e.target.value)}
                />
              </label>
            </div>

            <label className="resize-lock">
              <input
                type="checkbox"
                checked={lockRatio}
                onChange={(e) => setLockRatio(e.target.checked)}
              />
              {t('resize.keepRatio')}
            </label>

            <div className="resize-actions">
              <button type="button" className="resize-primary" onClick={resize}>
                {t('resize.download')}
              </button>

              <button type="button" className="resize-secondary" onClick={reset}>
                {t('resize.chooseAnother')}
              </button>
            </div>
          </>
        )}

        {error && <p className="resize-error">{error}</p>}
      </section>
    </main>
  );
}
