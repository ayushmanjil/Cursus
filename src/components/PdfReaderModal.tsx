import { useEffect, useRef, useState, useCallback, forwardRef, memo, createContext, useContext } from 'react';
import * as pdfjsLib from 'pdfjs-dist';
import HTMLFlipBook from 'react-pageflip';
import {
  X, ChevronLeft, ChevronRight, ZoomIn, ZoomOut,
  BookOpen, Loader2, AlertCircle, ExternalLink,
  PanelLeftClose, PanelLeftOpen, LayoutList,
  Bookmark, BookmarkCheck, Sun, Moon,
} from 'lucide-react';
import BookLoader from './ui/BookLoader';
import pdfWorkerUrl from 'pdfjs-dist/build/pdf.worker.min.mjs?url';

pdfjsLib.GlobalWorkerOptions.workerSrc = pdfWorkerUrl;

// ── Types ────────────────────────────────────────────────────────────────────
export interface PdfReaderModalProps {
  pdfUrl: string;
  bookTitle: string;
  bookId?: string;
  initialPage?: number;
  onSavePage?: (page: number) => void;
  onClose: () => void;
}

type PageStatus = 'pending' | 'loading' | 'ready' | 'error';
interface PageState { status: PageStatus; dataUrl?: string; thumbUrl?: string; }

export type ReaderThemeMode = 'dark' | 'light';

export interface ReaderTheme {
  bg: string;
  bgDark: string;
  bgSoft: string;
  sidebar: string;
  border: string;
  borderHover: string;
  brass: string;
  brassLight: string;
  brassGlow: string;
  paper: string;
  ink: string;
  inkMuted: string;
  inkFaint: string;
  forest: string;
  burgundy: string;
  text: string;
  textMuted: string;
  textFaint: string;
  shadow: string;
  isDark: boolean;
}

const THEMES: Record<ReaderThemeMode, ReaderTheme> = {
  dark: {
    bg:          '#0F0C09',
    bgDark:      '#15120E',
    bgSoft:      '#1C1712',
    sidebar:     '#18140F',
    border:      'rgba(184,134,63,0.14)',
    borderHover: 'rgba(184,134,63,0.45)',
    brass:       '#B8863F',
    brassLight:  '#C89A54',
    brassGlow:   'rgba(184,134,63,0.18)',
    paper:       '#FAF7F1',
    ink:         '#211C17',
    inkMuted:    '#6B6459',
    inkFaint:    '#9C9384',
    forest:      '#4B6B58',
    burgundy:    '#8B3A42',
    text:        '#FAF7F1',
    textMuted:   '#9C9384',
    textFaint:   '#4A4238',
    shadow:      '0 24px 48px rgba(0,0,0,0.75), 0 6px 16px rgba(0,0,0,0.45)',
    isDark:      true,
  },
  light: {
    bg:          '#F4EFE6', // authentic warm library parchment
    bgDark:      '#ECE5D8',
    bgSoft:      '#FAF7F1',
    sidebar:     '#EAE1D0',
    border:      'rgba(184,134,63,0.24)',
    borderHover: 'rgba(184,134,63,0.55)',
    brass:       '#976B30',
    brassLight:  '#B8863F',
    brassGlow:   'rgba(184,134,63,0.15)',
    paper:       '#FAF7F1',
    ink:         '#211C17',
    inkMuted:    '#6B6459',
    inkFaint:    '#8E8474',
    forest:      '#3B5546',
    burgundy:    '#8B3A42',
    text:        '#211C17',
    textMuted:   '#6B6459',
    textFaint:   '#9C9384',
    shadow:      '0 20px 40px rgba(70,55,40,0.16), 0 4px 12px rgba(70,55,40,0.08)',
    isDark:      false,
  },
};

const ReaderThemeContext = createContext<{
  T: ReaderTheme;
  themeMode: ReaderThemeMode;
  toggleTheme: () => void;
}>({
  T: THEMES.dark,
  themeMode: 'dark',
  toggleTheme: () => {},
});

function ReaderThemeProvider({ children }: { children: React.ReactNode }) {
  const [themeMode, setThemeMode] = useState<ReaderThemeMode>(() => {
    try {
      const saved = localStorage.getItem('cursus:reader-theme');
      if (saved === 'light' || saved === 'dark') return saved;
      const globalTheme = localStorage.getItem('my-library:theme');
      if (globalTheme === 'light') return 'light';
    } catch {}
    return 'dark';
  });

  const toggleTheme = useCallback(() => {
    setThemeMode(prev => {
      const next = prev === 'dark' ? 'light' : 'dark';
      try { localStorage.setItem('cursus:reader-theme', next); } catch {}
      return next;
    });
  }, []);

  const T = THEMES[themeMode];

  return (
    <ReaderThemeContext.Provider value={{ T, themeMode, toggleTheme }}>
      {children}
    </ReaderThemeContext.Provider>
  );
}

function useReaderThemeContext() {
  return useContext(ReaderThemeContext);
}

function useReaderTheme() {
  return useContext(ReaderThemeContext).T;
}

// ── URL helpers ───────────────────────────────────────────────────────────────
function isGoogleDriveUrl(url: string) {
  return url.includes('drive.google.com') || url.includes('docs.google.com');
}
function extractDriveFileId(url: string): string | null {
  return (
    url.match(/\/file\/d\/([a-zA-Z0-9_-]+)/)?.[1] ??
    url.match(/[?&]id=([a-zA-Z0-9_-]+)/)?.[1] ??
    null
  );
}
function getDriveEmbedUrl(fileId: string) {
  return `https://drive.google.com/file/d/${fileId}/preview?rm=minimal`;
}
function getDriveDownloadUrl(fileId: string) {
  return `https://drive.google.com/uc?export=download&id=${fileId}`;
}

function sanitizePdfUrl(rawUrl: string): string {
  let u = rawUrl.trim();
  const match = u.match(/^(https?:\/\/[^\s]+?\.pdf)/i);
  if (match) {
    u = match[1];
  }
  return u;
}

// In-memory caches for instant zero-latency loads
const pdfDataCache = new Map<string, Uint8Array>();
const pageDataUrlCache = new Map<string, string>();

function getCandidateUrls(rawUrl: string): string[] {
  const sanitized = sanitizePdfUrl(rawUrl);
  const candidates: string[] = [];

  // Prioritize corrected username so we never hit 404 timeouts
  if (sanitized.includes('ayushmanjl')) {
    candidates.push(sanitized.replace(/ayushmanjl/g, 'ayushmanjil'));
  }
  candidates.push(sanitized);
  return candidates;
}

async function fetchPdfBytes(rawUrl: string): Promise<Uint8Array> {
  const isDrive = isGoogleDriveUrl(rawUrl);
  const fileId = isDrive ? extractDriveFileId(rawUrl) : null;
  const directUrl = fileId ? getDriveDownloadUrl(fileId) : sanitizePdfUrl(rawUrl);

  const candidates = getCandidateUrls(directUrl);

  // 1. Check in-memory cache
  for (const c of candidates) {
    const cached = pdfDataCache.get(c);
    if (cached) return cached;
  }

  // 2. Direct high-speed download (typically < 750ms for raw GitHub)
  for (const c of candidates) {
    try {
      const controller = new AbortController();
      const timer = setTimeout(() => controller.abort(), 6000);
      const resp = await fetch(c, { signal: controller.signal });
      clearTimeout(timer);
      if (resp.ok) {
        const buf = await resp.arrayBuffer();
        const bytes = new Uint8Array(buf);
        pdfDataCache.set(c, bytes);
        return bytes;
      }
    } catch {
      // Continue to next candidate
    }
  }

  // 3. Fallback proxies if direct CORS is restricted
  for (const c of candidates) {
    const proxies = [
      `https://corsproxy.io/?${encodeURIComponent(c)}`,
      `https://api.allorigins.win/raw?url=${encodeURIComponent(c)}`,
    ];
    for (const p of proxies) {
      try {
        const controller = new AbortController();
        const timer = setTimeout(() => controller.abort(), 8000);
        const resp = await fetch(p, { signal: controller.signal });
        clearTimeout(timer);
        if (resp.ok) {
          const buf = await resp.arrayBuffer();
          const bytes = new Uint8Array(buf);
          pdfDataCache.set(c, bytes);
          return bytes;
        }
      } catch {
        // Try next proxy
      }
    }
  }

  throw new Error('Could not download PDF. Please verify the link is a direct, public URL.');
}

