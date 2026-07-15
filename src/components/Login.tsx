import { useState } from 'react';
import { Library, Lock, User as UserIcon, Loader2, LogIn } from 'lucide-react';
import { Button } from './ui/Button';
import { useUsers } from '../hooks/useUsers';
import type { User } from '../types/user';

interface LoginProps {
  onLoginSuccess: (user: User) => void;
}

export function Login({ onLoginSuccess }: LoginProps) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { users } = useUsers();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!username.trim() || !password.trim()) {
      setError('Please fill in all fields.');
      return;
    }

    setLoading(true);

    // Simulate a brief premium loading animation for UX
    setTimeout(() => {
      const matchedUser = users.find(
        (u) =>
          u.username.trim().toLowerCase() === username.trim().toLowerCase() &&
          u.password === password
      );

      if (matchedUser) {
        onLoginSuccess(matchedUser);
      } else {
        setError('Invalid username or password. Please try again.');
        setLoading(false);
      }
    }, 700);
  };

  return (
    <div className="relative flex min-h-screen flex-col items-center justify-between bg-bgdark-soft py-10 px-4 dark:bg-bgdark">
      {/* Dynamic Background Blurs */}
      <div className="absolute top-1/4 left-1/4 h-72 w-72 rounded-full bg-brass-500/10 blur-3xl" />
      <div className="absolute bottom-1/4 right-1/4 h-72 w-72 rounded-full bg-forest-500/10 blur-3xl" />

      {/* Spacer to push card to center vertically */}
      <div className="flex-1 flex items-center justify-center w-full">
        <div className="relative w-full max-w-md overflow-hidden rounded-xl2 border border-ink/10 bg-surface/80 p-8 shadow-card backdrop-blur-md dark:border-paper/10 dark:bg-surface-dark/80">
          <div className="flex flex-col items-center text-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-brass-500 text-white shadow-md">
              <Library size={24} />
            </div>
            <h2 className="mt-4 font-display text-xl font-bold text-ink dark:text-paper">
              Cursus
            </h2>
            <p className="mt-1 text-xs text-ink-muted dark:text-paper/50">
              Enter your credentials to unlock your collection
            </p>
          </div>

          <form onSubmit={handleSubmit} className="mt-6 space-y-4">
            {/* Username input */}
            <div className="space-y-1.5">
              <label className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-ink-faint dark:text-paper/40">
                <UserIcon size={13} />
                Username
              </label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                disabled={loading}
                className="w-full rounded-lg border border-ink/10 bg-paper px-3 py-2 text-sm text-ink placeholder:text-ink-faint focus:outline-none focus:ring-2 focus:ring-brass-400 dark:border-paper/10 dark:bg-bgdark dark:text-paper disabled:opacity-50"
              />
            </div>

            {/* Password input */}
            <div className="space-y-1.5">
              <label className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-ink-faint dark:text-paper/40">
                <Lock size={13} />
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={loading}
                className="w-full rounded-lg border border-ink/10 bg-paper px-3 py-2 text-sm text-ink placeholder:text-ink-faint focus:outline-none focus:ring-2 focus:ring-brass-400 dark:border-paper/10 dark:bg-bgdark dark:text-paper disabled:opacity-50"
              />
            </div>

            {error && <p className="text-xs font-semibold text-burgundy-500">{error}</p>}

            <Button type="submit" variant="primary" disabled={loading} className="w-full mt-6 py-2.5">
              {loading ? (
                <>
                  <Loader2 size={16} className="animate-spin" />
                  Signing In...
                </>
              ) : (
                <>
                  <LogIn size={16} />
                  Sign In
                </>
              )}
            </Button>
          </form>
        </div>
      </div>

      {/* Footer at the bottom of the screen */}
      <footer className="mt-8 text-center text-xs text-ink-faint dark:text-paper/30 z-10">
        © Ayush Manjil | <a href="mailto:manjilayush@gmail.com" className="hover:text-brass-500 transition-colors">manjilayush@gmail.com</a>
      </footer>
    </div>
  );
}
