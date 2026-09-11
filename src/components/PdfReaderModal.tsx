import { useEffect, useRef, useState, useCallback, forwardRef, createContext, useContext } from 'react';
import * as pdfjsLib from 'pdfjs-dist';
import HTMLFlipBook from 'react-pageflip';
import {
  X, ChevronLeft, ChevronRight, ZoomIn, ZoomOut,
  BookOpen, Loader2, AlertCircle, ExternalLink,
  PanelLeftClose, PanelLeftOpen, LayoutList,
  Bookmark, BookmarkCheck, Sun, Moon, Palette, Check,
  Maximize2, Minimize2,
} from 'lucide-react';
import BookLoader from './ui/BookLoader';
import pdfWorkerUrl from 'pdfjs-dist/build/pdf.worker.min.mjs?url';

pdfjsLib.GlobalWorkerOptions.workerSrc = pdfWorkerUrl;

// ── Paper Tone / Texture Themes ───────────────────────────────────────────────
export type PaperThemeKey = 'white' | 'yellow' | 'crumbled' | 'night';

export interface PaperThemeConfig {
  key: PaperThemeKey;
  label: string;
  desc: string;
  pageBg: string;
  imgFilter: string;
  blendMode: 'multiply' | 'normal';
  swatch: string;
  textColor: string;
  textureType: 'none' | 'grain' | 'crumbled';
}

export const PAPER_THEMES: Record<PaperThemeKey, PaperThemeConfig> = {
  white: {
    key: 'white',
    label: 'White',
    desc: 'Clean & crisp original digital page',
    pageBg: '#FFFFFF',
    imgFilter: 'none',
    blendMode: 'normal',
    swatch: '#FFFFFF',
    textColor: '#555555',
    textureType: 'none',
  },
  yellow: {
    key: 'yellow',
    label: 'Old Book Yellow',
    desc: 'Vintage paperback aged pages',
    pageBg: '#EFE1B8',
    imgFilter: 'sepia(0.38) contrast(1.05) brightness(0.96)',
    blendMode: 'multiply',
    swatch: '#E8D39A',
    textColor: '#4E3A1D',
    textureType: 'grain',
  },
  crumbled: {
    key: 'crumbled',
    label: 'Crumbled & Worn',
    desc: 'Antique creased & weathered paper',
    pageBg: '#E4CE9C',
    imgFilter: 'sepia(0.46) contrast(1.09) brightness(0.95)',
    blendMode: 'multiply',
    swatch: '#D6BA80',
    textColor: '#3F2F16',
    textureType: 'crumbled',
  },
  night: {
    key: 'night',
    label: 'Night Slate',
    desc: 'Inverted dark mode page',
    pageBg: '#161310',
    imgFilter: 'invert(0.92) hue-rotate(180deg) brightness(0.94) contrast(0.92)',
    blendMode: 'normal',
    swatch: '#24201B',
    textColor: '#B8A68D',
    textureType: 'none',
  },
};

// Subtle tactile paper grain pattern overlay
const PAPER_GRAIN_DATA_URI =
  "data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' opacity='0.08'/%3E%3C/svg%3E";

// Crumbled / crinkled paper texture with physical 3D lighting highlights and shadow creases
const CRUMBLED_TEXTURE_DATA_URI =
  "data:image/svg+xml,%3Csvg viewBox='0 0 500 500' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='crinkle'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.024' numOctaves='5' result='noise'/%3E%3CfeDiffuseLighting in='noise' lighting-color='%23ffffff' surfaceScale='3.4' result='light'%3E%3CfeDistantLight azimuth='50' elevation='46'/%3E%3C/feDiffuseLighting%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23crinkle)' fill='%23fff'/%3E%3C/svg%3E";

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
  deskVignette: string;
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
    deskVignette: 'radial-gradient(ellipse at 50% 50%, rgba(184,134,63,0.06) 0%, transparent 75%)',
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
    deskVignette: 'radial-gradient(ellipse at 50% 50%, rgba(184,134,63,0.08) 0%, transparent 75%)',
    isDark:      false,
  },
};

