import { useState } from 'react';
import { Library, Lock, User as UserIcon, Loader2, LogIn, UserPlus } from 'lucide-react';
import { Button } from './ui/Button';
import { auth } from '../firebase';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';

interface LoginProps {
  onLoginSuccess: (user: { id: string; name: string; username: string }) => void;
}

export function Login({ onLoginSuccess }: LoginProps) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState(''); // Only used for Sign Up
  const [isSignUp, setIsSignUp] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const trimmedUsername = username.trim().toLowerCase();
    const trimmedPassword = password;
    const trimmedName = name.trim();

    if (!trimmedUsername || !trimmedPassword || (isSignUp && !trimmedName)) {
      setError('Please fill in all fields.');
      return;
    }

    setLoading(true);
    const virtualEmail = `${trimmedUsername}@cursus.app`;

    try {
      if (isSignUp) {
        // Create user in Firebase Authentication
        const userCredential = await createUserWithEmailAndPassword(auth, virtualEmail, trimmedPassword);
        // Set display name
        if (userCredential.user) {
          await updateProfile(userCredential.user, { displayName: trimmedName });
          onLoginSuccess({
            id: userCredential.user.uid,
            name: trimmedName,
            username: trimmedUsername,
          });
        }
      } else {
        // Sign in via Firebase Authentication
        const userCredential = await signInWithEmailAndPassword(auth, virtualEmail, trimmedPassword);
        if (userCredential.user) {
          onLoginSuccess({
            id: userCredential.user.uid,
            name: userCredential.user.displayName || username,
            username: trimmedUsername,
          });
        }
      }
    } catch (err: any) {
      console.error(err);
      if (err.code === 'auth/wrong-password' || err.code === 'auth/user-not-found' || err.code === 'auth/invalid-credential') {
        setError('Invalid username or password. Please try again.');
      } else if (err.code === 'auth/email-already-in-use') {
        setError('Username is already taken. Please choose another one.');
      } else if (err.code === 'auth/weak-password') {
        setError('Password should be at least 6 characters.');
      } else {
        setError('An error occurred. Please try again.');
      }
    } finally {
      setLoading(false);
    }
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
              {isSignUp ? 'Create a new account to sync your books' : 'Enter your credentials to unlock your collection'}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="mt-6 space-y-4">
            {/* Display Name Input (Only on Sign Up) */}
            {isSignUp && (
              <div className="space-y-1.5">
                <label className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-ink-faint dark:text-paper/40">
                  <UserIcon size={13} />
                  Display Name
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  disabled={loading}
                  placeholder="e.g. Ayush Manjil"
                  className="w-full rounded-lg border border-ink/10 bg-paper px-3 py-2 text-sm text-ink placeholder:text-ink-faint focus:outline-none focus:ring-2 focus:ring-brass-400 dark:border-paper/10 dark:bg-bgdark dark:text-paper disabled:opacity-50"
                />
              </div>
            )}

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
                placeholder="e.g. ayushmanjil"
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
                  {isSignUp ? 'Signing Up...' : 'Signing In...'}
                </>
              ) : (
                <>
                  {isSignUp ? <UserPlus size={16} /> : <LogIn size={16} />}
                  {isSignUp ? 'Sign Up' : 'Sign In'}
                </>
              )}
            </Button>
          </form>

          {/* Toggle between Sign In and Sign Up */}
          <div className="mt-4 text-center">
            <button
              onClick={() => {
                setIsSignUp(!isSignUp);
                setError('');
              }}
              disabled={loading}
              className="text-xs text-brass-600 hover:underline dark:text-brass-400 font-semibold"
            >
              {isSignUp ? 'Already have an account? Sign In' : "Don't have an account? Sign Up"}
            </button>
          </div>
        </div>
      </div>

      {/* Footer at the bottom of the screen */}
      <footer className="mt-8 text-center text-xs text-ink-faint dark:text-paper/30 z-10">
        © Ayush Manjil | <a href="mailto:manjilayush@gmail.com" className="hover:text-brass-500 transition-colors">manjilayush@gmail.com</a>
      </footer>
    </div>
  );
}
