import { useRef, useState } from 'react';
import { ImagePlus, X, Link2, Upload, Loader2 } from 'lucide-react';
import { classNames } from '../../utils/helpers';

interface CoverUploadProps {
  value: string; // base64 data url, external url, or empty
  onChange: (url: string) => void;
  /** Height class for the preview area */
  heightClass?: string;
}

const ACCEPTED = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
const MAX_SIZE = 5 * 1024 * 1024; // 5 MB

type InputMode = 'upload' | 'url';

function readFileAsDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

/**
 * Detect whether a URL is a Pinterest pin page (not a direct image).
 * Matches patterns like:
 *   https://www.pinterest.com/pin/123456/
 *   https://pin.it/abc123
 *   https://pinterest.com/pin/123456
 */
function isPinterestPinUrl(url: string): boolean {
  try {
    const u = new URL(url);
    return (
      /(?:^|\.)pinterest\.com$/.test(u.hostname) ||
      u.hostname === 'pin.it' ||
      u.hostname === 'www.pin.it'
    );
  } catch {
    return false;
  }
}

/** Check if a URL points directly to an image file */
function looksLikeImageUrl(url: string): boolean {
  try {
    const u = new URL(url);
    return /\.(jpe?g|png|webp|gif|avif)(\?.*)?$/i.test(u.pathname);
  } catch {
    return false;
  }
}

/**
 * Try to extract the og:image from a Pinterest page via a CORS proxy.
 * Uses allorigins as a free CORS proxy.
 */