// ── PDF loading ───────────────────────────────────────────────────────────────
async function loadPdfDocument(url: string): Promise<pdfjsLib.PDFDocumentProxy> {
  const data = await fetchPdfBytes(url);
  return await pdfjsLib.getDocument({ data }).promise;
}

async function renderToDataUrl(
  pdf: pdfjsLib.PDFDocumentProxy,
  pageNum: number,
  scale: number
): Promise<string> {
  const cacheKey = `${(pdf as any).fingerprint || 'pdf'}_${pageNum}_${scale}`;
  const cached = pageDataUrlCache.get(cacheKey);
  if (cached) return cached;

  const page     = await pdf.getPage(pageNum);
  const viewport = page.getViewport({ scale });
  const canvas   = document.createElement('canvas');
  canvas.width   = viewport.width;
  canvas.height  = viewport.height;
  await page.render({ canvasContext: canvas.getContext('2d')!, viewport }).promise;
  const dataUrl = canvas.toDataURL('image/jpeg', 0.84);
  pageDataUrlCache.set(cacheKey, dataUrl);
  return dataUrl;
}

// ── Shared toolbar ────────────────────────────────────────────────────────────
function Toolbar({
  bookTitle, currentPage, numPages, zoom, sidebarOpen,
  onClose, onPrev, onNext, onZoomIn, onZoomOut, onToggleSidebar,
  onPageInput, isDriveMode = false, externalUrl,
  viewMode, onToggleViewMode,
  bookmarkedPage, onJumpToBookmark,
}: {
  bookTitle: string; currentPage: number; numPages: number; zoom: number;
  sidebarOpen: boolean; isDriveMode?: boolean; externalUrl?: string;
  viewMode?: 'document' | 'book'; onToggleViewMode?: () => void;
  onClose: () => void; onPrev: () => void; onNext: () => void;
  onZoomIn: () => void; onZoomOut: () => void;
  onToggleSidebar: () => void; onPageInput: (n: number) => void;
  bookmarkedPage?: number | null; onJumpToBookmark?: () => void;
}) {
  const { T, themeMode, toggleTheme } = useReaderThemeContext();
  const [inputVal, setInputVal] = useState(String(currentPage));

  useEffect(() => setInputVal(String(currentPage)), [currentPage]);

  return (
    <div style={{
      height: 52,
      background: T.bgDark,
      borderBottom: `1px solid ${T.border}`,
      display: 'flex',
      alignItems: 'center',
      gap: 0,
      flexShrink: 0,
      userSelect: 'none',
      transition: 'background 0.2s ease, border-color 0.2s ease',
    }}>

      {/* Close */}
      <ToolBtn onClick={onClose} title="Close (Esc)">
        <X size={16} />
      </ToolBtn>

      {/* Sidebar toggle */}
      <ToolBtn onClick={onToggleSidebar} title="Toggle thumbnails" active={sidebarOpen}>
        {sidebarOpen ? <PanelLeftClose size={16} /> : <PanelLeftOpen size={16} />}
      </ToolBtn>

      <div style={{ width: 1, height: 24, background: T.border, margin: '0 4px' }} />

      {/* Book title */}
      <div style={{ flex: 1, padding: '0 12px', minWidth: 0 }}>
        <div style={{
          fontFamily: '"Fraunces", Georgia, serif',
          fontSize: 14,
          fontWeight: 600,
          color: T.text,
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          whiteSpace: 'nowrap',
          letterSpacing: '0.01em',
        }}>
          {bookTitle}
        </div>
        {isDriveMode && (
          <div style={{ fontSize: 10, color: T.brass, fontFamily: 'Inter', letterSpacing: '0.04em' }}>
            Google Drive viewer
          </div>
        )}
      </div>


      {/* Page nav — only when we know total */}
      {numPages > 0 && (
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '0 8px' }}>
          <ToolBtn onClick={onPrev} disabled={currentPage <= 1} title="Previous page (←)">
            <ChevronLeft size={16} />
          </ToolBtn>

          <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
            <input
              value={inputVal}
              onChange={e => setInputVal(e.target.value)}
              onKeyDown={e => {
                if (e.key === 'Enter') {
                  const n = parseInt(inputVal, 10);
                  if (!isNaN(n) && n >= 1 && n <= numPages) onPageInput(n);
                  else setInputVal(String(currentPage));
                }
              }}
              onBlur={() => setInputVal(String(currentPage))}
              style={{
                width: 38,
                height: 26,
                textAlign: 'center',
                background: T.bg,
                border: `1px solid ${T.border}`,
                borderRadius: 6,
                color: T.text,
                fontSize: 12,
                fontFamily: 'Inter',
                outline: 'none',
              }}
              onFocus={e => e.target.select()}
            />
            <span style={{ fontSize: 11, color: T.textMuted, fontFamily: 'Inter', whiteSpace: 'nowrap' }}>
              / {numPages}
            </span>
          </div>

          <ToolBtn onClick={onNext} disabled={currentPage >= numPages} title="Next page (→)">
            <ChevronRight size={16} />
          </ToolBtn>
        </div>
      )}

      {/* Jump to Bookmark button */}
      {bookmarkedPage && bookmarkedPage !== currentPage && onJumpToBookmark && (
        <button
          onClick={onJumpToBookmark}
          title={`Jump to saved bookmark on page ${bookmarkedPage}`}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 5,
            padding: '4px 11px',
            margin: '0 4px',
            borderRadius: 14,
            background: T.isDark ? 'rgba(184,134,63,0.18)' : 'rgba(184,134,63,0.14)',
            border: `1px solid ${T.isDark ? 'rgba(184,134,63,0.45)' : 'rgba(184,134,63,0.38)'}`,
            color: T.brassLight,
            fontSize: 12,
            fontFamily: 'Inter, sans-serif',
            fontWeight: 500,
            cursor: 'pointer',
            transition: 'all 0.18s ease',
            whiteSpace: 'nowrap',
            flexShrink: 0,
            outline: 'none',
          }}
          onMouseEnter={e => {
            e.currentTarget.style.background = T.isDark ? 'rgba(184,134,63,0.28)' : 'rgba(184,134,63,0.22)';
            e.currentTarget.style.transform = 'translateY(-1px)';
          }}
          onMouseLeave={e => {
            e.currentTarget.style.background = T.isDark ? 'rgba(184,134,63,0.18)' : 'rgba(184,134,63,0.14)';
            e.currentTarget.style.transform = 'translateY(0)';
          }}
        >
          <Bookmark size={12} style={{ fill: T.brass, color: T.brass }} />
          <span>Jump to p. {bookmarkedPage}</span>
        </button>
      )}

      {/* Zoom — only in document mode */}
      {!viewMode || viewMode === 'document' ? (
        <>
          <ToolBtn onClick={onZoomOut} disabled={zoom <= 0.5} title="Zoom out (-)"><ZoomOut size={16} /></ToolBtn>
          <div style={{ fontSize: 11, color: T.brass, fontFamily: 'Inter', minWidth: 36, textAlign: 'center', fontVariantNumeric: 'tabular-nums' }}>
            {Math.round(zoom * 100)}%
          </div>
          <ToolBtn onClick={onZoomIn} disabled={zoom >= 3} title="Zoom in (+)"><ZoomIn size={16} /></ToolBtn>
          <div style={{ width: 1, height: 24, background: T.border, margin: '0 4px' }} />
        </>
      ) : null}

      {/* View mode toggle */}
      {onToggleViewMode && (
        <div style={{ display: 'flex', gap: 2, padding: '0 4px' }}>
          <ToolBtn
            onClick={() => { if (viewMode === 'book') onToggleViewMode(); }}
            active={viewMode === 'document'}
            title="Document reader"
          >
            <LayoutList size={15} />
          </ToolBtn>
          <ToolBtn
            onClick={() => { if (viewMode === 'document') onToggleViewMode(); }}
            active={viewMode === 'book'}
            title="Book flip"
          >
            <BookOpen size={15} />
          </ToolBtn>
        </div>
      )}

      {onToggleViewMode && <div style={{ width: 1, height: 24, background: T.border, margin: '0 4px' }} />}

      {/* Theme toggle: Dark / Light mode */}
      <ToolBtn
        onClick={toggleTheme}
        title={themeMode === 'dark' ? 'Switch to Parchment Light mode' : 'Switch to Night Dark mode'}
      >
        {themeMode === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
      </ToolBtn>

      {/* External link */}
      {externalUrl && (
        <a href={externalUrl} target="_blank" rel="noopener noreferrer" title="Open in Google Drive" style={{ textDecoration: 'none' }}>
          <ToolBtn as="span"><ExternalLink size={15} /></ToolBtn>
        </a>
      )}
    </div>
  );
}

