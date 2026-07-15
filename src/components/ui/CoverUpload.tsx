import { useRef, useState } from 'react';
import { ImagePlus, X } from 'lucide-react';
import { classNames } from '../../utils/helpers';

interface CoverUploadProps {
  value: string; // base64 data url or empty
  onChange: (url: string) => void;
  /** Height class for the preview area */
  heightClass?: string;
  /** When true, cover cannot be changed (view-only mode) */
  disabled?: boolean;
}

const ACCEPTED = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
const MAX_SIZE = 5 * 1024 * 1024; // 5 MB

function readFileAsDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

export function CoverUpload({ value, onChange, heightClass = 'h-36', disabled = false }: CoverUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragOver, setDragOver] = useState(false);
  const [error, setError] = useState('');

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

  // ── Preview state ──────────────────────────────────────────────
  if (value) {
    return (
      <div className="space-y-1.5">
        <div className={classNames('relative overflow-hidden rounded-lg', heightClass)}>
          <img src={value} alt="Cover preview" className="h-full w-full object-contain" />
          {!disabled && (
            <button
              type="button"
              onClick={() => onChange('')}
              className="absolute right-1.5 top-1.5 rounded-full bg-ink/60 p-1 text-white backdrop-blur transition-colors hover:bg-ink/80"
              aria-label="Remove cover"
            >
              <X size={14} />
            </button>
          )}
        </div>
        {!disabled && (
          <button
            type="button"
            onClick={() => onChange('')}
            className="text-xs font-medium text-brass-600 hover:underline dark:text-brass-300"
          >
            Replace image
          </button>
        )}
      </div>
    );
  }

  // When disabled with no cover, show a placeholder
  if (disabled) {
    return (
      <div
        className={classNames(
          'flex items-center justify-center rounded-lg bg-ink/5 dark:bg-paper/5',
          heightClass
        )}
      >
        <span className="text-xs text-ink-faint dark:text-paper/30">No cover</span>
      </div>
    );
  }

  // ── Empty state — upload only ──────────────────────────────────
  return (
    <div className="space-y-2">
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