const ReaderThemeContext = createContext<{
  T: ReaderTheme;
  themeMode: ReaderThemeMode;
  toggleTheme: () => void;
  paperTheme: PaperThemeKey;
  setPaperTheme: (key: PaperThemeKey) => void;
  paperConfig: PaperThemeConfig;
}>({
  T: THEMES.dark,
  themeMode: 'dark',
  toggleTheme: () => {},
  paperTheme: 'yellow',
  setPaperTheme: () => {},
  paperConfig: PAPER_THEMES.yellow,
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

  const [paperTheme, setPaperThemeState] = useState<PaperThemeKey>(() => {
    try {
      const saved = localStorage.getItem('cursus:reader-paper-theme') as any;
      if (saved && PAPER_THEMES[saved as PaperThemeKey]) return saved as PaperThemeKey;
      if (saved === 'parchment' || saved === 'cream') return 'yellow';
    } catch {}
    return 'yellow';
  });

  const toggleTheme = useCallback(() => {
    setThemeMode(prev => {
      const next = prev === 'dark' ? 'light' : 'dark';
      try { localStorage.setItem('cursus:reader-theme', next); } catch {}
      return next;
    });
  }, []);

  const setPaperTheme = useCallback((theme: PaperThemeKey) => {
    setPaperThemeState(theme);
    try { localStorage.setItem('cursus:reader-paper-theme', theme); } catch {}
  }, []);

  const T = THEMES[themeMode];
  const paperConfig = PAPER_THEMES[paperTheme];

  return (
    <ReaderThemeContext.Provider value={{ T, themeMode, toggleTheme, paperTheme, setPaperTheme, paperConfig }}>
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

  // 1. Check in-memory cache and ensure buffer is not detached
  const allCacheKeys = [rawUrl, directUrl, ...candidates];
  for (const c of allCacheKeys) {
    const cached = pdfDataCache.get(c);
    if (cached) {
      if (cached.byteLength > 0 && !(cached.buffer as any).detached) {
        return cached.slice();
      }
      pdfDataCache.delete(c);
    }
  }

  const setCache = (bytes: Uint8Array) => {
    for (const k of allCacheKeys) {
      pdfDataCache.set(k, bytes);
    }
  };

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
        setCache(bytes);
        return bytes.slice();
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
          setCache(bytes);
          return bytes.slice();
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
  // CRITICAL: PDF.js transfers the underlying ArrayBuffer to its Web Worker via postMessage(..., [buffer]).
  // Transferring detaches the buffer (byteLength becomes 0).
  // Slicing provides an independent ArrayBuffer copy for the worker, leaving the cached
  // bytes intact so subsequent renders, re-mounts, and reloads succeed seamlessly.
  return await pdfjsLib.getDocument({ data: data.slice() }).promise;
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
  canvas.width   = Math.floor(viewport.width);
  canvas.height  = Math.floor(viewport.height);
  const ctx      = canvas.getContext('2d', { alpha: false });
  if (ctx) {
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = 'high';
    await page.render({ canvasContext: ctx, viewport, canvas }).promise;
  } else {
    await page.render({ canvasContext: canvas.getContext('2d')!, viewport, canvas }).promise;
  }
  const dataUrl = canvas.toDataURL('image/jpeg', 0.96);
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
  isTwoPageSupported = true,
  windowWidth = 1200,
  isFullscreen = false,
  onToggleFullscreen,
  zenMode = false,
}: {
  bookTitle: string; currentPage: number; numPages: number; zoom: number;
  sidebarOpen: boolean; isDriveMode?: boolean; externalUrl?: string;
  viewMode?: 'document' | 'book'; onToggleViewMode?: () => void;
  onClose: () => void; onPrev: () => void; onNext: () => void;
  onZoomIn: () => void; onZoomOut: () => void;
  onToggleSidebar: () => void; onPageInput: (n: number) => void;
  bookmarkedPage?: number | null; onJumpToBookmark?: () => void;
  isTwoPageSupported?: boolean;
  windowWidth?: number;
  isFullscreen?: boolean;
  onToggleFullscreen?: () => void;
  zenMode?: boolean;
}) {
  const { T, themeMode, toggleTheme } = useReaderThemeContext();
  const [inputVal, setInputVal] = useState(String(currentPage));

  const isMobile = windowWidth < 768;
  const isNarrow = windowWidth < 440;

  useEffect(() => setInputVal(String(currentPage)), [currentPage]);

  return (
    <div style={{
      height: zenMode ? 0 : 52,
      maxHeight: zenMode ? 0 : 52,
      position: 'relative',
      top: 0,
      left: 0,
      right: 0,
      zIndex: 70,
      background: T.bgDark,
      borderBottom: `1px solid ${zenMode ? 'transparent' : T.border}`,
      opacity: zenMode ? 0 : 1,
      transform: zenMode ? 'translateY(-100%)' : 'translateY(0)',
      marginBottom: zenMode ? -52 : 0,
      transition: 'transform 0.42s cubic-bezier(0.32, 0.72, 0, 1), opacity 0.42s cubic-bezier(0.32, 0.72, 0, 1), margin-bottom 0.42s cubic-bezier(0.32, 0.72, 0, 1), border-color 0.42s cubic-bezier(0.32, 0.72, 0, 1)',
      display: 'flex',
      alignItems: 'center',
      gap: 0,
      flexShrink: 0,
      userSelect: 'none',
      paddingRight: isMobile ? 4 : 8,
      overflow: zenMode ? 'hidden' : 'visible',
      pointerEvents: zenMode ? 'none' : 'auto',
    }}>

      {/* Close */}
      <ToolBtn onClick={onClose} title="Close (Esc)">
        <X size={16} />
      </ToolBtn>

      {/* Sidebar toggle — hide completely on mobile */}
      {!isMobile && (
        <ToolBtn onClick={onToggleSidebar} title="Toggle thumbnails" active={sidebarOpen}>
          {sidebarOpen ? <PanelLeftClose size={16} /> : <PanelLeftOpen size={16} />}
        </ToolBtn>
      )}

      <div style={{ width: 1, height: 24, background: T.border, margin: '0 2px' }} />

      {/* Book title */}
      <div style={{
        flex: isMobile ? '0 1 auto' : 1,
        padding: isMobile ? '0 6px' : '0 12px',
        minWidth: 0,
        maxWidth: isNarrow ? 90 : isMobile ? 130 : 'none',
      }}>
        <div style={{
          fontFamily: '"Fraunces", Georgia, serif',
          fontSize: isMobile ? 12 : 14,
          fontWeight: 600,
          color: T.text,
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          whiteSpace: 'nowrap',
          letterSpacing: '0.01em',
        }}>
          {bookTitle}
        </div>
        {isDriveMode && !isMobile && (
          <div style={{ fontSize: 10, color: T.brass, fontFamily: 'Inter', letterSpacing: '0.04em' }}>
            Google Drive viewer
          </div>
        )}
      </div>

      {/* Page nav — only when we know total */}
      {numPages > 0 && (
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: isMobile ? 2 : 6,
          padding: isMobile ? '0 2px' : '0 8px',
        }}>
          <ToolBtn onClick={onPrev} disabled={currentPage <= 1} title="Previous page (←)">
            <ChevronLeft size={isMobile ? 14 : 16} />
          </ToolBtn>

          <div style={{ display: 'flex', alignItems: 'center', gap: isMobile ? 3 : 5 }}>
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
                width: isMobile ? 28 : 38,
                height: 24,
                textAlign: 'center',
                background: T.bg,
                border: `1px solid ${T.border}`,
                borderRadius: 5,
                color: T.text,
                fontSize: isMobile ? 11 : 12,
                fontFamily: 'Inter',
                outline: 'none',
                padding: 0,
              }}
              onFocus={e => e.target.select()}
            />
            <span style={{ fontSize: isMobile ? 10 : 11, color: T.textMuted, fontFamily: 'Inter', whiteSpace: 'nowrap' }}>
              /{numPages}
            </span>
          </div>

          <ToolBtn onClick={onNext} disabled={currentPage >= numPages} title="Next page (→)">
            <ChevronRight size={isMobile ? 14 : 16} />
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
            gap: 4,
            padding: isMobile ? '3px 7px' : '4px 11px',
            margin: '0 2px',
            borderRadius: 14,
            background: T.isDark ? 'rgba(184,134,63,0.18)' : 'rgba(184,134,63,0.14)',
            border: `1px solid ${T.isDark ? 'rgba(184,134,63,0.45)' : 'rgba(184,134,63,0.38)'}`,
            color: T.brassLight,
            fontSize: isMobile ? 10 : 12,
            fontFamily: 'Inter, sans-serif',
            fontWeight: 500,
            cursor: 'pointer',
            transition: 'all 0.18s ease',
            whiteSpace: 'nowrap',
            flexShrink: 0,
            outline: 'none',
          }}
        >
          <Bookmark size={11} style={{ fill: T.brass, color: T.brass }} />
          <span>{isMobile ? `p.${bookmarkedPage}` : `Jump to p. ${bookmarkedPage}`}</span>
        </button>
      )}

      {/* Zoom — only in document mode on wider screens */}
      {(!viewMode || viewMode === 'document') && !isMobile ? (
        <>
          <ToolBtn onClick={onZoomOut} disabled={zoom <= 0.5} title="Zoom out (-)"><ZoomOut size={16} /></ToolBtn>
          <div style={{ fontSize: 11, color: T.brass, fontFamily: 'Inter', minWidth: 36, textAlign: 'center', fontVariantNumeric: 'tabular-nums' }}>
            {Math.round(zoom * 100)}%
          </div>
          <ToolBtn onClick={onZoomIn} disabled={zoom >= 3} title="Zoom in (+)"><ZoomIn size={16} /></ToolBtn>
          <div style={{ width: 1, height: 24, background: T.border, margin: '0 4px' }} />
        </>
      ) : null}

      {/* View mode toggle — ONLY shown if screen resolution supports 2-page mode */}
      {isTwoPageSupported && onToggleViewMode && (
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

      {isTwoPageSupported && onToggleViewMode && <div style={{ width: 1, height: 24, background: T.border, margin: '0 4px' }} />}

      {/* Paper texture & tone selector — compact on mobile */}
      <PaperThemeSelector compact={isMobile} />

      {/* Theme toggle: Dark / Light mode */}
      <ToolBtn
        onClick={toggleTheme}
        title={themeMode === 'dark' ? 'Switch to Parchment Light desk' : 'Switch to Night Dark desk'}
      >
        {themeMode === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
      </ToolBtn>

      {/* Fullscreen toggle (HTML5 Native Fullscreen) */}
      {onToggleFullscreen && (
        <ToolBtn
          onClick={onToggleFullscreen}
          active={isFullscreen}
          title={isFullscreen ? 'Exit Full Screen (F / Esc)' : 'Full Screen — Edge-to-Edge (F)'}
        >
          {isFullscreen ? <Minimize2 size={16} /> : <Maximize2 size={16} />}
        </ToolBtn>
      )}

      {/* External link — hidden on narrow mobile */}
      {externalUrl && !isNarrow && (
        <a href={externalUrl} target="_blank" rel="noopener noreferrer" title="Open in Google Drive" style={{ textDecoration: 'none' }}>
          <ToolBtn as="span"><ExternalLink size={15} /></ToolBtn>
        </a>
      )}
    </div>
  );
}

// ── Paper Theme Selector Popover ──────────────────────────────────────────────
function PaperThemeSelector({ compact = false }: { compact?: boolean }) {
  const { T, paperTheme, setPaperTheme, paperConfig } = useReaderThemeContext();
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    function handleClickOutside(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [open]);

  return (
    <div ref={containerRef} style={{ position: 'relative', zIndex: 50 }}>
      <button
        onClick={() => setOpen(prev => !prev)}
        title="Change page paper texture & tone"
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: compact ? 4 : 6,
          padding: compact ? '4px 6px' : '4px 9px',
          margin: '0 2px',
          height: 32,
          borderRadius: 8,
          background: open ? (T.isDark ? 'rgba(184,134,63,0.2)' : 'rgba(184,134,63,0.18)') : 'transparent',
          border: `1px solid ${open ? T.brassLight : 'transparent'}`,
          color: T.text,
          fontSize: 12,
          fontFamily: 'Inter, sans-serif',
          fontWeight: 500,
          cursor: 'pointer',
          transition: 'all 0.15s ease',
          outline: 'none',
        }}
        onMouseEnter={e => {
          if (!open) e.currentTarget.style.background = T.isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.05)';
        }}
        onMouseLeave={e => {
          if (!open) e.currentTarget.style.background = 'transparent';
        }}
      >
        <span
          style={{
            width: 13,
            height: 13,
            borderRadius: '50%',
            background: paperConfig.pageBg,
            border: `1px solid ${paperConfig.key === 'white' ? 'rgba(0,0,0,0.2)' : T.border}`,
            boxShadow: '0 1px 2px rgba(0,0,0,0.2)',
            display: 'inline-block',
            flexShrink: 0,
          }}
        />
        <Palette size={14} style={{ color: T.brassLight }} />
        {!compact && (
          <span style={{ fontSize: 11, color: T.textMuted, whiteSpace: 'nowrap' }}>{paperConfig.label}</span>
        )}
      </button>

      {open && (
        <div
          style={{
            position: 'absolute',
            top: 'calc(100% + 6px)',
            right: 0,
            width: 204,
            background: T.bgDark,
            border: `1px solid ${T.borderHover}`,
            borderRadius: 10,
            padding: 5,
            boxShadow: '0 14px 32px rgba(0,0,0,0.55)',
            zIndex: 1000,
            backdropFilter: 'blur(16px)',
            display: 'flex',
            flexDirection: 'column',
            gap: 2,
          }}
        >
          <div style={{
            fontSize: 10,
            fontFamily: 'Inter, sans-serif',
            color: T.textFaint,
            textTransform: 'uppercase',
            letterSpacing: '0.08em',
            padding: '5px 8px 3px',
            fontWeight: 600,
          }}>
            Page Tone & Texture
          </div>

          {(Object.values(PAPER_THEMES) as PaperThemeConfig[]).map(theme => {
            const isSelected = theme.key === paperTheme;
            return (
              <button
                key={theme.key}
                onClick={() => {
                  setPaperTheme(theme.key);
                  setOpen(false);
                }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 10,
                  width: '100%',
                  padding: '7px 9px',
                  borderRadius: 6,
                  background: isSelected ? (T.isDark ? 'rgba(184,134,63,0.18)' : 'rgba(184,134,63,0.14)') : 'transparent',
                  border: isSelected ? `1px solid ${T.borderHover}` : '1px solid transparent',
                  color: isSelected ? T.brassLight : T.text,
                  fontSize: 12,
                  fontFamily: 'Inter, sans-serif',
                  fontWeight: isSelected ? 600 : 400,
                  cursor: 'pointer',
                  textAlign: 'left',
                  transition: 'all 0.15s ease',
                  outline: 'none',
                }}
                onMouseEnter={e => {
                  if (!isSelected) e.currentTarget.style.background = T.isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.05)';
                }}
                onMouseLeave={e => {
                  if (!isSelected) e.currentTarget.style.background = 'transparent';
                }}
              >
                <span
                  style={{
                    width: 17,
                    height: 17,
                    borderRadius: '50%',
                    background: theme.pageBg,
                    border: `1.5px solid ${theme.key === 'white' ? 'rgba(0,0,0,0.25)' : T.border}`,
                    boxShadow: '0 1px 3px rgba(0,0,0,0.2)',
                    flexShrink: 0,
                  }}
                />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ lineHeight: 1.2 }}>{theme.label}</div>
                  <div style={{ fontSize: 10, color: T.textFaint, fontWeight: 400, marginTop: 1 }}>{theme.desc}</div>
                </div>
                {isSelected && <Check size={14} style={{ color: T.brassLight, flexShrink: 0 }} />}
              </button>
            );
          })}
        </div>
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