// ── ToolBtn ───────────────────────────────────────────────────────────────────
function ToolBtn({
  children, onClick, disabled, title, active, as: _as,
}: {
  children: React.ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  title?: string;
  active?: boolean;
  as?: string;
}) {
  const T = useReaderTheme();
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      title={title}
      style={{
        width: 36,
        height: 36,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: active ? T.brassGlow : 'none',
        border: 'none',
        borderRadius: 7,
        color: disabled ? T.textFaint : active ? T.brassLight : T.textMuted,
        cursor: disabled ? 'default' : 'pointer',
        transition: 'all 0.15s',
        flexShrink: 0,
        margin: '0 1px',
      }}
      onMouseEnter={e => {
        if (!disabled) {
          (e.currentTarget as HTMLElement).style.background = T.brassGlow;
          (e.currentTarget as HTMLElement).style.color = T.brassLight;
        }
      }}
      onMouseLeave={e => {
        if (!disabled && !active) {
          (e.currentTarget as HTMLElement).style.background = 'none';
          (e.currentTarget as HTMLElement).style.color = T.textMuted;
        }
      }}
    >
      {children}
    </button>
  );
}

// ── Thumbnail sidebar ─────────────────────────────────────────────────────────
function ThumbnailSidebar({
  pages, currentPage, numPages, onSelect,
}: {
  pages: PageState[];
  currentPage: number;
  numPages: number;
  onSelect: (n: number) => void;
}) {
  const T = useReaderTheme();
  const activeRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    activeRef.current?.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
  }, [currentPage]);

  return (
    <div style={{
      width: 164,
      background: T.sidebar,
      borderRight: `1px solid ${T.border}`,
      display: 'flex',
      flexDirection: 'column',
      flexShrink: 0,
      overflow: 'hidden',
    }}>
      {/* Sidebar header */}
      <div style={{
        padding: '10px 12px 8px',
        fontSize: 9,
        fontFamily: 'Inter',
        fontWeight: 700,
        letterSpacing: '0.12em',
        color: T.brass,
        textTransform: 'uppercase',
        borderBottom: `1px solid ${T.border}`,
        flexShrink: 0,
      }}>
        Pages · {numPages}
      </div>

      {/* Thumbnail list */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '8px 10px', display: 'flex', flexDirection: 'column', gap: 8 }}
        className="scrollbar-thin"
      >
        {Array.from({ length: numPages }, (_, i) => {
          const pageNum   = i + 1;
          const isActive  = pageNum === currentPage;
          const pageState = pages[i] ?? { status: 'pending' };

          return (
            <button
              key={pageNum}
              ref={isActive ? activeRef : undefined}
              onClick={() => onSelect(pageNum)}
              style={{
                background: isActive ? 'rgba(184,134,63,0.10)' : 'rgba(250,247,241,0.02)',
                border: `1.5px solid ${isActive ? T.brass : 'rgba(250,247,241,0.06)'}`,
                borderRadius: 6,
                padding: 4,
                cursor: 'pointer',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: 5,
                transition: 'all 0.15s',
                boxShadow: isActive ? `0 0 12px ${T.brassGlow}` : 'none',
                outline: 'none',
              }}
              onMouseEnter={e => {
                if (!isActive) {
                  (e.currentTarget as HTMLElement).style.borderColor = T.borderHover;
                  (e.currentTarget as HTMLElement).style.background = 'rgba(184,134,63,0.05)';
                }
              }}
              onMouseLeave={e => {
                if (!isActive) {
                  (e.currentTarget as HTMLElement).style.borderColor = 'rgba(250,247,241,0.06)';
                  (e.currentTarget as HTMLElement).style.background = 'rgba(250,247,241,0.02)';
                }
              }}
            >
              {/* Thumbnail image / placeholder */}
              <div style={{
                width: '100%',
                aspectRatio: '0.707',
                background: pageState.thumbUrl ? 'transparent' : T.bgDark,
                borderRadius: 3,
                overflow: 'hidden',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}>
                {pageState.thumbUrl ? (
                  <img
                    src={pageState.thumbUrl}
                    alt={`Page ${pageNum}`}
                    style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                    draggable={false}
                  />
                ) : (
                  <div style={{ color: T.textFaint, fontSize: 10 }}>
                    {pageState.status === 'loading'
                      ? <Loader2 size={14} style={{ animation: 'spin 1s linear infinite' }} />
                      : <BookOpen size={14} />}
                  </div>
                )}
              </div>

              {/* Page number */}
              <span style={{
                fontSize: 9,
                fontFamily: 'Inter',
                color: isActive ? T.brass : T.textFaint,
                letterSpacing: '0.06em',
                fontWeight: isActive ? 600 : 400,
              }}>
                {pageNum}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

// ── Main page display ─────────────────────────────────────────────────────────
function PageDisplay({
  pageState, pageNum, zoom,
}: {
  pageState: PageState;
  pageNum: number;
  zoom: number;
}) {
  const T = useReaderTheme();
  return (
    <div style={{
      flex: 1,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: T.bg,
      overflow: 'auto',
      position: 'relative',
    }}
      className="scrollbar-thin"
    >
      {/* Warm radial glow */}
      <div style={{
        position: 'absolute',
        inset: 0,
        background: 'radial-gradient(ellipse 60% 50% at 50% 50%, rgba(184,134,63,0.05) 0%, transparent 70%)',
        pointerEvents: 'none',
      }} />

      {pageState.status === 'ready' && pageState.dataUrl ? (
        <div style={{
          transform: `scale(${zoom})`,
          transformOrigin: 'center center',
          transition: 'transform 0.2s ease',
          boxShadow: '0 2px 8px rgba(0,0,0,0.5), 0 12px 40px rgba(0,0,0,0.6), 0 32px 80px rgba(0,0,0,0.4)',
          lineHeight: 0,
          borderRadius: 2,
          overflow: 'hidden',
          border: '1px solid rgba(255,255,255,0.06)',
        }}>
          <img
            src={pageState.dataUrl}
            alt={`Page ${pageNum}`}
            style={{ display: 'block', maxWidth: '75vw', maxHeight: 'calc(100vh - 100px)', objectFit: 'contain' }}
            draggable={false}
          />
        </div>
      ) : pageState.status === 'error' ? (
        <div style={{ textAlign: 'center', color: T.textMuted, fontFamily: 'Inter' }}>
          <AlertCircle size={32} style={{ margin: '0 auto 12px', color: T.burgundy }} />
          <p style={{ fontSize: 13 }}>Failed to render page {pageNum}</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 14, color: T.textMuted }}>
          <div style={{
            width: 280,
            height: 400,
            background: 'rgba(250,247,241,0.03)',
            borderRadius: 6,
            border: `1px solid ${T.border}`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexDirection: 'column',
            gap: 16,
          }}>
            <BookLoader size="md" color={T.isDark ? 'brass' : 'brown'} />
            <span style={{ fontSize: 12, fontFamily: 'Inter', color: T.brass }}>Rendering page {pageNum}…</span>
          </div>
        </div>
      )}

      {/* Page number badge at bottom */}
      {pageState.status === 'ready' && (
        <div style={{
          position: 'absolute',
          bottom: 14,
          left: '50%',
          transform: 'translateX(-50%)',
          fontSize: 10,
          fontFamily: 'Inter',
          color: T.brass,
          background: 'rgba(21,18,14,0.7)',
          border: `1px solid ${T.border}`,
          borderRadius: 20,
          padding: '3px 12px',
          backdropFilter: 'blur(8px)',
          letterSpacing: '0.06em',
          pointerEvents: 'none',
        }}>
          {pageNum}
        </div>
      )}
    </div>
  );
}

// ── PdfPage — forwarded ref for react-pageflip ────────────────────────────────
const PdfPage = forwardRef<HTMLDivElement, { pageState: PageState; pageNum: number }>(
  ({ pageState, pageNum }, ref) => {
    const T = useReaderTheme();
    return (
      <div
        ref={ref}
        style={{
          background: T.paper,
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          position: 'relative',
          overflow: 'hidden',
          boxSizing: 'border-box',
        }}
      >
        {pageState.status === 'ready' && pageState.dataUrl ? (
          <img
            src={pageState.dataUrl}
            alt={`Page ${pageNum}`}
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'contain',
              display: 'block',
              pointerEvents: 'none',
              userSelect: 'none',
            }}
            draggable={false}
          />
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6, color: T.inkMuted }}>
            <span style={{ fontSize: 11, fontFamily: 'Inter', color: T.inkFaint }}>Page {pageNum}</span>
          </div>
        )}
        <div
          style={{
            position: 'absolute',
            bottom: 10,
            left: 0,
            right: 0,
            textAlign: 'center',
            fontSize: 10,
            color: '#C8B9A4',
            fontFamily: 'Inter',
            letterSpacing: '0.05em',
            pointerEvents: 'none',
          }}
        >
          {pageNum}
        </div>
      </div>
    );
  }
);
PdfPage.displayName = 'PdfPage';

