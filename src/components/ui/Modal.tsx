import { useEffect } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';

interface ModalProps {
  open: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  maxWidth?: string;
  hideHeader?: boolean;
  hideCloseButton?: boolean;
}

export function Modal({
  open,
  onClose,
  title,
  children,
  maxWidth = 'max-w-lg',
  hideHeader = false,
  hideCloseButton = false,
}: ModalProps) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [open, onClose]);

  return createPortal(
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.15 }}
        >
          <motion.div
            className="absolute inset-0 bg-ink/40 backdrop-blur-sm"
            onClick={onClose}
          />
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label={title || 'Dialog'}
            className={`relative w-full ${maxWidth} max-h-[85vh] overflow-y-auto scrollbar-thin rounded-xl2 bg-surface dark:bg-surface-dark shadow-modal`}
            initial={{ opacity: 0, y: 16, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.98 }}
            transition={{ duration: 0.18, ease: 'easeOut' }}
          >
            {!hideHeader && title ? (
              <div className="sticky top-0 z-10 flex items-center justify-between border-b bg-surface/95 dark:bg-surface-dark/95 backdrop-blur px-6 py-4">
                <h2 className="font-display text-lg font-medium text-ink dark:text-paper">
                  {title}
                </h2>
                {!hideCloseButton && (
                  <button
                    onClick={onClose}
                    aria-label="Close"
                    className="rounded-full p-1.5 text-ink-muted hover:bg-ink/5 hover:text-ink dark:text-paper/60 dark:hover:bg-paper/10 dark:hover:text-paper transition-colors"
                  >
                    <X size={18} />
                  </button>
                )}
              </div>
            ) : (
              !hideCloseButton && (
                <button
                  onClick={onClose}
                  aria-label="Close"
                  className="absolute right-4 top-4 z-20 rounded-full p-1.5 text-ink-muted hover:bg-ink/10 hover:text-ink dark:text-paper/60 dark:hover:bg-paper/10 dark:hover:text-paper transition-colors"
                >
                  <X size={18} />
                </button>
              )
            )}
            <div className={hideHeader ? 'p-6' : 'px-6 py-5'}>{children}</div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body
  );
}
