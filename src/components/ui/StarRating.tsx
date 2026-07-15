import { useState } from 'react';
import { Star } from 'lucide-react';
import { classNames } from '../../utils/helpers';

interface StarRatingProps {
  value: number;
  onChange?: (value: number) => void;
  size?: number;
  readOnly?: boolean;
}

export function StarRating({ value, onChange, size = 16, readOnly = false }: StarRatingProps) {
  const [hover, setHover] = useState<number | null>(null);
  const display = hover ?? value;

  return (
    <div className="flex items-center gap-0.5" onMouseLeave={() => setHover(null)}>
      {[1, 2, 3, 4, 5].map((n) => (
        <button
          key={n}
          type="button"
          disabled={readOnly}
          aria-label={`${n} star${n > 1 ? 's' : ''}`}
          onMouseEnter={() => !readOnly && setHover(n)}
          onClick={() => !readOnly && onChange?.(n === value ? 0 : n)}
          className={classNames(
            readOnly ? 'cursor-default' : 'cursor-pointer',
            'transition-transform hover:scale-110'
          )}
        >
          <Star
            size={size}
            className={classNames(
              n <= display
                ? 'fill-brass-500 text-brass-500'
                : 'fill-transparent text-ink/20 dark:text-paper/25'
            )}
          />
        </button>
      ))}
    </div>
  );
}