// ── PDFJS READER MODE ─────────────────────────────────────────────────────────
function PdfJsReaderMode({ pdfUrl, bookTitle, bookId, initialPage, onSavePage, onClose }: PdfReaderModalProps) {
  const T = useReaderTheme();
  const [pdfDoc,      setPdfDoc]      = useState<pdfjsLib.PDFDocumentProxy | null>(null);
  const [numPages,    setNumPages]    = useState(0);
  const [pages,       setPages]       = useState<PageState[]>([]);
  const [zoom,        setZoom]        = useState(1);
  const [loadingPdf,  setLoadingPdf]  = useState(true);
  const [flipReady,   setFlipReady]   = useState(false);
  const [error,       setError]       = useState<string | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [viewMode,    setViewMode]    = useState<'document' | 'book'>('book');

  // Bookmark storage key & state
  const bookmarkStorageKey = `cursus:bookmark:${bookId || bookTitle || pdfUrl}`;
  const [bookmarkedPage, setBookmarkedPage] = useState<number | null>(() => {
    try {
      const saved = localStorage.getItem(bookmarkStorageKey);
      if (saved) {
        const n = parseInt(saved, 10);
        if (!isNaN(n) && n >= 1) return n;
      }
    } catch {}
    if (initialPage && initialPage >= 1) return initialPage;
    return null;
  });

  // Current page initializes directly at saved bookmark or initialPage
  const [currentPage, setCurrentPage] = useState<number>(() => {
    try {
      const saved = localStorage.getItem(bookmarkStorageKey);
      if (saved) {
        const n = parseInt(saved, 10);
        if (!isNaN(n) && n >= 1) return n;
      }
    } catch {}
    if (initialPage && initialPage >= 1) return initialPage;
    return 1;
  });

  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Notify user if resumed from bookmark
  useEffect(() => {
    if (bookmarkedPage && bookmarkedPage > 1) {
      setToastMessage(`🔖 Resumed from bookmark at page ${bookmarkedPage}`);
      const t = setTimeout(() => setToastMessage(null), 3500);
      return () => clearTimeout(t);
    }
  }, []);

  const handleToggleBookmark = useCallback(() => {
    if (bookmarkedPage === currentPage) {
      setBookmarkedPage(null);
      try { localStorage.removeItem(bookmarkStorageKey); } catch {}
      setToastMessage('Bookmark removed');
    } else {
      setBookmarkedPage(currentPage);
      try { localStorage.setItem(bookmarkStorageKey, String(currentPage)); } catch {}
      onSavePage?.(currentPage);
      setToastMessage(`🔖 Bookmark saved at page ${currentPage}`);
    }
    const t = setTimeout(() => setToastMessage(null), 3000);
    return () => clearTimeout(t);
  }, [bookmarkedPage, currentPage, bookmarkStorageKey, onSavePage]);

  const flipBookRef      = useRef<any>(null);
  const renderingDisplay = useRef<Set<number>>(new Set());
  const renderingThumb   = useRef<Set<number>>(new Set());

  // Responsive 2-page spread sizing: fills screen leaving room for toolbar + side margins
  const [flipPageSize, setFlipPageSize] = useState({ width: 460, height: 650 });
  const [pdfAspectRatio, setPdfAspectRatio] = useState(0.707);

  // Measure actual PDF page aspect ratio once loaded
  useEffect(() => {
    if (!pdfDoc) return;
    pdfDoc.getPage(1).then(page => {
      const vp = page.getViewport({ scale: 1 });
      if (vp.width && vp.height) {
        setPdfAspectRatio(vp.width / vp.height);
      }
    }).catch(() => {});
  }, [pdfDoc]);

  // Compute full-screen dimensions for 2-page spread
  useEffect(() => {
    function compute() {
      const maxH = Math.max(280, window.innerHeight - 52 - 16);
      const maxSpreadW = Math.max(380, window.innerWidth - 116);
      const maxSingleW = Math.floor(maxSpreadW / 2);

      let w = maxSingleW;
      let h = Math.round(w / pdfAspectRatio);
      if (h > maxH) {
        h = maxH;
        w = Math.round(h * pdfAspectRatio);
      }
      setFlipPageSize({ width: Math.floor(w), height: Math.floor(h) });
    }
    compute();
    window.addEventListener('resize', compute);
    return () => window.removeEventListener('resize', compute);
  }, [pdfAspectRatio]);

  // ── Load PDF ──
  useEffect(() => {
    let cancelled = false;
    setLoadingPdf(true);
    setFlipReady(false);
    setError(null);
    setPdfDoc(null);

    loadPdfDocument(pdfUrl)
      .then(doc => {
        if (cancelled) return;
        setPdfDoc(doc);
        setNumPages(doc.numPages);
        const initPages = Array.from({ length: doc.numPages }, () => ({ status: 'pending' as PageStatus }));
        setPages(initPages);
        setLoadingPdf(false);
      })
      .catch(e => {
        if (!cancelled) { setError(e.message); setLoadingPdf(false); }
      });

    return () => { cancelled = true; };
  }, [pdfUrl]);

  // Flipbook readiness safety timer
  useEffect(() => {
    if (!loadingPdf && pages.length > 0 && !flipReady) {
      const timer = setTimeout(() => {
        setFlipReady(true);
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [loadingPdf, pages.length, flipReady]);

  // ── Render display page ──
  const renderDisplay = useCallback(async (doc: pdfjsLib.PDFDocumentProxy, n: number) => {
    if (renderingDisplay.current.has(n)) return;
    renderingDisplay.current.add(n);
    setPages(p => { const a = [...p]; a[n-1] = { ...a[n-1], status: 'loading' }; return a; });
    try {
      const dataUrl = await renderToDataUrl(doc, n, 1.4);
      setPages(p => { const a = [...p]; a[n-1] = { ...a[n-1], status: 'ready', dataUrl }; return a; });
    } catch {
      setPages(p => { const a = [...p]; a[n-1] = { ...a[n-1], status: 'error' }; return a; });
    }
  }, []);

  // ── Render thumbnail ──
  const renderThumb = useCallback(async (doc: pdfjsLib.PDFDocumentProxy, n: number) => {
    if (renderingThumb.current.has(n)) return;
    renderingThumb.current.add(n);
    try {
      const thumbUrl = await renderToDataUrl(doc, n, 0.2);
      setPages(p => { const a = [...p]; a[n-1] = { ...a[n-1], thumbUrl }; return a; });
    } catch { /* silent fail for thumbnails */ }
  }, []);

  // ── Priority-render visible & nearby pages ──
  useEffect(() => {
    if (!pdfDoc || !pages.length) return;
    const offsets = viewMode === 'book' ? [0, 1, -1, 2, 3] : [0, 1, -1, 2];
    for (const off of offsets) {
      const n = currentPage + off;
      if (n >= 1 && n <= numPages && pages[n-1]?.status === 'pending') {
        renderDisplay(pdfDoc, n);
      }
    }
  }, [currentPage, pdfDoc, numPages, pages, renderDisplay, viewMode]);

  // ── Progressive thumbnail rendering (ONLY when in document mode with sidebar open) ──
  useEffect(() => {
    if (!pdfDoc || !pages.length || viewMode !== 'document' || !sidebarOpen) return;
    let i = 0;
    const interval = setInterval(() => {
      while (i < numPages) {
        const n = i + 1; i++;
        if (!pages[n-1]?.thumbUrl && !renderingThumb.current.has(n)) {
          renderThumb(pdfDoc, n);
          return;
        }
      }
      clearInterval(interval);
    }, 150);
    return () => clearInterval(interval);
  }, [pdfDoc, numPages, pages, renderThumb, viewMode, sidebarOpen]);

  // ── Keyboard shortcuts ──
  useEffect(() => {
    const h = (e: KeyboardEvent) => {
      if (e.key === 'Escape') { onClose(); return; }
      if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
        if (viewMode === 'book') flipBookRef.current?.pageFlip()?.flipNext();
        else setCurrentPage(p => Math.min(numPages, p + 1));
      }
      if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
        if (viewMode === 'book') flipBookRef.current?.pageFlip()?.flipPrev();
        else setCurrentPage(p => Math.max(1, p - 1));
      }
      if (e.key === '=' || e.key === '+') setZoom(z => Math.min(3, +(z + 0.15).toFixed(2)));
      if (e.key === '-') setZoom(z => Math.max(0.5, +(z - 0.15).toFixed(2)));
    };
    window.addEventListener('keydown', h);
    return () => window.removeEventListener('keydown', h);
  }, [onClose, numPages, viewMode]);

  const pageState = pages[currentPage - 1] ?? { status: 'pending' };

  const handlePrev = () => {
    if (viewMode === 'book') flipBookRef.current?.pageFlip()?.flipPrev();
    else setCurrentPage(p => Math.max(1, p - 1));
  };
  const handleNext = () => {
    if (viewMode === 'book') flipBookRef.current?.pageFlip()?.flipNext();
    else setCurrentPage(p => Math.min(numPages, p + 1));
  };

  const handleJumpToBookmark = useCallback(() => {
    if (!bookmarkedPage) return;
    setCurrentPage(bookmarkedPage);
    if (viewMode === 'book') {
      flipBookRef.current?.pageFlip()?.turnToPage(bookmarkedPage - 1);
    }
  }, [bookmarkedPage, viewMode]);

  const isCurrentPageBookmarked = bookmarkedPage === currentPage;

  return (
    <Shell>
      <Toolbar
        bookTitle={bookTitle}
        currentPage={currentPage}
        numPages={numPages}
        zoom={zoom}
        sidebarOpen={sidebarOpen && viewMode === 'document'}
        viewMode={viewMode}
        onToggleViewMode={() => setViewMode(v => v === 'document' ? 'book' : 'document')}
        onClose={onClose}
        onPrev={handlePrev}
        onNext={handleNext}
        onZoomIn={() => setZoom(z => Math.min(3, +(z + 0.15).toFixed(2)))}
        onZoomOut={() => setZoom(z => Math.max(0.5, +(z - 0.15).toFixed(2)))}
        onToggleSidebar={() => setSidebarOpen(v => !v)}
        onPageInput={n => {
          setCurrentPage(n);
          if (viewMode === 'book') flipBookRef.current?.pageFlip()?.turnToPage(n - 1);
        }}
        bookmarkedPage={bookmarkedPage}
        onJumpToBookmark={handleJumpToBookmark}
      />

      <div style={{ flex: 1, display: 'flex', overflow: 'hidden', position: 'relative' }}>
        {/* Toast notification banner */}
        {toastMessage && (
          <div style={{
            position: 'absolute',
            bottom: 24,
            left: '50%',
            transform: 'translateX(-50%)',
            zIndex: 60,
            background: T.isDark ? 'rgba(21,18,14,0.92)' : 'rgba(250,247,241,0.95)',
            border: `1px solid ${T.border}`,
            color: T.text,
            padding: '8px 20px',
            borderRadius: 24,
            fontSize: 12,
            fontFamily: 'Inter',
            fontWeight: 500,
            boxShadow: '0 8px 28px rgba(0,0,0,0.3)',
            backdropFilter: 'blur(10px)',
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            pointerEvents: 'none',
          }}>
            <span>{toastMessage}</span>
          </div>
        )}

        {error ? (
          <ErrorScreen error={error} url={pdfUrl} />
        ) : (
          <>
            {/* Seamless loader overlay until PDF is parsed AND flipbook has initialized */}
            {(loadingPdf || (viewMode === 'book' && !flipReady)) && (
              <div style={{
                position: 'absolute',
                inset: 0,
                zIndex: 80,
                background: T.bg,
                display: 'flex',
                flexDirection: 'column',
              }}>
                <LoadingScreen message="Opening your book…" bookTitle={bookTitle} />
              </div>
            )}

            {!loadingPdf && (viewMode === 'book' ? (
              /* ── Book flip mode ── */
              <div style={{
                flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center',
                background: 'transparent', position: 'relative', overflow: 'hidden',
                padding: '8px 56px',
                transition: 'opacity 0.25s ease, background 0.25s ease',
                opacity: flipReady ? 1 : 0,
                visibility: flipReady ? 'visible' : 'hidden',
                pointerEvents: flipReady ? 'auto' : 'none',
              }}>
            {/* Interactive "Bookmark here" Ribbon Widget */}
            <div style={{
              position: 'absolute',
              top: 12,
              right: 68,
              zIndex: 35,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'flex-end',
              gap: 6,
            }}>
              <button
                onClick={handleToggleBookmark}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 6,
                  padding: isCurrentPageBookmarked ? '7px 15px' : '6px 13px',
                  background: isCurrentPageBookmarked
                    ? 'linear-gradient(135deg, #8B3A42 0%, #6F2E35 100%)'
                    : T.isDark ? 'rgba(21,18,14,0.85)' : 'rgba(250,247,241,0.94)',
                  color: isCurrentPageBookmarked ? '#FAF7F1' : T.text,
                  border: `1px solid ${isCurrentPageBookmarked ? 'rgba(184,134,63,0.55)' : T.border}`,
                  borderRadius: '7px 7px 12px 12px',
                  boxShadow: isCurrentPageBookmarked
                    ? '0 6px 18px rgba(139,58,66,0.35), 0 0 0 1px rgba(184,134,63,0.25)'
                    : '0 4px 14px rgba(0,0,0,0.18)',
                  cursor: 'pointer',
                  fontSize: 12,
                  fontFamily: 'Inter, sans-serif',
                  fontWeight: 500,
                  backdropFilter: 'blur(8px)',
                  transition: 'all 0.18s ease',
                  outline: 'none',
                  userSelect: 'none',
                }}
                onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(2px)'; }}
                onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; }}
                title={isCurrentPageBookmarked ? `Bookmarked on page ${currentPage}. Click to remove.` : `Bookmark page ${currentPage}`}
              >
                {isCurrentPageBookmarked ? (
                  <>
                    <BookmarkCheck size={14} style={{ color: '#E5C1C4' }} />
                    <span>Bookmarked (p. {currentPage})</span>
                  </>
                ) : (
                  <>
                    <Bookmark size={13} style={{ color: T.brass }} />
                    <span style={{ color: T.textMuted }}>Bookmark here</span>
                  </>
                )}
              </button>
            </div>

            {/* Warm desk glow / vignette */}
            <div style={{
              position: 'absolute', inset: 0, pointerEvents: 'none',
              background: T.deskVignette,
            }} />
            <div style={{
              filter: T.shadow,
              willChange: 'transform',
              transform: 'translateZ(0)',
            }}>
              <HTMLFlipBook
                ref={flipBookRef}
                width={flipPageSize.width}
                height={flipPageSize.height}
                size="fixed"
                minWidth={200} minHeight={280} maxWidth={1600} maxHeight={2000}
                drawShadow={true}
                flippingTime={380}
                usePortrait={false}
                startPage={Math.max(0, currentPage - 1)}
                style={{ margin: '0 auto' }} startZIndex={10} autoSize={false}
                maxShadowOpacity={T.isDark ? 0.25 : 0.18}
                showCover={false}
                mobileScrollSupport={true}
                onFlip={(e: any) => setCurrentPage(Math.max(1, (e.data as number) + 1))}
                onChangeOrientation={() => {}} onChangeState={() => {}}
                onInit={() => setFlipReady(true)}
                className="" clickEventForward={true} useMouseEvents={true}
                swipeDistance={30} showPageCorners={true}
              >
                {pages.map((ps, i) => (
                  <PdfPage key={i} pageState={ps} pageNum={i + 1} />
                ))}
              </HTMLFlipBook>
            </div>
            {/* Nav arrows with proper margin */}
            <button
              onClick={handlePrev} disabled={currentPage <= 1}
              style={{
                position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)',
                width: 44, height: 44, borderRadius: '50%',
                border: `1px solid ${T.border}`,
                background: T.isDark ? 'rgba(21,18,14,0.85)' : 'rgba(250,247,241,0.9)',
                color: currentPage <= 1 ? T.textFaint : T.brass,
                cursor: currentPage <= 1 ? 'default' : 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                backdropFilter: 'blur(8px)', transition: 'all 0.2s',
                zIndex: 20,
              }}
              title="Previous page (Left Arrow)"
            ><ChevronLeft size={22} /></button>
            <button
              onClick={handleNext} disabled={currentPage >= numPages}
              style={{
                position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)',
                width: 44, height: 44, borderRadius: '50%',
                border: `1px solid ${T.border}`,
                background: T.isDark ? 'rgba(21,18,14,0.85)' : 'rgba(250,247,241,0.9)',
                color: currentPage >= numPages ? T.textFaint : T.brass,
                cursor: currentPage >= numPages ? 'default' : 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                backdropFilter: 'blur(8px)', transition: 'all 0.2s',
                zIndex: 20,
              }}
              title="Next page (Right Arrow)"
            ><ChevronRight size={22} /></button>
          </div>
        ) : (
          /* ── Document mode ── */
          <div style={{ flex: 1, display: 'flex', position: 'relative', overflow: 'hidden' }}>
            {sidebarOpen && numPages > 0 && (
              <ThumbnailSidebar
                pages={pages} currentPage={currentPage}
                numPages={numPages} onSelect={n => setCurrentPage(n)}
              />
            )}
            <div style={{ flex: 1, display: 'flex', position: 'relative', overflow: 'hidden' }}>
              {/* Document mode Bookmark Widget */}
              <div style={{
                position: 'absolute',
                top: 14,
                right: 28,
                zIndex: 35,
              }}>
                <button
                  onClick={handleToggleBookmark}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 6,
                    padding: isCurrentPageBookmarked ? '7px 15px' : '6px 13px',
                    background: isCurrentPageBookmarked
                      ? 'linear-gradient(135deg, #8B3A42 0%, #6F2E35 100%)'
                      : T.isDark ? 'rgba(21,18,14,0.85)' : 'rgba(250,247,241,0.94)',
                    color: isCurrentPageBookmarked ? '#FAF7F1' : T.text,
                    border: `1px solid ${isCurrentPageBookmarked ? 'rgba(184,134,63,0.55)' : T.border}`,
                    borderRadius: '7px 7px 12px 12px',
                    boxShadow: isCurrentPageBookmarked
                      ? '0 6px 18px rgba(139,58,66,0.35)'
                      : '0 4px 14px rgba(0,0,0,0.18)',
                    cursor: 'pointer',
                    fontSize: 12,
                    fontFamily: 'Inter, sans-serif',
                    fontWeight: 500,
                    backdropFilter: 'blur(8px)',
                    transition: 'all 0.18s ease',
                    outline: 'none',
                  }}
                  title={isCurrentPageBookmarked ? `Bookmarked on page ${currentPage}. Click to remove.` : `Bookmark page ${currentPage}`}
                >
                  {isCurrentPageBookmarked ? (
                    <>
                      <BookmarkCheck size={14} style={{ color: '#E5C1C4' }} />
                      <span>Bookmarked (p. {currentPage})</span>
                    </>
                  ) : (
                    <>
                      <Bookmark size={13} style={{ color: T.brass }} />
                      <span style={{ color: T.textMuted }}>Bookmark here</span>
                    </>
                  )}
                </button>
              </div>

              <PageDisplay pageState={pageState} pageNum={currentPage} zoom={zoom} />
            </div>
          </div>
        ))}
          </>
        )}
      </div>
    </Shell>
  );
}

