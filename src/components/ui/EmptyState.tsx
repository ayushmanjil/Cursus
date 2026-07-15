import type { LucideIcon } from 'lucide-react';

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description: string;
  action?: React.ReactNode;
}

export function EmptyState({ icon: Icon, title, description, action }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center rounded-xl2 border border-dashed border-ink/15 dark:border-paper/15 px-6 py-16 text-center">
      <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-brass-50 text-brass-500 dark:bg-brass-500/10">
        <Icon size={22} />
      </div>
      <h3 className="font-display text-lg font-medium text-ink dark:text-paper">{title}</h3>
      <p className="mt-1.5 max-w-sm text-sm text-ink-muted dark:text-paper/60">{description}</p>
      {action && <div className="mt-5">{action}</div>}
    </div>
  );
}
