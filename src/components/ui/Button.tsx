import { classNames } from '../../utils/helpers';

type Variant = 'primary' | 'secondary' | 'ghost' | 'danger';
type Size = 'sm' | 'md';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
}

const variantClasses: Record<Variant, string> = {
  primary:
    'bg-ink text-paper hover:bg-ink/90 dark:bg-brass-500 dark:text-bgdark dark:hover:bg-brass-400 shadow-sm',
  secondary:
    'bg-paper-soft text-ink border border-ink/10 hover:bg-ink/5 dark:bg-surface-dark dark:text-paper dark:border-paper/10 dark:hover:bg-paper/5',
  ghost:
    'bg-transparent text-ink-muted hover:bg-ink/5 hover:text-ink dark:text-paper/70 dark:hover:bg-paper/10 dark:hover:text-paper',
  danger:
    'bg-burgundy-500 text-white hover:bg-burgundy-600',
};

const sizeClasses: Record<Size, string> = {
  sm: 'text-xs px-3 py-1.5 gap-1.5',
  md: 'text-sm px-4 py-2 gap-2',
};

export function Button({
  variant = 'secondary',
  size = 'md',
  className,
  children,
  ...props
}: ButtonProps) {
  return (
    <button
      className={classNames(
        'inline-flex items-center justify-center rounded-lg font-medium transition-colors duration-150 disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus-visible:ring-2 focus-visible:ring-brass-400 focus-visible:ring-offset-2 focus-visible:ring-offset-paper dark:focus-visible:ring-offset-bgdark',
        variantClasses[variant],
        sizeClasses[size],
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
}