// ── DRIVE IFRAME MODE ─────────────────────────────────────────────────────────
function DriveReaderMode({ pdfUrl, bookTitle, onClose }: PdfReaderModalProps) {
  const { T, themeMode, toggleTheme } = useReaderThemeContext();
  const fileId   = extractDriveFileId(pdfUrl);
  const embedUrl = fileId ? getDriveEmbedUrl(fileId) : null;

  useEffect(() => {
    const h = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', h);
    return () => window.removeEventListener('keydown', h);
  }, [onClose]);

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 100,
      display: 'flex', flexDirection: 'column',
      background: T.bg,
    }}>
      {/* Header — explicit z-index so iframe can never cover it */}
      <div style={{
        height: 52, flexShrink: 0, position: 'relative', zIndex: 10,
        background: T.bgDark,
        borderBottom: `1px solid ${T.border}`,
        display: 'flex', alignItems: 'center', gap: 4, padding: '0 8px',
        userSelect: 'none',
      }}>
        {/* Close */}
        <ToolBtn onClick={onClose} title="Close (Esc)"><X size={16} /></ToolBtn>

        <div style={{ width: 1, height: 24, background: T.border, margin: '0 4px' }} />

        {/* Title */}
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{
            fontFamily: '"Fraunces", Georgia, serif',
            fontSize: 14, fontWeight: 600, color: T.text,
            overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
          }}>
            {bookTitle}
          </div>
          <div style={{ fontSize: 10, color: T.brass, fontFamily: 'Inter', letterSpacing: '0.04em' }}>
            Google Drive viewer
          </div>
        </div>

        {/* Theme toggle */}
        <ToolBtn
          onClick={toggleTheme}
          title={themeMode === 'dark' ? 'Switch to Parchment Light mode' : 'Switch to Night Dark mode'}
        >
          {themeMode === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
        </ToolBtn>

        <div style={{ width: 1, height: 24, background: T.border, margin: '0 4px' }} />

        {/* Open externally */}
        <a
          href={pdfUrl}
          target="_blank"
          rel="noopener noreferrer"
          style={{ textDecoration: 'none', display: 'flex' }}
          title="Open in Google Drive"
        >
          <ToolBtn as="span"><ExternalLink size={15} /></ToolBtn>
        </a>
      </div>

      {/* Iframe area */}
      <div style={{ flex: 1, position: 'relative', zIndex: 1, overflow: 'hidden' }}>
        {embedUrl ? (
          <iframe
            src={embedUrl}
            style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', border: 'none' }}
            allow="autoplay"
            title={bookTitle}
          />
        ) : (
          <ErrorScreen error="Could not parse Google Drive file ID from this URL." />
        )}
      </div>

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}

