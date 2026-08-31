import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Modal } from './ui/Modal';
import {
  BookOpen,
  Award,
  Flame,
  Star,
  X,
  Bookmark,
  ChevronLeft,
  ChevronRight,
  Sparkles,
} from 'lucide-react';
import type { Book } from '../types/book';
import type { StreakLog } from './StreakManager';
import { calculateStreaks } from '../utils/helpers';

interface ReadingWrappedModalProps {
  open: boolean;
  onClose: () => void;
  books: Book[];
  streakLog: StreakLog;
  userName?: string;
  earnedBadgesCount?: number;
}

export function ReadingWrappedModal({
  open,
  onClose,
  books,
  streakLog,
  userName = 'Reader',
  earnedBadgesCount = 0,
}: ReadingWrappedModalProps) {
  const currentYear = new Date().getFullYear();

  // Determine years that have finished books
  const availableYears = useMemo(() => {
    const yearSet = new Set<number>();
    books.forEach((b) => {
      if (b.status === 'read' && b.dateFinished) {
        const y = new Date(b.dateFinished).getFullYear();
        if (!Number.isNaN(y)) yearSet.add(y);
      }
    });
    yearSet.add(currentYear);
    return Array.from(yearSet).sort((a, b) => b - a);
  }, [books, currentYear]);

  const [selectedYear, setSelectedYear] = useState(currentYear);
  const [isFlipped, setIsFlipped] = useState(false);

  // Stats for selected year
  const yearData = useMemo(() => {
    const readBooks = books.filter((b) => {
      if (b.status !== 'read') return false;
      if (!b.dateFinished) return false;
      return new Date(b.dateFinished).getFullYear() === selectedYear;
    });

    const totalBooks = readBooks.length;
    const totalPages = readBooks.reduce((sum, b) => sum + (b.totalPages || 0), 0);

    const genreCounts: Record<string, number> = {};
    readBooks.forEach((b) => {
      genreCounts[b.genre] = (genreCounts[b.genre] || 0) + 1;
    });
    const topGenreEntry = Object.entries(genreCounts).sort((a, b) => b[1] - a[1])[0];
    const topGenre = topGenreEntry ? topGenreEntry[0] : 'Literature';

    const topRated =
      readBooks.filter((b) => b.rating && b.rating >= 4)[0] ||
      readBooks[0] ||
      null;

    return { readBooks, totalBooks, totalPages, topGenre, topRated };
  }, [books, selectedYear]);

  const { highestStreak } = useMemo(() => calculateStreaks(streakLog), [streakLog]);

  // Year navigation
  const currentIdx = availableYears.indexOf(selectedYear);
  const canGoPrev = currentIdx < availableYears.length - 1;
  const canGoNext = currentIdx > 0;

  const navigateYear = (direction: 'prev' | 'next') => {
    const newIdx = direction === 'prev' ? currentIdx + 1 : currentIdx - 1;
    if (newIdx >= 0 && newIdx < availableYears.length) {
      setIsFlipped(false);
      setSelectedYear(availableYears[newIdx]);
    }
  };

  if (!open) return null;

  const isCurrentYear = selectedYear === currentYear;

  return (
    <Modal open={open} onClose={onClose} title="" maxWidth="max-w-[400px]" bare hideHeader hideCloseButton>
      <div className="relative w-full select-none flex flex-col items-center">
        {/* Year Navigator (floating subtly above card) */}
        {availableYears.length > 1 && (
          <div className="flex items-center justify-center gap-3 mb-3 bg-black/40 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-[#C5A666]/30 shadow-lg">
            <button
              onClick={() => navigateYear('prev')}
              disabled={!canGoPrev}
              className="text-[#E8D19B] hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-colors p-0.5"
            >
              <ChevronLeft size={16} />
            </button>
            <span className="font-display text-sm font-semibold tracking-wider text-[#F3E1BC] min-w-[3.5rem] text-center">
              {selectedYear}
            </span>
            <button
              onClick={() => navigateYear('next')}
              disabled={!canGoNext}
              className="text-[#E8D19B] hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-colors p-0.5"
            >
              <ChevronRight size={16} />
            </button>
          </div>
        )}

        {/* Card Flip Container */}
        <div
          className="relative w-full cursor-pointer"
          style={{ perspective: '1200px' }}
          onClick={() => setIsFlipped((f) => !f)}
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={`${selectedYear}-${isFlipped ? 'back' : 'front'}`}
              initial={{ rotateY: isFlipped ? -90 : 90, opacity: 0 }}
              animate={{ rotateY: 0, opacity: 1 }}
              exit={{ rotateY: isFlipped ? 90 : -90, opacity: 0 }}
              transition={{ duration: 0.35, ease: [0.4, 0, 0.2, 1] }}
              style={{ transformStyle: 'preserve-3d', backfaceVisibility: 'hidden' }}
            >
              {!isFlipped ? (
                /* ══════════════ FRONT FACE (Exact match to reference) ══════════════ */
                <div
                  className="relative rounded-[26px] overflow-hidden shadow-[0_20px_60px_rgba(0,0,0,0.5)] border-2 border-[#163326]"
                  style={{
                    backgroundColor: '#1E3E30',
                    backgroundImage: 'radial-gradient(circle at 50% 20%, #264D3D 0%, #1A362A 100%)',
                  }}
                >
                  {/* Close button (top right inside card) */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onClose();
                    }}
                    className="absolute top-4 right-4 z-20 rounded-full p-1 text-[#C5A666]/70 hover:text-[#F3E1BC] hover:bg-black/20 transition-all"
                    aria-label="Close"
                  >
                    <X size={18} />
                  </button>

                  {/* Outer Stitched Dashed Gold Border */}
                  <div
                    className="m-3.5 rounded-[18px] p-4 flex flex-col justify-between"
                    style={{
                      border: '1.5px dashed rgba(206, 172, 114, 0.65)',
                    }}
                  >
                    {/* Header */}
                    <div className="mb-4 pr-6">
                      <p className="font-mono text-[10px] tracking-[0.2em] uppercase font-bold text-[#C5A666]">
                        Reading Wrapped
                      </p>
                      <h2 className="font-display text-4xl font-bold tracking-tight text-[#E8D19B] mt-0.5 leading-none">
                        {selectedYear}
                      </h2>
                      <p className="text-xs text-[#D1C4B0] font-serif mt-1">
                        {userName}&rsquo;s year in books
                      </p>
                    </div>

                    {/* 2 Shield Badges Row */}
                    <div className="grid grid-cols-2 gap-3.5 mb-4">
                      {/* Left Shield: Books Finished */}
                      <div
                        className="relative rounded-2xl p-3 text-center flex flex-col items-center justify-center overflow-hidden"
                        style={{
                          backgroundColor: '#152C22',
                          border: '1.5px solid rgba(206, 172, 114, 0.5)',
                          boxShadow: 'inset 0 0 12px rgba(0,0,0,0.4)',
                        }}
                      >
                        {/* Nested inner fine gold outline */}
                        <div
                          className="pointer-events-none absolute inset-1 rounded-xl"
                          style={{ border: '1px solid rgba(206, 172, 114, 0.25)' }}
                        />
                        <div className="mb-1 text-[#DFBA73]">
                          <BookOpen size={24} strokeWidth={1.8} />
                        </div>
                        <p className="font-display text-4xl font-bold text-[#E8D19B] leading-none my-0.5">
                          {yearData.totalBooks}
                        </p>
                        <p className="text-[11px] font-serif text-[#D1C4B0] font-medium">
                          Books Finished
                        </p>
                      </div>

                      {/* Right Shield: Pages Read */}
                      <div
                        className="relative rounded-2xl p-3 text-center flex flex-col items-center justify-center overflow-hidden"
                        style={{
                          backgroundColor: '#152C22',
                          border: '1.5px solid rgba(206, 172, 114, 0.5)',
                          boxShadow: 'inset 0 0 12px rgba(0,0,0,0.4)',
                        }}
                      >
                        {/* Nested inner fine gold outline */}
                        <div
                          className="pointer-events-none absolute inset-1 rounded-xl"
                          style={{ border: '1px solid rgba(206, 172, 114, 0.25)' }}
                        />
                        <div className="mb-1 text-[#DFBA73]">
                          <Bookmark size={24} strokeWidth={1.8} className="fill-[#DFBA73]/30" />
                        </div>
                        <p className="font-display text-4xl font-bold text-[#E8D19B] leading-none my-0.5">
                          {yearData.totalPages.toLocaleString()}
                        </p>
                        <p className="text-[11px] font-serif text-[#D1C4B0] font-medium">
                          Pages Read
                        </p>
                      </div>
                    </div>

                    {/* 3-Column Metrics Strip */}
                    <div
                      className="grid grid-cols-3 rounded-lg overflow-hidden mb-3.5"
                      style={{
                        backgroundColor: '#152C22',
                        border: '1.5px dashed rgba(206, 172, 114, 0.45)',
                      }}
                    >
                      {/* Day Streak */}
                      <div className="py-2.5 px-2 text-center flex flex-col items-center justify-center">
                        <Flame size={18} className="text-[#DFBA73] mb-0.5" />
                        <p className="font-display text-lg font-bold text-[#E8D19B] leading-none">
                          {isCurrentYear ? highestStreak : '—'}
                        </p>
                        <p className="text-[8px] font-mono tracking-wider uppercase font-bold text-[#C5A666] mt-0.5">
                          Day Streak
                        </p>
                      </div>

                      {/* Badges */}
                      <div
                        className="py-2.5 px-2 text-center flex flex-col items-center justify-center"
                        style={{
                          borderLeft: '1.5px dashed rgba(206, 172, 114, 0.45)',
                          borderRight: '1.5px dashed rgba(206, 172, 114, 0.45)',
                        }}
                      >
                        <Award size={18} className="text-[#DFBA73] mb-0.5" />
                        <p className="font-display text-lg font-bold text-[#E8D19B] leading-none">
                          {isCurrentYear ? earnedBadgesCount : '—'}
                        </p>
                        <p className="text-[8px] font-mono tracking-wider uppercase font-bold text-[#C5A666] mt-0.5">
                          Badges
                        </p>
                      </div>

                      {/* Top Genre (Gold Solid Highlight) */}
                      <div
                        className="py-2.5 px-2 text-center flex flex-col items-center justify-center"
                        style={{
                          backgroundColor: '#C89F49',
                        }}
                      >
                        <div className="flex items-center justify-center gap-1 text-[#2B2012] mb-0.5">
                          <span className="text-xs font-serif leading-none">🌿</span>
                          <Bookmark size={13} className="fill-[#2B2012] text-[#2B2012]" />
                          <span className="text-xs font-serif leading-none">🌿</span>
                        </div>
                        <p
                          className="font-display text-[13px] font-bold text-[#211C17] leading-tight truncate max-w-full px-0.5"
                          title={yearData.topGenre}
                        >
                          {yearData.topGenre}
                        </p>
                        <p className="text-[8px] font-mono tracking-wider uppercase font-bold text-[#4A381C] mt-0.5">
                          Top Genre
                        </p>
                      </div>
                    </div>

                    {/* Top Read Wood-Grain Plank Container */}
                    <div
                      className="rounded-xl p-2.5 mb-3"
                      style={{
                        backgroundColor: '#352115',
                        backgroundImage: `
                          repeating-linear-gradient(
                            90deg,
                            rgba(42, 25, 15, 0.95),
                            rgba(42, 25, 15, 0.95) 4px,
                            rgba(58, 35, 22, 0.95) 4px,
                            rgba(58, 35, 22, 0.95) 8px
                          )
                        `,
                        border: '1.5px solid rgba(139, 90, 43, 0.6)',
                        boxShadow: 'inset 0 2px 8px rgba(0,0,0,0.5)',
                      }}
                    >
                      {/* Cream Parchment Overlay */}
                      <div
                        className="rounded-lg px-3.5 py-2.5 shadow-sm"
                        style={{
                          backgroundColor: '#FAF5EA',
                          border: '1px solid rgba(206, 172, 114, 0.4)',
                        }}
                      >
                        <div className="flex items-center gap-1 text-[10px] font-bold tracking-wider uppercase text-[#9E6E2E]">
                          <Star size={11} className="fill-[#9E6E2E] text-[#9E6E2E]" />
                          <span>Top Read</span>
                        </div>
                        <p className="font-display text-sm font-bold text-[#211C17] truncate mt-0.5">
                          {yearData.topRated?.title || 'No books logged'}
                        </p>
                        <p className="text-xs text-[#6B6459] font-serif truncate">
                          {yearData.topRated?.author || 'Read books to unlock standout title'}
                        </p>
                      </div>
                    </div>

                    {/* Bottom Dark Plank with 'Tap card to see books ~>' and Sparkle */}
                    <div
                      className="rounded-lg py-2 px-3 flex items-center justify-between"
                      style={{
                        backgroundColor: '#26160E',
                        border: '1px solid rgba(139, 90, 43, 0.4)',
                      }}
                    >
                      <div className="flex items-center gap-1.5 text-xs text-[#D1C4B0]/80 font-serif mx-auto">
                        <span>Tap card to see books</span>
                        <span className="text-[#DFBA73] font-bold text-sm tracking-tighter">⟶</span>
                      </div>
                      <Sparkles size={13} className="text-[#DFBA73]/80 -mr-0.5" />
                    </div>
                  </div>
                </div>
              ) : (
                /* ══════════════ BACK FACE (Book List) ══════════════ */
                <div
                  className="relative rounded-[26px] overflow-hidden shadow-[0_20px_60px_rgba(0,0,0,0.5)] border-2 border-[#163326]"
                  style={{
                    backgroundColor: '#1E3E30',
                    backgroundImage: 'radial-gradient(circle at 50% 20%, #264D3D 0%, #1A362A 100%)',
                  }}
                >
                  {/* Close button */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onClose();
                    }}
                    className="absolute top-4 right-4 z-20 rounded-full p-1 text-[#C5A666]/70 hover:text-[#F3E1BC] hover:bg-black/20 transition-all"
                    aria-label="Close"
                  >
                    <X size={18} />
                  </button>

                  <div
                    className="m-3.5 rounded-[18px] p-4 flex flex-col justify-between"
                    style={{
                      border: '1.5px dashed rgba(206, 172, 114, 0.65)',
                    }}
                  >
                    {/* Header */}
                    <div className="mb-3 pr-6">
                      <p className="font-mono text-[10px] tracking-[0.2em] uppercase font-bold text-[#C5A666]">
                        Books Read in
                      </p>
                      <h2 className="font-display text-3xl font-bold tracking-tight text-[#E8D19B] mt-0.5 leading-none">
                        {selectedYear}
                      </h2>
                    </div>

                    {/* Scrollable list of books read */}
                    <div className="space-y-2 max-h-[320px] overflow-y-auto scrollbar-thin pr-1 my-2">
                      {yearData.readBooks.length === 0 ? (
                        <div className="py-12 text-center text-xs font-serif italic text-[#D1C4B0]/60">
                          No finished books logged in {selectedYear}.
                        </div>
                      ) : (
                        yearData.readBooks.map((book) => (
                          <div
                            key={book.id}
                            className="rounded-lg p-2.5 flex items-center gap-3 shadow-sm"
                            style={{
                              backgroundColor: '#FAF5EA',
                              border: '1px solid rgba(206, 172, 114, 0.4)',
                            }}
                          >
                            <div className="h-12 w-8 shrink-0 overflow-hidden rounded bg-[#EFE8D8] border border-black/5 shadow-xs">
                              {book.coverUrl ? (
                                <img
                                  src={book.coverUrl}
                                  alt={book.title}
                                  className="h-full w-full object-cover"
                                  style={{
                                    objectPosition: `${book.coverFocusX ?? 50}% ${book.coverFocusY ?? 50}%`,
                                  }}
                                />
                              ) : (
                                <div className="h-full w-full flex items-center justify-center text-ink/20">
                                  <BookOpen size={12} />
                                </div>
                              )}
                            </div>
                            <div className="min-w-0 flex-1">
                              <p className="font-display text-xs font-bold text-[#211C17] truncate">
                                {book.title}
                              </p>
                              <p className="text-[10px] text-[#6B6459] font-serif truncate">
                                {book.author}
                              </p>
                            </div>
                            <div className="flex items-center gap-0.5 shrink-0">
                              {book.rating ? (
                                Array.from({ length: 5 }).map((_, i) => (
                                  <Star
                                    key={i}
                                    size={8}
                                    className={
                                      i < (book.rating ?? 0)
                                        ? 'fill-[#9E6E2E] text-[#9E6E2E]'
                                        : 'text-black/15'
                                    }
                                  />
                                ))
                              ) : (
                                <span className="text-[9px] text-[#9C9384] italic font-serif">Unrated</span>
                              )}
                            </div>
                          </div>
                        ))
                      )}
                    </div>

                    {/* Bottom Dark Plank with 'Tap to flip back' */}
                    <div
                      className="rounded-lg py-2 px-3 flex items-center justify-center mt-2"
                      style={{
                        backgroundColor: '#26160E',
                        border: '1px solid rgba(139, 90, 43, 0.4)',
                      }}
                    >
                      <div className="flex items-center gap-1.5 text-xs text-[#D1C4B0]/80 font-serif">
                        <span className="text-[#DFBA73] font-bold text-sm tracking-tighter">⟵</span>
                        <span>Tap to flip back</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </Modal>
  );
}