// ── Paper Texture Overlay Component ───────────────────────────────────────────
function PaperTextureOverlay({ config }: { config: PaperThemeConfig }) {
  if (config.textureType === 'none') return null;

  if (config.textureType === 'crumbled') {
    return (
      <>
        {/* Crinkled / wrinkled lighting texture */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            backgroundImage: `url("${CRUMBLED_TEXTURE_DATA_URI}")`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            mixBlendMode: 'multiply',
            opacity: 0.48,
            pointerEvents: 'none',
            zIndex: 3,
          }}
        />
        {/* Weathered antique edge darkening / vignette */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: 'radial-gradient(ellipse at 50% 50%, transparent 40%, rgba(125, 80, 25, 0.16) 76%, rgba(85, 50, 15, 0.36) 100%)',
            pointerEvents: 'none',
            zIndex: 4,
          }}
        />
      </>
    );
  }

  // 'grain' - authentic vintage paperback texture
  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        backgroundImage: `url("${PAPER_GRAIN_DATA_URI}")`,
        backgroundRepeat: 'repeat',
        pointerEvents: 'none',
        zIndex: 3,
        opacity: 0.14,
      }}
    />
  );
}

// ── Main page display ─────────────────────────────────────────────────────────
function PageDisplay({
  pageState, pageNum, zoom, zenMode = false,
}: {
  pageState: PageState;
  pageNum: number;
  zoom: number;
  zenMode?: boolean;
}) {
  const { T, paperConfig } = useReaderThemeContext();
  return (
    <div style={{
      flex: 1,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: T.bg,
      overflow: 'auto',
      position: 'relative',
      width: '100%',
      height: '100%',
    }}
      className="scrollbar-thin"
    >
      {/* Warm radial glow */}
      <div style={{
        position: 'absolute',
        inset: 0,
        background: 'radial-gradient(ellipse 60% 50% at 50% 50%, rgba(184,134,63,0.05) 0%, transparent 70%)',
        pointerEvents: 'none',
        opacity: zenMode ? 0 : 1,
        transition: 'opacity 0.38s cubic-bezier(0.2, 0.9, 0.3, 1)',
      }} />

      {pageState.status === 'ready' && pageState.dataUrl ? (
        <div style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{
            transform: `scale(${zoom})`,
            transformOrigin: 'center center',
            transition: 'transform 0.42s cubic-bezier(0.32, 0.72, 0, 1), box-shadow 0.42s cubic-bezier(0.32, 0.72, 0, 1)',
            boxShadow: zenMode
              ? (T.isDark ? '0 24px 64px rgba(0,0,0,0.65)' : '0 24px 64px rgba(0,0,0,0.22)')
              : (T.isDark ? '0 16px 48px rgba(0,0,0,0.50)' : '0 16px 48px rgba(0,0,0,0.18)'),
            lineHeight: 0,
            borderRadius: 18,
            overflow: 'hidden',
            border: zenMode ? 'none' : '1px solid rgba(255,255,255,0.06)',
            background: paperConfig.pageBg,
            position: 'relative',
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            maxWidth: '100vw',
            maxHeight: zenMode ? '100vh' : 'calc(100vh - 52px)',
          }}>
            <PaperTextureOverlay config={paperConfig} />
            <img
              src={pageState.dataUrl}
              alt={`Page ${pageNum}`}
              style={{
                display: 'block',
                maxWidth: '100vw',
                maxHeight: zenMode ? '100vh' : 'calc(100vh - 52px)',
                width: 'auto',
                height: 'auto',
                objectFit: 'contain',
                mixBlendMode: paperConfig.blendMode,
                filter: paperConfig.imgFilter,
                transition: 'filter 0.25s ease, max-height 0.32s cubic-bezier(0.16, 1, 0.3, 1)',
              }}
              draggable={false}
            />
          </div>
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

      {/* Page number badge at bottom — hidden in zenMode for zero-bars view */}
      {!zenMode && pageState.status === 'ready' && (
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
const PdfPage = forwardRef<HTMLDivElement, { pageState: PageState; pageNum: number; zenMode?: boolean }>(
  ({ pageState, pageNum, zenMode = false }, ref) => {
    const { paperConfig } = useReaderThemeContext();
    const isEven = pageNum % 2 === 0;

    return (
      <div
        ref={ref}
        style={{
          background: paperConfig.pageBg,
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          position: 'relative',
          overflow: 'hidden',
          borderRadius: isEven ? '18px 0 0 18px' : '0 18px 18px 0',
          boxSizing: 'border-box',
          transition: 'background 0.25s ease',
        }}
      >
        <PaperTextureOverlay config={paperConfig} />

        {/* 3D Spine Gutter Shadow for realistic book spread depth */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            bottom: 0,
            ...(isEven
              ? { right: 0, width: 34, background: 'linear-gradient(to left, rgba(20,15,10,0.14) 0%, rgba(20,15,10,0.03) 16px, transparent 100%)' }
              : { left: 0, width: 34, background: 'linear-gradient(to right, rgba(20,15,10,0.14) 0%, rgba(20,15,10,0.03) 16px, transparent 100%)' }),
            pointerEvents: 'none',
            zIndex: 5,
            transition: 'opacity 0.2s ease',
            opacity: paperConfig.key === 'night' ? 0.35 : 1,
          }}
        />

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
              borderRadius: isEven ? '18px 0 0 18px' : '0 18px 18px 0',
              mixBlendMode: paperConfig.blendMode,
              filter: paperConfig.imgFilter,
              transition: 'filter 0.25s ease',
            }}
            draggable={false}
          />
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6, color: paperConfig.textColor }}>
            <span style={{ fontSize: 11, fontFamily: 'Inter', opacity: 0.7 }}>Page {pageNum}</span>
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
            color: paperConfig.textColor,
            fontFamily: 'Inter',
            letterSpacing: '0.05em',
            pointerEvents: 'none',
            opacity: zenMode ? 0 : 0.7,
            transition: 'opacity 0.25s ease',
            zIndex: 6,
          }}
        >
          {pageNum}
        </div>
      </div>
    );
  }
);
PdfPage.displayName = 'PdfPage';

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