// ── Library & Book Theme Doodles in Background ──────────────────────────────
function TallBookStackDoodle({ size = 56 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <rect x="7" y="47" width="50" height="11" rx="2" />
      <path d="M14 47v11M49 52.5H22" />
      <rect x="10" y="36" width="44" height="11" rx="2" />
      <path d="M16 36v11M46 41.5H24" />
      <rect x="8" y="25" width="45" height="11" rx="2" />
      <path d="M15 25v11M44 30.5H23" />
      <rect x="13" y="15" width="38" height="10" rx="2" />
      <path d="M19 15v10M43 20H26" />
      <path d="M34 25v18l-3-2-3 2V25" />
    </svg>
  );
}

function LeaningBooksDoodle({ size = 54 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M6 56h52" strokeWidth="2.2" />
      <rect x="12" y="20" width="10" height="36" rx="1.5" />
      <path d="M12 26h10M12 48h10M17 32v10" />
      <rect x="23" y="16" width="11" height="40" rx="1.5" />
      <path d="M23 22h11M23 50h11M28.5 28v14" />
      <path d="M36 22l15 32M45 18l14 34M45 18l-9 4M59 52l-8 4" />
      <path d="M40 28l9 4M47 44l8 4" />
    </svg>
  );
}

function OpenSpreadBookDoodle({ size = 54 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M5 45c10-6 19-3 27 2 8-5 17-8 27-2V18c-10-6-19-3-27 2-8-5-17-8-27-2v27z" />
      <path d="M32 20v27" strokeWidth="2" />
      <path d="M11 25c6-3 12-2 16 1M11 32c6-3 12-2 16 1M11 39c6-3 12-2 16 1" />
      <path d="M37 26c5-3 11-4 16-1M37 33c5-3 11-4 16-1M37 40c5-3 11-4 16-1" />
      <path d="M32 20c3 8 7 14 10 24l-3-1-3 3" />
    </svg>
  );
}

