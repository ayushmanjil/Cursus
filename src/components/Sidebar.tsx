import {
  LayoutGrid,
  BookMarked,
  BookOpen,
  CheckCircle2,
  Heart,
  Library,
  Sun,
  Moon,
  ShoppingBag,
  Flame,
  LogOut,
  X,
  BookA,
  Timer,
} from 'lucide-react';
import type { ViewKey } from '../types/book';
import { classNames } from '../utils/helpers';
import { AVATARS } from '../data/avatars';

interface NavItem {
  key: ViewKey;
  label: string;
  icon: React.ElementType;
  count?: number;
}

interface SidebarProps {
  active: ViewKey;
  onSelect: (v: ViewKey) => void;
  counts: Record<ViewKey, number>;
  theme: 'light' | 'dark';
  onToggleTheme: () => void;
  mobileOpen: boolean;
  onCloseMobile: () => void;
  onLogout?: () => void;
  userName?: string;
  userAvatarId?: string;
  hasPendingBadge?: boolean;
}

export function Sidebar({
  active,
  onSelect,
  counts,
  theme,
  onToggleTheme,
  mobileOpen,
  onCloseMobile,
  onLogout,
  userName,
  userAvatarId,
  hasPendingBadge,
}: SidebarProps) {
  const primaryItems: NavItem[] = [
    { key: 'dashboard', label: 'Dashboard', icon: LayoutGrid },
  ];
  const shelfItems: NavItem[] = [
    { key: 'on-shelf', label: 'On Shelf', icon: BookMarked, count: counts['on-shelf'] },
    { key: 'wishlist', label: 'The Hunt List', icon: ShoppingBag, count: counts['wishlist'] },
    { key: 'reading', label: 'Reading', icon: BookOpen, count: counts['reading'] },
    { key: 'read', label: 'Read', icon: CheckCircle2, count: counts['read'] },
  ];
  const otherItems: NavItem[] = [
    { key: 'streaks', label: 'Reading Streaks', icon: Flame },
    { key: 'favorites', label: 'Favorites', icon: Heart, count: counts['favorites'] },
    { key: 'word-library', label: 'Word Library', icon: BookA },
    { key: 'timer', label: 'The Reading Nook', icon: Timer },
  ];

  const renderItem = (item: NavItem) => {
    const ActiveIcon = item.icon;
    const isActive = active === item.key;
    return (
      <button
        key={item.key}
        onClick={() => {
          onSelect(item.key);
          onCloseMobile();
        }}
        className={classNames(
          'group flex w-full items-center justify-between rounded-lg px-3 py-2 text-sm transition-colors',
          isActive
            ? 'bg-ink text-paper dark:bg-brass-500/90 dark:text-bgdark font-medium'
            : 'text-ink-muted hover:bg-ink/5 hover:text-ink dark:text-paper/60 dark:hover:bg-paper/10 dark:hover:text-paper'
        )}
      >
        <span className="flex items-center gap-2.5">
          <ActiveIcon size={16} strokeWidth={isActive ? 2.4 : 2} />
          {item.label}
        </span>
        {typeof item.count === 'number' && (
          <span
            className={classNames(
              'rounded-full px-1.5 py-0.5 text-[11px] tabular-nums',
              isActive
                ? 'bg-paper/20 text-paper dark:bg-bgdark/20 dark:text-bgdark'
                : 'bg-ink/5 text-ink-faint dark:bg-paper/10 dark:text-paper/50'
            )}
          >
            {item.count}
          </span>
        )}
      </button>
    );
  };

  return (
    <>
      {mobileOpen && (
        <div
          className="fixed inset-0 z-30 bg-ink/30 backdrop-blur-sm lg:hidden"
          onClick={onCloseMobile}
        />
      )}
      <aside
        className={classNames(
          'fixed inset-y-0 left-0 z-40 flex w-64 flex-col border-r border-ink/10 bg-paper-soft/80 backdrop-blur-sm px-3 py-4 dark:border-paper/10 dark:bg-bgdark-soft transition-transform lg:sticky lg:top-0 lg:h-screen lg:translate-x-0',
          mobileOpen ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        <div className="mb-6 flex items-center justify-between px-2">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-ink text-paper dark:bg-brass-500 dark:text-bgdark">
              <Library size={17} />
            </div>
            <span className="font-display text-[17px] font-semibold text-ink dark:text-paper">
              Cursus
            </span>
          </div>
          <button
            onClick={onCloseMobile}
            className="rounded-md p-1 text-ink-muted hover:bg-ink/5 lg:hidden dark:text-paper/60"
          >
            <X size={18} />
          </button>
        </div>

        <nav className="flex-1 space-y-5">
          <div className="space-y-1">{primaryItems.map(renderItem)}</div>
          <div>
            <p className="px-3 pb-1.5 text-[11px] font-semibold uppercase tracking-wider text-ink-faint dark:text-paper/40">
              Shelves
            </p>
            <div className="space-y-1">{shelfItems.map(renderItem)}</div>
          </div>
          <div>
            <p className="px-3 pb-1.5 text-[11px] font-semibold uppercase tracking-wider text-ink-faint dark:text-paper/40">
              More
            </p>
            <div className="space-y-1">{otherItems.map(renderItem)}</div>
          </div>
        </nav>

        <div className="mt-4 flex flex-col gap-1 border-t border-ink/5 pt-3 dark:border-paper/5">
          <button
            onClick={onToggleTheme}
            className="flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm text-ink-muted hover:bg-ink/5 hover:text-ink dark:text-paper/60 dark:hover:bg-paper/10 dark:hover:text-paper transition-colors"
          >
            {theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
            {theme === 'dark' ? 'Light mode' : 'Dark mode'}
          </button>

          {onLogout && (
            <div className="flex items-center justify-between rounded-lg px-3 py-2">
              <button
                onClick={() => {
                  onSelect('profile');
                  onCloseMobile();
                }}
                className={classNames(
                  'flex flex-1 items-center gap-2.5 min-w-0 text-left rounded-lg p-1 transition-colors hover:bg-ink/5 dark:hover:bg-paper/10 mr-1.5 focus:outline-none focus:ring-1 focus:ring-brass-400 relative',
                  active === 'profile' && 'bg-ink/5 dark:bg-paper/10'
                )}
                title="View Profile"
              >
                <div className="relative flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-ink/10 text-xs font-semibold text-ink dark:bg-brass-500/20 dark:text-brass-400 overflow-hidden">
                  {(() => {
                    const avatar = AVATARS.find((a) => a.id === userAvatarId);
                    return avatar ? (
                      <img src={avatar.src} alt={avatar.label} className="w-full h-full object-cover rounded-full" />
                    ) : (
                      userName ? userName.charAt(0).toUpperCase() : 'U'
                    );
                  })()}
                  {hasPendingBadge && (
                    <span className="absolute -top-0.5 -right-0.5 flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-purple-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-purple-500"></span>
                    </span>
                  )}
                </div>
                <span className="truncate text-sm font-medium text-ink dark:text-paper" title={userName}>
                  {userName || 'User'}
                </span>
              </button>
              <button
                onClick={onLogout}
                className="group/btn flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-ink-muted hover:bg-burgundy-500/10 hover:text-burgundy-500 transition-colors"
                title="Sign Out"
                aria-label="Sign Out"
              >
                <LogOut size={16} className="transition-transform group-hover/btn:translate-x-0.5" />
              </button>
            </div>
          )}
        </div>
      </aside>
    </>
  );
}
