import { useState } from 'react';
import { Modal } from './ui/Modal';
import { Button } from './ui/Button';
import { StarRating } from './ui/StarRating';

interface RatingPromptModalProps {
  open: boolean;
  bookTitle: string;
  onSubmit: (rating: number) => void;
  onSkip: () => void;
}

export function RatingPromptModal({ open, bookTitle, onSubmit, onSkip }: RatingPromptModalProps) {
  const [rating, setRating] = useState(0);

  return (
    <Modal open={open} onClose={onSkip} title="Finished the book?" maxWidth="max-w-sm">
      <p className="text-sm text-ink-muted dark:text-paper/70">
        Nice work finishing <span className="font-medium text-ink dark:text-paper">{bookTitle}</span>.
        How would you rate it?
      </p>
      <div className="mt-4 flex justify-center py-2">
        <StarRating value={rating} onChange={setRating} size={28} />
      </div>
      <div className="mt-4 flex justify-end gap-2">
        <Button variant="secondary" onClick={onSkip}>
          Skip
        </Button>
        <Button
          variant="primary"
          onClick={() => onSubmit(rating)}
          disabled={rating === 0}
        >
          Save rating
        </Button>
      </div>
    </Modal>
  );
}