function FountainPenDoodle({ size = 48 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M48 8l8 8-28 28-8-8 28-28z" />
      <path d="M20 36l-8 8 2 2 12-4" />
      <path d="M12 44l-6 10 10-6-4-4z" />
      <path d="M9 51l7-7" strokeWidth="1.2" />
      <circle cx="13" cy="47" r="0.8" fill="currentColor" />
      <path d="M44 12l-14 14" strokeWidth="2" />
      <circle cx="5" cy="59" r="1.5" fill="currentColor" />
    </svg>
  );
}

function QuillInInkwellDoodle({ size = 52 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M52 6C43 10 32 22 25 36l5 1c3-7 9-16 19-23 7-5 8-8 8-8s-2 0-5 0z" />
      <path d="M46 12c-4 5-10 11-15 16M48 18c-3 4-7 9-11 13" />
      <path d="M25 36l-6 10" strokeWidth="1.4" />
      <rect x="8" y="44" width="22" height="14" rx="3" />
      <path d="M13 44v-4h12v4M11 40h16M13 50h12" />
      <circle cx="27" cy="40" r="1.5" fill="currentColor" />
    </svg>
  );
}

function HardcoverBookDoodle({ size = 48 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M14 10h34a4 4 0 0 1 4 4v38a4 4 0 0 1-4 4H14a4 4 0 0 1-4-4V14a4 4 0 0 1 4-4z" />
      <path d="M18 10v46" />
      <path d="M10 18h8M10 26h8M10 40h8M10 48h8" />
      <rect x="24" y="18" width="20" height="28" rx="2" strokeDasharray="3 2" />
      <path d="M30 32h8M34 28v8" />
    </svg>
  );
}

function GlassesOnBookDoodle({ size = 52 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M8 24h46a2 2 0 0 1 2 2v26H10a2 2 0 0 1-2-2V24z" />
      <path d="M12 24v28M8 50h48" />
      <circle cx="22" cy="34" r="8" fill="currentColor" fillOpacity="0.12" />
      <circle cx="40" cy="34" r="8" fill="currentColor" fillOpacity="0.12" />
      <path d="M30 33c2-2 3-2 5 0M14 34l-5-8M48 34l5-8" strokeWidth="1.6" />
      <path d="M19 31c2-2 4-2 6 0M37 31c2-2 4-2 6 0" strokeWidth="1.2" />
    </svg>
  );
}

function LibraryShelfRowDoodle({ size = 56 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M6 54h52" strokeWidth="2.4" />
      <rect x="9" y="24" width="8" height="30" rx="1" />
      <path d="M9 30h8M9 46h8" />
      <rect x="18" y="14" width="9" height="40" rx="1" />
      <path d="M18 22h9M18 46h9M22.5 30v8" />
      <rect x="28" y="20" width="8" height="34" rx="1" />
      <path d="M28 26h8M28 44h8" />
      <rect x="37" y="16" width="11" height="38" rx="1" />
      <path d="M37 24h11M37 46h11M42.5 32v6" />
      <path d="M49 22l6 32h-7l-6-32z" />
    </svg>
  );
}

function DoubleQuillDoodle({ size = 46 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M50 10C40 16 26 30 14 50" />
      <path d="M50 10c-3 8-12 18-24 22M46 16c-3 6-9 12-18 16" />
      <path d="M14 10C24 16 38 30 50 50" />
      <path d="M14 10c3 8 12 18 24 22M18 16c3 6 9 12 18 16" />
      <circle cx="13" cy="52" r="1.2" fill="currentColor" />
      <circle cx="51" cy="52" r="1.2" fill="currentColor" />
    </svg>
  );
}

function NotebookWithPencilDoodle({ size = 50 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <rect x="10" y="14" width="34" height="42" rx="2" />
      <path d="M10 20h34M10 28h34M10 36h34M10 44h34" strokeDasharray="3 2" />
      <path d="M8 18h4M8 26h4M8 34h4M8 42h4M8 50h4" strokeWidth="2.2" />
      <path d="M48 10l6 6-18 36-6-2 18-40z" />
      <path d="M30 50l-4 8 8-4-4-4z" />
      <path d="M27 57l3-3" strokeWidth="1.2" fill="currentColor" />
    </svg>
  );
}

function TrioStackBooksDoodle({ size = 50 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M8 44h48v11H8z" />
      <path d="M14 44v11M48 49.5H24" />
      <path d="M11 32h44v11H11z" />
      <path d="M17 32v11M46 37.5H25" />
      <path d="M9 20h45v11H9z" />
      <path d="M15 20v11M45 25.5H23" />
      <path d="M34 20v24l-3-2-3 2V20" />
    </svg>
  );
}

function CalligraphyNibDoodle({ size = 30 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 36 36" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M18 4l7 14c-1 3-2 8-3 12h-8c-1-4-2-9-3-12l7-14z" />
      <path d="M18 4v16" strokeWidth="1.4" />
      <circle cx="18" cy="17" r="1.5" fill="currentColor" />
      <path d="M14 24h8" />
    </svg>
  );
}

function BookmarkRibbonDoodle({ size = 28 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M8 4h16v24l-8-5-8 5V4z" />
      <path d="M12 10h8M12 15h8M16 4v4" />
    </svg>
  );
}

