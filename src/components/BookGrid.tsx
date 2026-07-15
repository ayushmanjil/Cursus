import { AnimatePresence } from 'framer-motion';
import { BookText } from 'lucide-react';
import type { Book, BookStatus } from '../types/book';
import { BookCard } from './BookCard';
import { EmptyState } from './ui/EmptyState';

interface BookGridProps {
  books: Book[];
  onOpen: (book: Book) => void;
  onToggleFavorite: (id: string) => void;
  onSetStatus: (id: string, status: BookStatus) => void;
  onDelete: (id: string) => void;
  emptyTitle?: string;
  emptyDescription?: string;
  emptyAction?: React.ReactNode;
}

export function BookGrid({
  books,
  onOpen,
  onToggleFavorite,
  onSetStatus,
  onDelete,
  emptyTitle = 'No books here yet',
  emptyDescription = 'Try adjusting your search or filters, or add a new book.',
  emptyAction,
}: BookGridProps) {
  if (books.length === 0) {
    return (
      <EmptyState
        icon={BookText}
        title={emptyTitle}
        description={emptyDescription}
        action={emptyAction}
      />
    );
  }

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      <AnimatePresence mode="popLayout">
        {books.map((book) => (
          <BookCard
            key={book.id}
            book={book}
            onOpen={() => onOpen(book)}
            onToggleFavorite={() => onToggleFavorite(book.id)}
            onSetStatus={(status) => onSetStatus(book.id, status)}
            onDelete={() => onDelete(book.id)}
          />
        ))}
      </AnimatePresence>
    </div>
  );
}