async function fetchPinterestImage(pinUrl: string): Promise<string> {
  const proxyUrl = `https://api.allorigins.win/raw?url=${encodeURIComponent(pinUrl)}`;

  const res = await fetch(proxyUrl, { signal: AbortSignal.timeout(10_000) });
  if (!res.ok) throw new Error('Failed to fetch Pinterest page');

  const html = await res.text();

  // Try og:image meta tag first (most reliable)
  const ogMatch = html.match(
    /<meta\s+(?:property|name)=["']og:image["']\s+content=["']([^"']+)["']/i
  ) ?? html.match(
    /<meta\s+content=["']([^"']+)["']\s+(?:property|name)=["']og:image["']/i
  );

  if (ogMatch?.[1]) return ogMatch[1];

  // Fallback: look for pinimg.com URLs in the HTML
  const pinimgMatch = html.match(/https:\/\/i\.pinimg\.com\/[^\s"'<>]+\.(?:jpg|png|webp)/i);
  if (pinimgMatch?.[0]) return pinimgMatch[0];

  throw new Error('Could not find an image on this Pinterest page');
}

/**
 * Convert an external image URL to a base64 data URL via canvas.
 * Falls back to storing the URL directly if CORS blocks the conversion.
 */
async function imageUrlToDataUrl(url: string): Promise<string> {
  return new Promise((resolve) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      try {
        const canvas = document.createElement('canvas');
        canvas.width = img.naturalWidth;
        canvas.height = img.naturalHeight;
        const ctx = canvas.getContext('2d');
        ctx?.drawImage(img, 0, 0);
        resolve(canvas.toDataURL('image/jpeg', 0.85));
      } catch {
        // CORS blocked canvas export — just use the URL directly
        resolve(url);
      }
    };
    img.onerror = () => {
      // Can't load via img tag — store URL directly, browser will handle it
      resolve(url);
    };
    img.src = url;
  });
}

export function CoverUpload({ value, onChange, heightClass = 'h-36' }: CoverUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragOver, setDragOver] = useState(false);
  const [error, setError] = useState('');
  const [mode, setMode] = useState<InputMode>('upload');
  const [urlInput, setUrlInput] = useState('');
  const [loading, setLoading] = useState(false);

  const processFile = async (file: File) => {
    setError('');
    if (!ACCEPTED.includes(file.type)) {
      setError('Only JPG, PNG, WebP and GIF are allowed.');
      return;
    }
    if (file.size > MAX_SIZE) {
      setError('Image must be under 5 MB.');
      return;
    }
    const dataUrl = await readFileAsDataUrl(file);
    onChange(dataUrl);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file) processFile(file);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) processFile(file);
    e.target.value = '';
  };

  const handleUrlFetch = async () => {
    const url = urlInput.trim();
    if (!url) return;

    setError('');
    setLoading(true);

    try {
      let imageUrl = url;

      if (isPinterestPinUrl(url) && !looksLikeImageUrl(url)) {
        // It's a Pinterest page — extract the cover image
        imageUrl = await fetchPinterestImage(url);
      }

      // Convert to base64 for local storage (or keep URL if CORS blocks)
      const result = await imageUrlToDataUrl(imageUrl);
      onChange(result);
      setUrlInput('');
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'Could not fetch the image. Try pasting a direct image URL instead.'
      );
    } finally {
      setLoading(false);
    }
  };

  // ── Preview state ──────────────────────────────────────────────
  if (value) {
    return (
      <div className="space-y-1.5">
        <div className={classNames('relative overflow-hidden rounded-lg', heightClass)}>
          <img src={value} alt="Cover preview" className="h-full w-full object-cover" />
          <button
            type="button"
            onClick={() => onChange('')}
            className="absolute right-1.5 top-1.5 rounded-full bg-ink/60 p-1 text-white backdrop-blur transition-colors hover:bg-ink/80"
            aria-label="Remove cover"
          >
            <X size={14} />
          </button>
        </div>
        <button
          type="button"
          onClick={() => {
            onChange('');
          }}
          className="text-xs font-medium text-brass-600 hover:underline dark:text-brass-300"
        >
          Replace image
        </button>
      </div>
    );
  }

  // ── Empty state — mode toggle + input ──────────────────────────
  return (
    <div className="space-y-2">
      {/* Mode toggle pills */}
      <div className="flex gap-1 rounded-lg bg-ink/5 p-0.5 dark:bg-paper/5">
        <button
          type="button"
          onClick={() => { setMode('upload'); setError(''); }}
          className={classNames(
            'flex flex-1 items-center justify-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-medium transition-colors',
            mode === 'upload'
              ? 'bg-surface text-ink shadow-sm dark:bg-surface-dark dark:text-paper'
              : 'text-ink-muted hover:text-ink dark:text-paper/50 dark:hover:text-paper'
          )}
        >
          <Upload size={13} />
          Upload
        </button>
        <button
          type="button"
          onClick={() => { setMode('url'); setError(''); }}
          className={classNames(
            'flex flex-1 items-center justify-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-medium transition-colors',
            mode === 'url'
              ? 'bg-surface text-ink shadow-sm dark:bg-surface-dark dark:text-paper'
              : 'text-ink-muted hover:text-ink dark:text-paper/50 dark:hover:text-paper'
          )}
        >
          <Link2 size={13} />
          Paste Link
        </button>
      </div>

      {mode === 'upload' ? (
        /* ── File upload drop zone ── */
        <div
          role="button"
          tabIndex={0}
          onClick={() => inputRef.current?.click()}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') inputRef.current?.click();
          }}
          onDragOver={(e) => {
            e.preventDefault();
            setDragOver(true);
          }}
          onDragLeave={() => setDragOver(false)}
          onDrop={handleDrop}
          className={classNames(
            'flex cursor-pointer flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed transition-colors',
            heightClass,
            dragOver
              ? 'border-brass-400 bg-brass-50 dark:border-brass-500 dark:bg-brass-500/10'
              : 'border-ink/10 bg-paper-soft hover:border-ink/20 dark:border-paper/10 dark:bg-bgdark-soft dark:hover:border-paper/20'
          )}
        >
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-ink/5 dark:bg-paper/10">
            <ImagePlus size={18} className="text-ink-muted dark:text-paper/50" />
          </div>
          <div className="text-center">
            <p className="text-xs font-medium text-ink-muted dark:text-paper/60">
              {dragOver ? 'Drop image here' : 'Click or drag to upload'}
            </p>
            <p className="mt-0.5 text-[10px] text-ink-faint dark:text-paper/30">
              JPG, PNG, WebP · Max 5 MB
            </p>
          </div>
        </div>
      ) : (
        /* ── URL paste input ── */
        <div className="space-y-2">
          <input
            type="url"
            value={urlInput}
            onChange={(e) => setUrlInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                handleUrlFetch();
              }
            }}
            placeholder="Paste Pinterest or image URL…"
            disabled={loading}
            className="w-full rounded-lg border border-ink/10 bg-paper px-3 py-2 text-sm text-ink placeholder:text-ink-faint focus:outline-none focus:ring-2 focus:ring-brass-400 dark:border-paper/10 dark:bg-bgdark dark:text-paper dark:placeholder:text-paper/30 disabled:opacity-50"
          />
          <button
            type="button"
            onClick={handleUrlFetch}
            disabled={loading || !urlInput.trim()}
            className={classNames(
              'flex w-full items-center justify-center gap-1.5 rounded-lg px-3 py-2 text-xs font-medium transition-colors',
              loading || !urlInput.trim()
                ? 'bg-ink/5 text-ink-faint cursor-not-allowed dark:bg-paper/5 dark:text-paper/30'
                : 'bg-ink text-paper hover:bg-ink/90 dark:bg-brass-500 dark:text-bgdark dark:hover:bg-brass-400'
            )}
          >
            {loading ? (
              <>
                <Loader2 size={13} className="animate-spin" />
                Fetching…
              </>
            ) : (
              'Fetch Cover'
            )}
          </button>
          <p className="text-[10px] text-ink-faint dark:text-paper/30">
            Works with Pinterest pins, or any direct image link
          </p>
        </div>
      )}

      {error && <p className="text-[11px] text-burgundy-500">{error}</p>}
      <input
        ref={inputRef}
        type="file"
        accept=".jpg,.jpeg,.png,.webp,.gif"
        className="hidden"
        onChange={handleFileChange}
      />
    </div>
  );
}