function SingleMiniBookDoodle({ size = 26 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <rect x="6" y="5" width="20" height="22" rx="2" />
      <path d="M10 5v22M15 12h6M15 16h4" />
    </svg>
  );
}

function BookCornerBracketDoodle({ size = 24 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M6 26V6h20" />
      <path d="M6 18c6-1 12 5 12 12M6 12c10-2 18 6 18 18" strokeWidth="1.4" />
      <circle cx="10" cy="10" r="1.5" fill="currentColor" />
    </svg>
  );
}

function InkDropFlourishDoodle({ size = 24 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round">
      <path d="M16 6c3 4 5 7 5 10a5 5 0 1 1-10 0c0-3 2-6 5-10z" fill="currentColor" fillOpacity="0.2" />
      <path d="M6 26c4-2 9-1 12 2s7 1 10-1" />
    </svg>
  );
}

function ParchmentScrollDoodle({ size = 44 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M15 18c0-3 3-5 6-5h24c3 0 6 2 6 5s-3 5-6 5H21c-3 0-6-2-6-5z" />
      <path d="M15 18v27c0 3 3 5 6 5h23M45 23v22c0 3 3 5 6 5s6-2 6-5V20" />
      <path d="M22 27h16M22 33h14M22 39h10" />
    </svg>
  );
}

function ReaderDoodles() {
  const { T } = useReaderThemeContext();

  // Deep warm beige palette (no red or gold)
  const beigeColor = T.isDark ? '#C5A880' : '#8A6846';

  const beigeStyle: React.CSSProperties = {
    color: beigeColor,
    opacity: T.isDark ? 0.22 : 0.18,
    transition: 'color 0.25s ease, opacity 0.25s ease',
  };

  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        pointerEvents: 'none',
        userSelect: 'none',
        overflow: 'hidden',
        zIndex: 0,
      }}
    >
      {/* ─── Left Flank (Spaced, uncluttered library motifs) ─── */}
      <div style={{ position: 'absolute', top: '9%', left: '3%', transform: 'rotate(-8deg)', ...beigeStyle }}>
        <TallBookStackDoodle size={56} />
      </div>

      <div style={{ position: 'absolute', top: '34%', left: '3.5%', transform: 'rotate(8deg)', ...beigeStyle }}>
        <QuillInInkwellDoodle size={48} />
      </div>

      <div style={{ position: 'absolute', top: '59%', left: '3%', transform: 'rotate(-6deg)', ...beigeStyle }}>
        <GlassesOnBookDoodle size={48} />
      </div>

      <div style={{ position: 'absolute', bottom: '9%', left: '3%', transform: 'rotate(5deg)', ...beigeStyle }}>
        <LeaningBooksDoodle size={52} />
      </div>

      {/* ─── Right Flank (Spaced, uncluttered library motifs) ─── */}
      <div style={{ position: 'absolute', top: '9%', right: '3%', transform: 'rotate(8deg)', ...beigeStyle }}>
        <OpenSpreadBookDoodle size={52} />
      </div>

      <div style={{ position: 'absolute', top: '34%', right: '3.5%', transform: 'rotate(40deg)', ...beigeStyle }}>
        <FountainPenDoodle size={46} />
      </div>

      <div style={{ position: 'absolute', top: '59%', right: '3%', transform: 'rotate(-8deg)', ...beigeStyle }}>
        <NotebookWithPencilDoodle size={48} />
      </div>

      <div style={{ position: 'absolute', bottom: '9%', right: '3%', transform: 'rotate(-5deg)', ...beigeStyle }}>
        <LibraryShelfRowDoodle size={52} />
      </div>
    </div>
  );
}

// ── Utility screens ───────────────────────────────────────────────────────────
function Shell({ children }: { children: React.ReactNode }) {
  const { T, themeMode } = useReaderThemeContext();
  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 100,
      display: 'flex', flexDirection: 'column',
      background: T.bg, fontFamily: 'Inter, sans-serif',
      transition: 'background 0.25s ease',
    }}>
      {/* Parchment texture overlay in light mode */}
      {!T.isDark && (
        <div style={{
          position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 0,
          backgroundImage: `radial-gradient(circle at 50% 45%, rgba(255,255,255,0.45) 0%, rgba(235,225,208,0.4) 100%), url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' opacity='0.038'/%3E%3C/svg%3E")`,
          opacity: 0.95,
        }} />
      )}

      {/* Literary Book Doodles in background (dark & light modes) */}
      <ReaderDoodles />

      <div style={{ position: 'relative', zIndex: 1, display: 'flex', flexDirection: 'column', height: '100%', width: '100%', overflow: 'hidden' }}>
        {children}
      </div>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}

function LoadingScreen({ message, bookTitle }: { message: string; bookTitle?: string }) {
  const T = useReaderTheme();
  return (
    <div style={{
      flex: 1,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 20,
      color: T.textMuted,
      position: 'relative',
    }}>
      {/* Soft warm desk glow */}
      <div style={{
        position: 'absolute',
        inset: 0,
        pointerEvents: 'none',
        background: T.deskVignette,
      }} />

      <div style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 16,
        position: 'relative',
        zIndex: 1,
      }}>
        <div style={{
          filter: T.isDark
            ? 'drop-shadow(0 12px 28px rgba(184,134,63,0.22))'
            : 'drop-shadow(0 8px 20px rgba(122,83,48,0.18))',
          transform: 'scale(1.2)',
          marginBottom: 8,
        }}>
          <BookLoader size="lg" color={T.isDark ? 'brass' : 'brown'} />
        </div>

        <div style={{ textAlign: 'center', padding: '0 20px' }}>
          {bookTitle && (
            <h3 style={{
              fontFamily: '"Fraunces", Georgia, serif',
              fontSize: 19,
              fontWeight: 600,
              color: T.text,
              margin: '0 0 6px 0',
              letterSpacing: '0.01em',
            }}>
              {bookTitle}
            </h3>
          )}
          <p style={{
            fontSize: 13,
            fontFamily: 'Inter, sans-serif',
            color: T.brass,
            letterSpacing: '0.04em',
            margin: 0,
          }}>
            {message}
          </p>
        </div>
      </div>
    </div>
  );
}

function ErrorScreen({ error, url }: { error: string; url?: string }) {
  const T = useReaderTheme();
  return (
    <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
      <div style={{
        maxWidth: 520, textAlign: 'center', padding: 36,
        borderRadius: 16, background: 'rgba(139,58,66,0.08)',
        border: '1px solid rgba(139,58,66,0.25)',
      }}>
        <AlertCircle size={38} style={{ color: T.burgundy, margin: '0 auto 14px' }} />
        <p style={{ fontSize: 16, fontWeight: 600, color: T.text, lineHeight: 1.4, margin: '0 0 8px' }}>
          Could not load this PDF
        </p>
        <p style={{ fontSize: 13, color: T.textFaint, margin: '0 0 16px', lineHeight: 1.5 }}>
          {error}
        </p>
        {url && (
          <div style={{
            fontSize: 11, fontFamily: 'monospace', color: T.brass,
            background: 'rgba(0,0,0,0.3)', padding: '10px 14px', borderRadius: 8,
            wordBreak: 'break-all', marginBottom: 14, border: `1px solid ${T.border}`,
          }}>
            {url}
          </div>
        )}
        <p style={{ fontSize: 12, color: T.textMuted, margin: 0, lineHeight: 1.5 }}>
          Please make sure the link is a direct, public raw URL ending in <code style={{ color: T.brass }}>.pdf</code>.
        </p>
      </div>
    </div>
  );
}

// ── Root export ───────────────────────────────────────────────────────────────
export function PdfReaderModal(props: PdfReaderModalProps) {
  return (
    <ReaderThemeProvider>
      {isGoogleDriveUrl(props.pdfUrl)
        ? <DriveReaderMode {...props} />
        : <PdfJsReaderMode {...props} />}
    </ReaderThemeProvider>
  );
}