function ReaderDoodles() {
  const { T } = useReaderThemeContext();
  const [isWide, setIsWide] = useState(() => typeof window !== 'undefined' && window.innerWidth >= 900);

  useEffect(() => {
    function handleResize() {
      setIsWide(window.innerWidth >= 900);
    }
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  if (!isWide) return null;

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
const Shell = forwardRef<HTMLDivElement, { children: React.ReactNode; style?: React.CSSProperties; zenMode?: boolean }>(
  ({ children, style, zenMode = false }, ref) => {
    const { T } = useReaderThemeContext();

    useEffect(() => {
      const prevHtmlBg = document.documentElement.style.backgroundColor;
      const prevBodyBg = document.body.style.backgroundColor;
      document.documentElement.style.backgroundColor = T.bg;
      document.body.style.backgroundColor = T.bg;
      return () => {
        document.documentElement.style.backgroundColor = prevHtmlBg;
        document.body.style.backgroundColor = prevBodyBg;
      };
    }, [T.bg]);

    return (
      <div
        ref={ref}
        style={{
          position: 'fixed', inset: 0, zIndex: 100,
          display: 'flex', flexDirection: 'column',
          background: T.bg,
          fontFamily: 'Inter, sans-serif',
          transition: 'background 0.25s ease',
          ...style,
        }}
      >
        {/* Parchment texture overlay in light mode — adapts seamlessly */}
        {!T.isDark && (
          <div style={{
            position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 0,
            backgroundImage: `radial-gradient(circle at 50% 45%, rgba(255,255,255,0.45) 0%, rgba(235,225,208,0.4) 100%), url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' opacity='0.038'/%3E%3C/svg%3E")`,
            opacity: 0.95,
          }} />
        )}

        {/* Literary Book Doodles in background — smoothly fades in zenMode */}
        <div style={{
          opacity: zenMode ? 0 : 1,
          transition: 'opacity 0.42s cubic-bezier(0.32, 0.72, 0, 1)',
          pointerEvents: 'none',
          willChange: 'opacity',
        }}>
          <ReaderDoodles />
        </div>

        <div style={{ position: 'relative', zIndex: 1, display: 'flex', flexDirection: 'column', height: '100%', width: '100%', overflow: 'hidden' }}>
          {children}
        </div>
        <style>{`
          @keyframes spin { to { transform: rotate(360deg); } }
          @keyframes fadeFloatIn {
            0% {
              opacity: 0;
              transform: translateY(8px) scale(0.85);
            }
            100% {
              opacity: 1;
              transform: translateY(0) scale(1);
            }
          }

          /* Prevent black-out flash during browser fullscreen transitions */
          html, body, :fullscreen, ::backdrop, :fullscreen::backdrop, *::backdrop, :-webkit-full-screen, :-webkit-full-screen::backdrop {
            background: ${T.bg} !important;
            background-color: ${T.bg} !important;
          }
        `}</style>
      </div>
    );
  }
);
Shell.displayName = 'Shell';

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

  // ── Fullscreen & Zen Mode States ──
  const [isFullscreen, setIsFullscreen]         = useState(false);
  const [zenMode, setZenMode]                   = useState(false);
  const [showZenControls, setShowZenControls]   = useState(false);
  const [toastMessage, setToastMessage]         = useState<string | null>(null);

  // Window size tracking for responsive layout & two-page support
  const [windowSize, setWindowSize] = useState<{ width: number; height: number }>(() => ({
    width: typeof window !== 'undefined' ? window.innerWidth : 1200,
    height: typeof window !== 'undefined' ? window.innerHeight : 800,
  }));

  useEffect(() => {
    function handleResize() {
      setWindowSize({ width: window.innerWidth, height: window.innerHeight });
    }
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const isMobile = windowSize.width < 768;
  const isTwoPageSupported = windowSize.width >= 900;
  const [sidebarOpen, setSidebarOpen] = useState(() => {
    if (typeof window !== 'undefined' && window.innerWidth < 768) return false;
    return true;
  });

  // View mode defaults to document if two-page is not supported (mobile / tablet portrait)
  const [viewMode, setViewMode] = useState<'document' | 'book'>(() => {
    if (typeof window !== 'undefined' && window.innerWidth < 900) return 'document';
    return 'book';
  });

  // Auto-switch to document mode if window is resized below 900px
  useEffect(() => {
    if (!isTwoPageSupported && viewMode === 'book') {
      setViewMode('document');
    }
  }, [isTwoPageSupported, viewMode]);

  // Bookmark storage key & state
  const bookmarkStorageKey = `cursus:bookmark:${bookId || bookTitle || pdfUrl}`;
  const [bookmarkedPage, setBookmarkedPage] = useState<number | null>(() => {
    try {
      const saved = localStorage.getItem(bookmarkStorageKey);
      if (saved === 'none' || saved === '0' || saved === '') return null;
      if (saved) {
        const n = parseInt(saved, 10);
        if (!isNaN(n) && n >= 1) return n;
      }
    } catch {}
    return null;
  });

  // Current page initializes directly at saved bookmark or initialPage
  const [currentPage, setCurrentPage] = useState<number>(() => {
    try {
      const saved = localStorage.getItem(bookmarkStorageKey);
      if (saved && saved !== 'none') {
        const n = parseInt(saved, 10);
        if (!isNaN(n) && n >= 1) return n;
      }
    } catch {}
    if (initialPage && initialPage >= 1) return initialPage;
    return 1;
  });

  // Auto-dismiss toast messages after brief delay
  useEffect(() => {
    if (!toastMessage) return;
    const t = setTimeout(() => setToastMessage(null), 2400);
    return () => clearTimeout(t);
  }, [toastMessage]);

  // Notify user if resumed from bookmark
  useEffect(() => {
    if (bookmarkedPage && bookmarkedPage > 1) {
      setToastMessage(`🔖 Resumed from bookmark at page ${bookmarkedPage}`);
    }
  }, []);

  const handleToggleBookmark = useCallback(() => {
    if (bookmarkedPage === currentPage) {
      setBookmarkedPage(null);
      try {
        localStorage.setItem(bookmarkStorageKey, 'none');
      } catch {}
      setToastMessage('Bookmark removed');
    } else {
      setBookmarkedPage(currentPage);
      try {
        localStorage.setItem(bookmarkStorageKey, String(currentPage));
      } catch {}
      onSavePage?.(currentPage);
      setToastMessage(`🔖 Bookmark saved at page ${currentPage}`);
    }
  }, [bookmarkedPage, currentPage, bookmarkStorageKey, onSavePage]);

  const shellRef         = useRef<HTMLDivElement>(null);
  const flipBookRef      = useRef<any>(null);
  const renderingDisplay = useRef<Set<number>>(new Set());
  const renderingThumb   = useRef<Set<number>>(new Set());

  // Fullscreen change listener to keep React state in sync with browser/OS
  useEffect(() => {
    const handleFsChange = () => {
      const isFs = Boolean(
        document.fullscreenElement ||
        (document as any).webkitFullscreenElement ||
        (document as any).mozFullScreenElement ||
        (document as any).msFullscreenElement
      );
      setIsFullscreen(isFs);
      if (isFs) {
        setZenMode(true);
        setShowZenControls(false);
        setToastMessage(null);
      } else {
        setZenMode(false);
        setShowZenControls(false);
      }
    };

    document.addEventListener('fullscreenchange', handleFsChange);
    document.addEventListener('webkitfullscreenchange', handleFsChange);
    document.addEventListener('mozfullscreenchange', handleFsChange);
    document.addEventListener('MSFullscreenChange', handleFsChange);

    return () => {
      document.removeEventListener('fullscreenchange', handleFsChange);
      document.removeEventListener('webkitfullscreenchange', handleFsChange);
      document.removeEventListener('mozfullscreenchange', handleFsChange);
      document.removeEventListener('MSFullscreenChange', handleFsChange);
    };
  }, []);

  // HTML5 Fullscreen Toggler (Cross-browser with graceful Zen Mode fallback)
  const toggleFullscreen = useCallback(async () => {
    const el = document.documentElement;
    if (!el) return;
    try {
      const isFs = Boolean(
        document.fullscreenElement ||
        (document as any).webkitFullscreenElement ||
        (document as any).mozFullScreenElement ||
        (document as any).msFullscreenElement
      );

      // Instantly start the UI transition on click for synchronized one-flow animation
      const target = !isFs;
      setZenMode(target);
      setIsFullscreen(target);
      setShowZenControls(false);

      if (target) {
        const fsOptions = { navigationUI: 'hide' } as FullscreenOptions;
        if (el.requestFullscreen) {
          await el.requestFullscreen(fsOptions);
        } else if ((el as any).webkitRequestFullscreen) {
          await (el as any).webkitRequestFullscreen();
        } else if ((el as any).mozRequestFullScreen) {
          await (el as any).mozRequestFullScreen();
        } else if ((el as any).msRequestFullscreen) {
          await (el as any).msRequestFullscreen();
        } else {
          // Mobile Safari or browsers without Fullscreen API
          setIsFullscreen(true);
        }
      } else {
        if (document.exitFullscreen) {
          await document.exitFullscreen();
        } else if ((document as any).webkitExitFullscreen) {
          await (document as any).webkitExitFullscreen();
        } else if ((document as any).mozCancelFullScreen) {
          await (document as any).mozCancelFullScreen();
        } else if ((document as any).msExitFullscreen) {
          await (document as any).msExitFullscreen();
        } else {
          setIsFullscreen(false);
        }
      }
    } catch (err) {
      console.warn('Fullscreen request failed:', err);
      // Fallback: If native fullscreen is blocked, still toggle Zen Mode
      setZenMode(z => !z);
      setIsFullscreen(f => !f);
    }
  }, []);

  const toggleZenMode = useCallback(() => {
    setZenMode(z => {
      const next = !z;
      setShowZenControls(false);
      return next;
    });
  }, []);

  // Auto-hide controls after delay when in zenMode
  useEffect(() => {
    if (!zenMode || !showZenControls) return;
    const timer = setTimeout(() => {
      setShowZenControls(false);
    }, 4500);
    return () => clearTimeout(timer);
  }, [zenMode, showZenControls, currentPage]);

  // Responsive 2-page spread sizing: fills screen edge-to-edge with minimum borders
  const [flipPageSize, setFlipPageSize] = useState(() => {
    if (typeof window !== 'undefined') {
      const availW = Math.max(window.screen?.width || 0, window.innerWidth || 1200);
      const availH = Math.max(window.screen?.height || 0, window.innerHeight || 800);
      const aspect = 0.707;
      const spreadAspect = 2 * aspect;
      if (availW / availH >= spreadAspect) {
        const h = availH;
        const w = Math.min(Math.floor(availW / 2), Math.round(h * aspect));
        return { width: w, height: h };
      } else {
        const w = Math.floor(availW / 2);
        const h = Math.min(availH, Math.round(w / aspect));
        return { width: w, height: h };
      }
    }
    return { width: 600, height: 850 };
  });
  const [pdfAspectRatio, setPdfAspectRatio] = useState(0.707);

  // Measure actual PDF page aspect ratio once loaded (checks current page or page 1)
  useEffect(() => {
    if (!pdfDoc) return;
    const pageToMeasure = Math.min(Math.max(1, currentPage), pdfDoc.numPages || 1);
    pdfDoc.getPage(pageToMeasure).then(page => {
      const vp = page.getViewport({ scale: 1 });
      if (vp.width && vp.height && vp.height > 0) {
        const ratio = vp.width / vp.height;
        if (!isNaN(ratio) && ratio > 0.2 && ratio < 4) {
          setPdfAspectRatio(prev => Math.abs(prev - ratio) > 0.005 ? ratio : prev);
        }
      }
    }).catch(() => {});
  }, [pdfDoc, currentPage]);

  // Compute full-screen edge-to-edge dimensions for 2-page spread
  // Anchored to display resolution so HTMLFlipBook NEVER unmounts during fullscreen transitions
  useEffect(() => {
    let timer: any = null;
    function compute() {
      const screenH = typeof window !== 'undefined' ? Math.max(window.screen?.height || 0, window.innerHeight || 800) : 800;
      const screenW = typeof window !== 'undefined' ? Math.max(window.screen?.width || 0, window.innerWidth || 1200) : 1200;

      const maxH = screenH;
      const maxSpreadW = screenW;

      const aspect = (!pdfAspectRatio || isNaN(pdfAspectRatio) || pdfAspectRatio <= 0) ? 0.707 : pdfAspectRatio;
      const spreadAspect = 2 * aspect;

      let singleW: number;
      let h: number;

      // Fit to screen as much as the aspect ratio supports:
      if (maxSpreadW / maxH >= spreadAspect) {
        // Height is the constraint (widescreen displays): book touches top and bottom edges
        h = maxH;
        singleW = Math.min(Math.floor(maxSpreadW / 2), Math.round(h * aspect));
      } else {
        // Width is the constraint (narrow/portrait displays): book touches left and right edges
        singleW = Math.floor(maxSpreadW / 2);
        h = Math.min(maxH, Math.round(singleW / aspect));
      }

      if (singleW > 50 && h > 50) {
        setFlipPageSize(prev => {
          // Avoid tiny jitter updates so key stays completely stable
          if (Math.abs(prev.width - singleW) < 8 && Math.abs(prev.height - h) < 8) {
            return prev;
          }
          return { width: singleW, height: h };
        });
      }
    }

    const debouncedCompute = () => {
      clearTimeout(timer);
      timer = setTimeout(compute, 350);
    };

    compute();

    window.addEventListener('resize', debouncedCompute);
    return () => {
      clearTimeout(timer);
      window.removeEventListener('resize', debouncedCompute);
    };
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
      const dpr = typeof window !== 'undefined' ? (window.devicePixelRatio || 1) : 1;
      const targetScale = Math.max(2.4, Math.min(3.6, dpr * 1.8));
      const dataUrl = await renderToDataUrl(doc, n, targetScale);
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

  // ── Progressive thumbnail rendering (ONLY when in document mode with sidebar open on desktop) ──
  useEffect(() => {
    if (!pdfDoc || !pages.length || viewMode !== 'document' || !sidebarOpen || isMobile) return;
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
  }, [pdfDoc, numPages, pages, renderThumb, viewMode, sidebarOpen, isMobile]);

  // ── Keyboard shortcuts ──
  useEffect(() => {
    const h = (e: KeyboardEvent) => {
      const activeTag = (document.activeElement?.tagName || '').toLowerCase();
      const isInput = activeTag === 'input' || activeTag === 'textarea';

      if (e.key === 'Escape') {
        const isCurrentlyFs = Boolean(
          document.fullscreenElement ||
          (document as any).webkitFullscreenElement
        );
        if (isCurrentlyFs || isFullscreen || zenMode) {
          if (isCurrentlyFs) {
            if (document.exitFullscreen) document.exitFullscreen().catch(() => {});
            else if ((document as any).webkitExitFullscreen) (document as any).webkitExitFullscreen();
          }
          setZenMode(false);
          setShowZenControls(false);
          return;
        }
        onClose();
        return;
      }

      if (!isInput) {
        if (e.key === 'f' || e.key === 'F') {
          toggleFullscreen();
          return;
        }
        if (e.key === 'z' || e.key === 'Z') {
          toggleZenMode();
          return;
        }
      }

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
  }, [onClose, numPages, viewMode, zenMode, isFullscreen, toggleFullscreen, toggleZenMode]);

  const pageState = pages[currentPage - 1] ?? { status: 'pending' };

  const handlePrev = () => {
    if (viewMode === 'book') flipBookRef.current?.pageFlip()?.flipPrev();
    else setCurrentPage(p => Math.max(1, p - 1));
  };
  const handleNext = () => {
    if (viewMode === 'book') flipBookRef.current?.pageFlip()?.flipNext();
    else setCurrentPage(p => Math.min(numPages, p + 1));
  };

  // Mobile swipe gestures & tap zones
  const touchStartX = useRef<number | null>(null);
  const touchStartY = useRef<number | null>(null);

  const handleTouchStart = (e: React.TouchEvent) => {
    if (e.touches.length === 1) {
      touchStartX.current = e.touches[0].clientX;
      touchStartY.current = e.touches[0].clientY;
    }
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null || touchStartY.current === null) return;
    const touchEndX = e.changedTouches[0].clientX;
    const touchEndY = e.changedTouches[0].clientY;
    const deltaX = touchEndX - touchStartX.current;
    const deltaY = touchEndY - touchStartY.current;

    // Minimum swipe threshold (40px) and ensure gesture is predominantly horizontal
    if (Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(deltaX) > 40) {
      if (deltaX > 0) {
        // Swiped Left to Right -> Previous page (turn back)
        handlePrev();
      } else {
        // Swiped Right to Left -> Next page (turn forward)
        handleNext();
      }
    } else if (Math.abs(deltaX) < 15 && Math.abs(deltaY) < 15) {
      // Tap detected!
      const width = window.innerWidth;
      const tapX = touchEndX;
      if (zenMode) {
        if (tapX < width * 0.25) {
          handlePrev();
        } else if (tapX > width * 0.75) {
          handleNext();
        } else {
          setShowZenControls(prev => !prev);
        }
      }
    }

    touchStartX.current = null;
    touchStartY.current = null;
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
    <Shell ref={shellRef} zenMode={zenMode}>
      <Toolbar
        bookTitle={bookTitle}
        currentPage={currentPage}
        numPages={numPages}
        zoom={zoom}
        sidebarOpen={!isMobile && sidebarOpen && viewMode === 'document' && !zenMode}
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
        isTwoPageSupported={isTwoPageSupported}
        windowWidth={windowSize.width}
        isFullscreen={isFullscreen}
        onToggleFullscreen={toggleFullscreen}
        zenMode={zenMode}
      />

      <div
        style={{ flex: 1, display: 'flex', overflow: 'hidden', position: 'relative' }}
      >
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

        {/* Exit fullscreen button — styled with Apple glassmorphism */}
        <button
          onClick={(e) => { e.stopPropagation(); toggleFullscreen(); }}
          title="Exit full screen (Esc)"
          style={{
            position: 'absolute',
            bottom: 20,
            right: 20,
            zIndex: 60,
            width: 42,
            height: 42,
            borderRadius: 12,
            background: T.isDark ? 'rgba(30, 26, 20, 0.65)' : 'rgba(255, 255, 255, 0.65)',
            border: `1px solid ${T.isDark ? 'rgba(255,255,255,0.15)' : 'rgba(0,0,0,0.1)'}`,
            color: T.isDark ? '#f2e8d5' : '#2e2014',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            backdropFilter: 'blur(8px)',
            WebkitBackdropFilter: 'blur(8px)',
            boxShadow: '0 8px 24px rgba(0,0,0,0.25)',
            opacity: zenMode ? 1 : 0,
            pointerEvents: zenMode ? 'auto' : 'none',
            transform: zenMode ? 'scale(1)' : 'scale(0.8)',
            transition: 'opacity 0.42s cubic-bezier(0.32, 0.72, 0, 1), transform 0.42s cubic-bezier(0.32, 0.72, 0, 1)',
            outline: 'none',
            padding: 0,
            flexShrink: 0,
          }}
          onMouseEnter={e => {
            if (zenMode) {
              e.currentTarget.style.transform = 'scale(1.1)';
              e.currentTarget.style.background = T.isDark ? 'rgba(45, 38, 30, 0.85)' : 'rgba(255, 255, 255, 0.85)';
              e.currentTarget.style.boxShadow = '0 0 20px rgba(0,0,0,0.2)';
            }
          }}
          onMouseLeave={e => {
            if (zenMode) {
              e.currentTarget.style.transform = 'scale(1)';
              e.currentTarget.style.background = T.isDark ? 'rgba(30, 26, 20, 0.65)' : 'rgba(255, 255, 255, 0.65)';
              e.currentTarget.style.boxShadow = '0 8px 24px rgba(0,0,0,0.25)';
            }
          }}
          onMouseDown={e => { if (zenMode) e.currentTarget.style.transform = 'scale(0.95)'; }}
          onMouseUp={e => { if (zenMode) e.currentTarget.style.transform = 'scale(1.1)'; }}
          aria-label="Exit full screen"
        >
          <Minimize2 size={18} strokeWidth={2.2} />
        </button>

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
                perspective: 1500,
                padding: 0,
                transition: 'opacity 0.3s ease',
                opacity: flipReady ? 1 : 0,
                visibility: flipReady ? 'visible' : 'hidden',
                pointerEvents: flipReady ? 'auto' : 'none',
              }}>
            {/* Apple-style backdrop blur transition */}
            <div
              style={{
                position: 'absolute',
                inset: 0,
                pointerEvents: 'none',
                background: T.isDark ? 'rgba(0,0,0,0.45)' : 'rgba(0,0,0,0.18)',
                backdropFilter: 'blur(12px)',
                WebkitBackdropFilter: 'blur(12px)',
                opacity: zenMode ? 1 : 0,
                transition: 'opacity 0.42s cubic-bezier(0.32, 0.72, 0, 1)',
                willChange: 'opacity',
                zIndex: 2,
              }}
            />

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
              opacity: zenMode && !showZenControls ? 0 : 1,
              pointerEvents: zenMode && !showZenControls ? 'none' : 'auto',
              transition: 'opacity 0.25s ease',
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

            {/* Warm desk glow / vignette — smoothly fades in zenMode */}
            <div style={{
              position: 'absolute', inset: 0, pointerEvents: 'none',
              background: T.deskVignette,
              opacity: zenMode ? 0 : 1,
              transition: 'opacity 0.42s cubic-bezier(0.32, 0.72, 0, 1)',
              willChange: 'opacity',
            }} />
            {/* Apple-style Spread Container with smooth scale, radius, and shadow morphing */}
            {(() => {
              const availNormalH = Math.max(300, (windowSize.height || 800) - 100);
              const availNormalW = Math.max(400, (windowSize.width || 1200) - (sidebarOpen ? 280 : 64));
              const scaleH = availNormalH / Math.max(1, flipPageSize.height);
              const scaleW = availNormalW / Math.max(1, flipPageSize.width * 2);
              const normalScale = Math.min(0.92, Math.max(0.50, Math.min(scaleH, scaleW)));

              return (
                <div
                  style={{
                    position: 'relative',
                    zIndex: 10,
                    borderRadius: 18,
                    overflow: 'hidden',
                    boxShadow: zenMode
                      ? (T.isDark
                        ? '0 24px 70px rgba(0,0,0,0.65), 0 4px 20px rgba(0,0,0,0.45)'
                        : '0 24px 70px rgba(0,0,0,0.26), 0 4px 16px rgba(0,0,0,0.12)')
                      : (T.isDark
                        ? '0 16px 48px rgba(0,0,0,0.50), 0 4px 14px rgba(0,0,0,0.35)'
                        : '0 16px 48px rgba(0,0,0,0.18), 0 4px 12px rgba(0,0,0,0.06)'),
                    transform: zenMode
                      ? 'scale(1)'
                      : `scale(${normalScale})`,
                    transformOrigin: 'center center',
                    willChange: 'transform, box-shadow',
                    transition: 'transform 0.42s cubic-bezier(0.32, 0.72, 0, 1), box-shadow 0.42s cubic-bezier(0.32, 0.72, 0, 1)',
                  }}
                >
                  <HTMLFlipBook
                    key={`flip_${flipPageSize.width}_${flipPageSize.height}`}
                    ref={flipBookRef}
                    width={flipPageSize.width}
                    height={flipPageSize.height}
                    size="fixed"
                    minWidth={100} minHeight={100} maxWidth={4000} maxHeight={4000}
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
                    disableFlipByClick={false}
                  >
                    {pages.map((ps, i) => (
                      <PdfPage key={i} pageState={ps} pageNum={i + 1} zenMode={zenMode} />
                    ))}
                  </HTMLFlipBook>
                </div>
              );
            })()}
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
                opacity: zenMode && !showZenControls ? 0 : currentPage <= 1 ? 0.3 : 1,
                pointerEvents: zenMode && !showZenControls ? 'none' : 'auto',
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
                opacity: zenMode && !showZenControls ? 0 : currentPage >= numPages ? 0.3 : 1,
                pointerEvents: zenMode && !showZenControls ? 'none' : 'auto',
              }}
              title="Next page (Right Arrow)"
            ><ChevronRight size={22} /></button>
          </div>
        ) : (
          /* ── Document mode ── */
          <div
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
            style={{
              flex: 1,
              display: 'flex',
              position: 'relative',
              overflow: 'hidden',
              touchAction: 'pan-y',
            }}
          >
            {!isMobile && sidebarOpen && numPages > 0 && !zenMode && (
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
                right: isMobile ? 12 : 28,
                zIndex: 35,
                opacity: zenMode && !showZenControls ? 0 : 1,
                pointerEvents: zenMode && !showZenControls ? 'none' : 'auto',
                transition: 'opacity 0.25s ease',
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

              {/* On-screen Page Change Buttons for Document / Mobile Mode */}
              {numPages > 0 && (
                <>
                  <button
                    onClick={handlePrev}
                    disabled={currentPage <= 1}
                    style={{
                      position: 'absolute',
                      left: isMobile ? 8 : 16,
                      top: '50%',
                      transform: 'translateY(-50%)',
                      width: isMobile ? 40 : 44,
                      height: isMobile ? 40 : 44,
                      borderRadius: '50%',
                      border: `1px solid ${T.border}`,
                      background: T.isDark ? 'rgba(21,18,14,0.88)' : 'rgba(250,247,241,0.92)',
                      color: currentPage <= 1 ? T.textFaint : T.brass,
                      cursor: currentPage <= 1 ? 'default' : 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      backdropFilter: 'blur(8px)',
                      boxShadow: '0 4px 16px rgba(0,0,0,0.28)',
                      transition: 'all 0.2s ease',
                      zIndex: 30,
                      opacity: zenMode && !showZenControls ? 0 : currentPage <= 1 ? 0.3 : 0.9,
                      pointerEvents: zenMode && !showZenControls ? 'none' : 'auto',
                    }}
                    title="Previous page"
                    aria-label="Previous page"
                  >
                    <ChevronLeft size={isMobile ? 22 : 24} />
                  </button>

                  <button
                    onClick={handleNext}
                    disabled={currentPage >= numPages}
                    style={{
                      position: 'absolute',
                      right: isMobile ? 8 : 16,
                      top: '50%',
                      transform: 'translateY(-50%)',
                      width: isMobile ? 40 : 44,
                      height: isMobile ? 40 : 44,
                      borderRadius: '50%',
                      border: `1px solid ${T.border}`,
                      background: T.isDark ? 'rgba(21,18,14,0.88)' : 'rgba(250,247,241,0.92)',
                      color: currentPage >= numPages ? T.textFaint : T.brass,
                      cursor: currentPage >= numPages ? 'default' : 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      backdropFilter: 'blur(8px)',
                      boxShadow: '0 4px 16px rgba(0,0,0,0.28)',
                      transition: 'all 0.2s ease',
                      zIndex: 30,
                      opacity: zenMode && !showZenControls ? 0 : currentPage >= numPages ? 0.3 : 0.9,
                      pointerEvents: zenMode && !showZenControls ? 'none' : 'auto',
                    }}
                    title="Next page"
                    aria-label="Next page"
                  >
                    <ChevronRight size={isMobile ? 22 : 24} />
                  </button>

                  {/* Mobile floating bottom page navigation pill */}
                  {isMobile && (
                    <div style={{
                      position: 'absolute',
                      bottom: 14,
                      left: '50%',
                      transform: zenMode && !showZenControls ? 'translateX(-50%) translateY(120%)' : 'translateX(-50%) translateY(0)',
                      display: 'flex',
                      alignItems: 'center',
                      gap: 2,
                      background: T.isDark ? 'rgba(21,18,14,0.92)' : 'rgba(250,247,241,0.95)',
                      border: `1px solid ${T.border}`,
                      borderRadius: 24,
                      padding: '3px 8px',
                      boxShadow: '0 6px 20px rgba(0,0,0,0.3)',
                      backdropFilter: 'blur(10px)',
                      zIndex: 35,
                      userSelect: 'none',
                      opacity: zenMode && !showZenControls ? 0 : 1,
                      pointerEvents: zenMode && !showZenControls ? 'none' : 'auto',
                      transition: 'transform 0.28s ease, opacity 0.25s ease',
                    }}>
                      <button
                        onClick={handlePrev}
                        disabled={currentPage <= 1}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: 2,
                          background: 'none',
                          border: 'none',
                          color: currentPage <= 1 ? T.textFaint : T.brass,
                          fontSize: 12,
                          fontWeight: 600,
                          cursor: currentPage <= 1 ? 'default' : 'pointer',
                          padding: '4px 8px',
                          borderRadius: 12,
                        }}
                      >
                        <ChevronLeft size={15} /> Prev
                      </button>
                      <span style={{
                        fontSize: 11,
                        fontFamily: 'Inter',
                        color: T.text,
                        fontWeight: 600,
                        padding: '0 8px',
                        borderLeft: `1px solid ${T.border}`,
                        borderRight: `1px solid ${T.border}`,
                      }}>
                        {currentPage} / {numPages}
                      </span>
                      <button
                        onClick={handleNext}
                        disabled={currentPage >= numPages}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: 2,
                          background: 'none',
                          border: 'none',
                          color: currentPage >= numPages ? T.textFaint : T.brass,
                          fontSize: 12,
                          fontWeight: 600,
                          cursor: currentPage >= numPages ? 'default' : 'pointer',
                          padding: '4px 8px',
                          borderRadius: 12,
                        }}
                      >
                        Next <ChevronRight size={15} />
                      </button>
                    </div>
                  )}
                </>
              )}

              <PageDisplay pageState={pageState} pageNum={currentPage} zoom={zoom} zenMode={zenMode} />
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
  const containerRef = useRef<HTMLDivElement>(null);

  const [isFullscreen, setIsFullscreen]       = useState(false);
  const [zenMode, setZenMode]                 = useState(false);

  useEffect(() => {
    const handleFsChange = () => {
      const isFs = Boolean(
        document.fullscreenElement ||
        (document as any).webkitFullscreenElement ||
        (document as any).mozFullScreenElement ||
        (document as any).msFullscreenElement
      );
      setIsFullscreen(isFs);
      setZenMode(isFs);
    };
    document.addEventListener('fullscreenchange', handleFsChange);
    document.addEventListener('webkitfullscreenchange', handleFsChange);
    return () => {
      document.removeEventListener('fullscreenchange', handleFsChange);
      document.removeEventListener('webkitfullscreenchange', handleFsChange);
    };
  }, []);

  const toggleFullscreen = useCallback(async () => {
    const el = document.documentElement;
    if (!el) return;
    try {
      const isFs = Boolean(
        document.fullscreenElement ||
        (document as any).webkitFullscreenElement ||
        (document as any).mozFullScreenElement ||
        (document as any).msFullscreenElement
      );
      // Instantly start UI transition on click for synchronized one-flow animation
      const target = !isFs;
      setZenMode(target);
      setIsFullscreen(target);
      if (target) {
        if (el.requestFullscreen) await el.requestFullscreen();
        else if ((el as any).webkitRequestFullscreen) await (el as any).webkitRequestFullscreen();
        else {
          setIsFullscreen(true);
        }
      } else {
        if (document.exitFullscreen) await document.exitFullscreen();
        else if ((document as any).webkitExitFullscreen) await (document as any).webkitExitFullscreen();
        else {
          setIsFullscreen(false);
        }
      }
    } catch {
      setZenMode(z => !z);
      setIsFullscreen(f => !f);
    }
  }, []);

  useEffect(() => {
    const h = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (zenMode && !isFullscreen) {
          setZenMode(false);
          return;
        }
        onClose();
        return;
      }
      if (e.key === 'f' || e.key === 'F') {
        toggleFullscreen();
      }
      if (e.key === 'z' || e.key === 'Z') {
        setZenMode(z => !z);
      }
    };
    window.addEventListener('keydown', h);
    return () => window.removeEventListener('keydown', h);
  }, [onClose, zenMode, isFullscreen, toggleFullscreen]);

  const isFull = zenMode || isFullscreen;

  return (
    <div
      ref={containerRef}
      style={{
        position: 'fixed', inset: 0, zIndex: 100,
        display: 'flex', flexDirection: 'column',
        background: T.bg,
      }}
    >
      {/* Header — explicit z-index so iframe can never cover it */}
      <div style={{
        height: zenMode ? 0 : 52,
        maxHeight: zenMode ? 0 : 52,
        flexShrink: 0,
        position: 'relative',
        top: 0, left: 0, right: 0,
        zIndex: 70,
        background: T.bgDark,
        borderBottom: `1px solid ${zenMode ? 'transparent' : T.border}`,
        opacity: zenMode ? 0 : 1,
        transform: zenMode ? 'translateY(-100%)' : 'translateY(0)',
        marginBottom: zenMode ? -52 : 0,
        transition: 'transform 0.42s cubic-bezier(0.32, 0.72, 0, 1), opacity 0.42s cubic-bezier(0.32, 0.72, 0, 1), margin-bottom 0.42s cubic-bezier(0.32, 0.72, 0, 1), border-color 0.42s cubic-bezier(0.32, 0.72, 0, 1)',
        display: 'flex', alignItems: 'center', gap: 4, padding: '0 8px',
        userSelect: 'none',
        overflow: zenMode ? 'hidden' : 'visible',
        pointerEvents: zenMode ? 'none' : 'auto',
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

        {/* Fullscreen toggle */}
        <ToolBtn
          onClick={toggleFullscreen}
          active={isFullscreen}
          title={isFullscreen ? 'Exit Full Screen (F / Esc)' : 'Full Screen — Edge-to-Edge (F)'}
        >
          {isFullscreen ? <Minimize2 size={16} /> : <Maximize2 size={16} />}
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

      {/* Exit fullscreen button — styled with Apple glassmorphism */}
      <button
        onClick={toggleFullscreen}
        title="Exit full screen (Esc)"
        style={{
          position: 'absolute',
          bottom: 20,
          right: 20,
          zIndex: 60,
          width: 42,
          height: 42,
          borderRadius: 12,
          background: T.isDark ? 'rgba(30, 26, 20, 0.65)' : 'rgba(255, 255, 255, 0.65)',
          border: `1px solid ${T.isDark ? 'rgba(255,255,255,0.15)' : 'rgba(0,0,0,0.1)'}`,
          color: T.isDark ? '#f2e8d5' : '#2e2014',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          backdropFilter: 'blur(8px)',
          WebkitBackdropFilter: 'blur(8px)',
          boxShadow: '0 8px 24px rgba(0,0,0,0.25)',
          opacity: isFull ? 1 : 0,
          pointerEvents: isFull ? 'auto' : 'none',
          transform: isFull ? 'scale(1)' : 'scale(0.8)',
          transition: 'opacity 0.38s cubic-bezier(0.2, 0.9, 0.3, 1), transform 0.38s cubic-bezier(0.2, 0.9, 0.3, 1)',
          outline: 'none',
          padding: 0,
          flexShrink: 0,
        }}
        onMouseEnter={e => {
          if (isFull) {
            e.currentTarget.style.transform = 'scale(1.1)';
            e.currentTarget.style.background = T.isDark ? 'rgba(45, 38, 30, 0.85)' : 'rgba(255, 255, 255, 0.85)';
            e.currentTarget.style.boxShadow = '0 0 20px rgba(0,0,0,0.2)';
          }
        }}
        onMouseLeave={e => {
          if (isFull) {
            e.currentTarget.style.transform = 'scale(1)';
            e.currentTarget.style.background = T.isDark ? 'rgba(30, 26, 20, 0.65)' : 'rgba(255, 255, 255, 0.65)';
            e.currentTarget.style.boxShadow = '0 8px 24px rgba(0,0,0,0.25)';
          }
        }}
        onMouseDown={e => { if (isFull) e.currentTarget.style.transform = 'scale(0.95)'; }}
        onMouseUp={e => { if (isFull) e.currentTarget.style.transform = 'scale(1.1)'; }}
        aria-label="Exit full screen"
      >
        <Minimize2 size={18} strokeWidth={2.2} />
      </button>

      {/* Iframe area — Apple-style spread transition */}
      <div
        style={{
          flex: 1,
          position: 'relative',
          zIndex: 1,
          overflow: 'hidden',
          borderRadius: 18,
          boxShadow: isFull
            ? (T.isDark ? '0 24px 64px rgba(0,0,0,0.65)' : '0 24px 64px rgba(0,0,0,0.22)')
            : (T.isDark ? '0 16px 48px rgba(0,0,0,0.50)' : '0 16px 48px rgba(0,0,0,0.18)'),
          margin: isFull ? 0 : '12px 20px 20px 20px',
          transform: isFull ? 'scale(1)' : 'scale(0.97)',
          transformOrigin: 'center center',
          transition: 'transform 0.42s cubic-bezier(0.32, 0.72, 0, 1), box-shadow 0.42s cubic-bezier(0.32, 0.72, 0, 1), margin 0.42s cubic-bezier(0.32, 0.72, 0, 1)',
          willChange: 'transform, box-shadow',
        }}
      >
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

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes fadeFloatIn {
          0% {
            opacity: 0;
            transform: translateY(8px) scale(0.85);
          }
          100% {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }

        html, body, :fullscreen, ::backdrop, :fullscreen::backdrop, :-webkit-full-screen, :-webkit-full-screen::backdrop {
          background: ${T.bg} !important;
          background-color: ${T.bg} !important;
        }
      `}</style>
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

