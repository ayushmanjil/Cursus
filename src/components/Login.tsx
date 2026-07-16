import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Library,
  Lock,
  User as UserIcon,
  Loader2,
  LogIn,
  UserPlus,
  Flame,
  BookOpen,
  Sparkles,
  Eye,
  EyeOff,
  Quote,
  Check,
  ArrowRight
} from 'lucide-react';
import { Button } from './ui/Button';
import { auth } from '../firebase';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';

interface LoginProps {
  onLoginSuccess: (user: { id: string; name: string; username: string }) => void;
}

const QUOTES = [
  { text: "I have always imagined that Paradise will be a kind of library.", author: "Jorge Luis Borges" },
  { text: "A room without books is like a body without a soul.", author: "Marcus Tullius Cicero" },
  { text: "Books are a uniquely portable magic.", author: "Stephen King" },
  { text: "There is no friend as loyal as a book.", author: "Ernest Hemingway" },
  { text: "Reading is escape, and the opposite of escape; it's a way to make contact with reality.", author: "Nora Ephron" }
];

export function Login({ onLoginSuccess }: LoginProps) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState(''); // Only used for Sign Up
  const [isSignUp, setIsSignUp] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [quoteIndex, setQuoteIndex] = useState(0);

  // Quote carousel timer
  useEffect(() => {
    const timer = setInterval(() => {
      setQuoteIndex((prev) => (prev + 1) % QUOTES.length);
    }, 7000);
    return () => clearInterval(timer);
  }, []);

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

  const handleDemoLogin = async () => {
    setLoading(true);
    setError('');
    const demoUsername = 'demo';
    const demoEmail = 'demo@cursus.app';
    const demoPassword = 'cursusdemo123';
    const demoName = 'Demo Reader';

    try {
      // Attempt Sign In
      const userCredential = await signInWithEmailAndPassword(auth, demoEmail, demoPassword);
      if (userCredential.user) {
        onLoginSuccess({
          id: userCredential.user.uid,
          name: userCredential.user.displayName || demoName,
          username: demoUsername,
        });
      }
    } catch (err: any) {
      // If user not found, register user dynamically
      if (err.code === 'auth/user-not-found' || err.code === 'auth/invalid-credential') {
        try {
          const userCredential = await createUserWithEmailAndPassword(auth, demoEmail, demoPassword);
          if (userCredential.user) {
            await updateProfile(userCredential.user, { displayName: demoName });
            onLoginSuccess({
              id: userCredential.user.uid,
              name: demoName,
              username: demoUsername,
            });
          }
        } catch (createErr: any) {
          console.error(createErr);
          setError('Could not access demo account. Please register manually.');
        }
      } else {
        console.error(err);
        setError('Failed to log in with Demo Account.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative flex min-h-screen w-full bg-[#15120E] text-[#FAF7F1] overflow-hidden font-sans">
      {/* Background Animated Gradient Blobs */}
      <motion.div
        animate={{
          x: [0, 40, -20, 0],
          y: [0, -30, 20, 0],
        }}
        transition={{
          duration: 15,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="absolute top-[-10%] left-[-10%] h-[50vh] w-[50vh] rounded-full bg-brass-500/10 blur-[120px] pointer-events-none"
      />
      <motion.div
        animate={{
          x: [0, -30, 30, 0],
          y: [0, 40, -40, 0],
        }}
        transition={{
          duration: 18,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="absolute bottom-[-10%] right-[-10%] h-[55vh] w-[55vh] rounded-full bg-forest-500/10 blur-[130px] pointer-events-none"
      />
      <div className="absolute top-[30%] right-[20%] h-96 w-96 rounded-full bg-purple-500/5 blur-[150px] pointer-events-none" />

      {/* LEFT PANEL - Beautiful Brand Showcase & Quote (Desktop only) */}
      <div className="hidden md:flex w-1/2 flex-col justify-between p-12 lg:p-16 bg-gradient-to-b from-[#1C1712] to-[#15120E] border-r border-[#FAF7F1]/5 relative overflow-hidden">
        {/* Glow behind layout */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(184,134,63,0.03),transparent_60%)] pointer-events-none" />

        {/* Logo/Brand Header */}
        <div className="flex items-center gap-2.5 z-10">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brass-500 text-bgdark shadow-lg shadow-brass-500/20">
            <Library size={20} className="stroke-[2.5]" />
          </div>
          <span className="font-display text-xl font-bold tracking-tight text-white">Cursus</span>
        </div>

        {/* Main Pitch */}
        <div className="my-auto space-y-12 z-10 max-w-xl">
          <div className="space-y-6">
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="font-display text-3xl lg:text-[40px] font-semibold leading-[1.2] text-[#FAF7F1]"
            >
              Your reading journey, <br />
              <span className="text-brass-400 italic font-serif">beautifully</span> documented.
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.1 }}
              className="text-sm lg:text-base text-[#FAF7F1]/60 leading-relaxed"
            >
              Keep your digital bookshelf organized, build long-lasting reading streaks, and capture notes as you flip the pages.
            </motion.p>
          </div>

          {/* Interactive Floating Mock UI Cards */}
          <div className="relative pt-6 h-56">
            {/* Card 1: Currently Reading */}
            <motion.div
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
              className="absolute left-0 top-0 w-72 bg-[#1E1A15]/80 border border-[#FAF7F1]/10 rounded-xl2 p-4 shadow-xl backdrop-blur-md"
            >
              <div className="flex gap-3">
                <div className="w-12 h-16 bg-gradient-to-br from-brass-600 to-brass-700 rounded shadow-md flex items-center justify-center text-[#FAF7F1]/30">
                  <BookOpen size={20} />
                </div>
                <div className="flex-1 min-w-0">
                  <span className="inline-block text-[10px] font-semibold text-brass-400 bg-brass-500/10 px-2 py-0.5 rounded-full mb-1">
                    READING
                  </span>
                  <h4 className="text-xs font-bold text-white truncate">The Shadow of the Wind</h4>
                  <p className="text-[10px] text-[#FAF7F1]/50 truncate">Carlos Ruiz Zafón</p>
                </div>
              </div>
              <div className="mt-4 space-y-1">
                <div className="flex justify-between text-[10px] font-medium text-[#FAF7F1]/60">
                  <span>Progress</span>
                  <span>68%</span>
                </div>
                <div className="w-full bg-[#FAF7F1]/10 rounded-full h-1.5 overflow-hidden">
                  <div className="bg-brass-500 h-full rounded-full" style={{ width: '68%' }} />
                </div>
              </div>
            </motion.div>

            {/* Card 2: Streak Tracker */}
            <motion.div
              animate={{ y: [0, -8, 0] }}
              transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 2.5 }}
              className="absolute right-4 bottom-2 w-64 bg-[#1E1A15]/80 border border-[#FAF7F1]/10 rounded-xl2 p-4 shadow-xl backdrop-blur-md"
            >
              <div className="flex items-center gap-3">
                <div className="h-9 w-9 rounded-lg bg-forest-500/20 text-forest-400 flex items-center justify-center">
                  <Flame size={20} className="text-brass-500 fill-brass-500/20 animate-pulse" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-white">Daily Streak</h4>
                  <p className="text-[10px] text-[#FAF7F1]/50">12 Days Active</p>
                </div>
              </div>
              <div className="flex justify-between gap-1.5 mt-3">
                {['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((day, idx) => (
                  <div key={idx} className="flex flex-col items-center gap-1">
                    <span className="text-[8px] font-bold text-[#FAF7F1]/40">{day}</span>
                    <div className={`h-4 w-4 rounded-full flex items-center justify-center text-[8px] ${idx < 5 ? 'bg-brass-500 text-bgdark font-bold' : 'bg-[#FAF7F1]/5 text-[#FAF7F1]/30'}`}>
                      {idx < 5 ? <Check size={8} className="stroke-[3]" /> : ''}
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>

        {/* Dynamic Literary Quote Slideshow */}
        <div className="min-h-[70px] border-t border-[#FAF7F1]/5 pt-6 z-10">
          <AnimatePresence mode="wait">
            <motion.div
              key={quoteIndex}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.6 }}
              className="space-y-1.5"
            >
              <div className="flex gap-2 text-brass-400">
                <Quote size={14} className="opacity-60 flex-shrink-0" />
                <p className="font-display text-xs lg:text-sm italic text-[#FAF7F1]/80 leading-relaxed font-serif">
                  {QUOTES[quoteIndex].text}
                </p>
              </div>
              <p className="text-[10px] font-semibold tracking-wider text-brass-400/70 pl-6 uppercase">
                — {QUOTES[quoteIndex].author}
              </p>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* RIGHT PANEL - Authentication Form */}
      <div className="w-full md:w-1/2 flex flex-col justify-center items-center p-6 md:p-12 lg:p-16 relative">
        {/* Mobile Header */}
        <div className="md:hidden absolute top-8 left-8 flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-brass-500 text-bgdark">
            <Library size={16} />
          </div>
          <span className="font-display text-lg font-bold text-white">Cursus</span>
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-[400px] space-y-8"
        >
          {/* Header */}
          <div className="text-center md:text-left space-y-2">
            <h2 className="font-display text-3xl font-bold tracking-tight text-white">
              {isSignUp ? 'Create your shelf' : 'Welcome back'}
            </h2>
            <p className="text-sm text-[#FAF7F1]/60">
              {isSignUp ? 'Enter your details to register a new account.' : 'Please sign in to sync and manage your reading collection.'}
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Display Name Input (Only on Sign Up) */}
            <AnimatePresence initial={false}>
              {isSignUp && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3 }}
                  className="overflow-hidden space-y-1.5"
                >
                  <label className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-[#FAF7F1]/40">
                    <UserIcon size={12} className="text-brass-400" />
                    Display Name
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    disabled={loading}
                    placeholder="e.g. Ayush Manjil"
                    className="w-full rounded-lg border border-[#FAF7F1]/10 bg-[#1C1712] px-3.5 py-2.5 text-sm text-[#FAF7F1] placeholder:text-[#FAF7F1]/20 focus:outline-none focus:ring-2 focus:ring-brass-500/50 focus:border-brass-400 transition-all duration-200"
                  />
                </motion.div>
              )}
            </AnimatePresence>

            {/* Username Input */}
            <div className="space-y-1.5">
              <label className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-[#FAF7F1]/40">
                <UserIcon size={12} className="text-brass-400" />
                Username
              </label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                disabled={loading}
                placeholder="username"
                className="w-full rounded-lg border border-[#FAF7F1]/10 bg-[#1C1712] px-3.5 py-2.5 text-sm text-[#FAF7F1] placeholder:text-[#FAF7F1]/20 focus:outline-none focus:ring-2 focus:ring-brass-500/50 focus:border-brass-400 transition-all duration-200"
              />
            </div>

            {/* Password Input */}
            <div className="space-y-1.5">
              <label className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-[#FAF7F1]/40">
                <Lock size={12} className="text-brass-400" />
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={loading}
                  placeholder="••••••••"
                  className="w-full rounded-lg border border-[#FAF7F1]/10 bg-[#1C1712] pl-3.5 pr-10 py-2.5 text-sm text-[#FAF7F1] placeholder:text-[#FAF7F1]/20 focus:outline-none focus:ring-2 focus:ring-brass-500/50 focus:border-brass-400 transition-all duration-200"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  disabled={loading}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#FAF7F1]/40 hover:text-white transition-colors"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {/* Error Message */}
            <AnimatePresence>
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -5 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="p-3 rounded-lg bg-burgundy-500/10 border border-burgundy-500/20 text-xs font-semibold text-burgundy-400 flex items-center gap-2"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-burgundy-500 animate-pulse" />
                  {error}
                </motion.div>
              )}
            </AnimatePresence>

            {/* Submit Button */}
            <Button
              type="submit"
              variant="primary"
              disabled={loading}
              className="w-full py-3 mt-4 text-xs font-bold uppercase tracking-widest bg-brass-500 text-bgdark hover:bg-brass-400 hover:shadow-lg hover:shadow-brass-500/15 duration-200"
            >
              {loading ? (
                <>
                  <Loader2 size={15} className="animate-spin mr-1.5" />
                  Processing...
                </>
              ) : (
                <>
                  {isSignUp ? <UserPlus size={15} className="mr-1.5" /> : <LogIn size={15} className="mr-1.5" />}
                  {isSignUp ? 'Register Account' : 'Sign In'}
                </>
              )}
            </Button>
          </form>

          {/* Toggle between Sign In and Sign Up (hidden for now) */}
          {/* <div className="text-center">
            <button
              type="button"
              onClick={() => {
                setIsSignUp(!isSignUp);
                setError('');
              }}
              disabled={loading}
              className="text-xs text-brass-400 hover:text-brass-300 transition-colors font-semibold focus:outline-none"
            >
              {isSignUp ? 'Already have an account? Sign In' : "Don't have an account? Sign Up"}
            </button>
          </div> */}

          {/* Guest / Demo Access Divider */}
          <div className="relative flex items-center justify-center my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-[#FAF7F1]/5" />
            </div>
            <span className="relative px-3 bg-[#15120E] text-[10px] font-bold tracking-widest text-[#FAF7F1]/30 uppercase">
              Or Explore Instantly
            </span>
          </div>

          {/* Quick Demo Access Button */}
          <button
            type="button"
            onClick={handleDemoLogin}
            disabled={loading}
            className="w-full inline-flex items-center justify-center gap-2 py-3 px-4 rounded-lg bg-[#FAF7F1]/5 hover:bg-[#FAF7F1]/10 border border-[#FAF7F1]/10 hover:border-[#FAF7F1]/20 font-semibold text-xs text-[#FAF7F1]/80 hover:text-white transition-all duration-200"
          >
            <Sparkles size={14} className="text-brass-400" />
            Sign in as Demo User
            <ArrowRight size={14} className="text-[#FAF7F1]/40 ml-0.5 transition-transform group-hover:translate-x-1" />
          </button>
        </motion.div>

        {/* Footer */}
        <footer className="absolute bottom-8 text-center text-[10px] text-[#FAF7F1]/30 tracking-wide font-medium">
          © Ayush Manjil |{' '}
          <a
            href="mailto:manjilayush@gmail.com"
            className="hover:text-brass-400 transition-colors underline decoration-dotted"
          >
            manjilayush@gmail.com
          </a>
        </footer>
      </div>
    </div>
  );
}

