import { useState } from 'react';
import { Link, useNavigate } from '@remix-run/react';
import { createSupabaseAuthClient } from '~/lib/supabase-auth.client';

export default function LoginRoute() {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const navigate = useNavigate();

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setIsSubmitting(true);
    setMessage('');

    const client = createSupabaseAuthClient();

    const { error } = await client.auth.signInWithOtp({
      email,
      options: { emailRedirectTo: `${window.location.origin}/profile` },
    });

    setIsSubmitting(false);

    if (error) {
      setMessage(error.message);
    } else {
      setIsSuccess(true);
      setMessage('Magic link sent! Check your email for a login link.');
    }
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-bolt-elements-background-depth-1 relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 w-full max-w-md mx-4">
        {/* Logo / Brand */}
        <div className="text-center mb-8">
          <button
            onClick={() => navigate('/')}
            className="inline-block hover:opacity-80 transition-opacity"
          >
            <img
              src="/logo-light-styled.png"
              alt="Bolt"
              className="w-[120px] inline-block dark:hidden"
            />
            <img
              src="/logo-dark-styled.png"
              alt="Bolt"
              className="w-[120px] inline-block hidden dark:block"
            />
          </button>
        </div>

        {/* Card */}
        <div className="bg-bolt-elements-background-depth-2 border border-bolt-elements-borderColor rounded-2xl p-8 shadow-xl backdrop-blur-sm">
          {/* Header */}
          <div className="text-center mb-6">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-bolt-elements-background-depth-1 border border-bolt-elements-borderColor mb-4">
              <div className="i-ph:login text-2xl text-bolt-elements-textPrimary" />
            </div>
            <h1 className="text-2xl font-bold text-bolt-elements-textPrimary">
              Welcome back
            </h1>
            <p className="text-sm text-bolt-elements-textSecondary mt-2">
              Sign in to your account to continue
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleLogin} className="space-y-5">
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-bolt-elements-textPrimary mb-2"
              >
                Email address
              </label>
              <input
                id="email"
                type="email"
                required
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-lg bg-bolt-elements-background-depth-1 border border-bolt-elements-borderColor px-4 py-2.5 text-sm text-bolt-elements-textPrimary placeholder-bolt-elements-textTertiary focus:outline-none focus:ring-2 focus:ring-bolt-elements-borderColorActive focus:border-transparent transition-all"
                placeholder="you@example.com"
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting || !email}
              className="w-full rounded-lg bg-gradient-to-r from-bolt-elements-borderColorActive to-purple-600 px-4 py-2.5 text-sm font-semibold text-white transition-all hover:opacity-90 hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isSubmitting ? (
                <>
                  <div className="i-svg-spinners:90-ring-with-bg text-lg animate-spin" />
                  Sending link...
                </>
              ) : (
                <>
                  <div className="i-ph:envelope-simple text-lg" />
                  Send magic link
                </>
              )}
            </button>
          </form>

          {/* Message */}
          {message && (
            <div
              className={`mt-5 p-3 rounded-lg border text-sm flex items-start gap-2 ${isSuccess
                ? 'bg-green-500/10 border-green-500/20 text-green-400'
                : 'bg-red-500/10 border-red-500/20 text-red-400'
                }`}
            >
              <div
                className={`w-5 h-5 flex-shrink-0 mt-0.5 ${isSuccess ? 'i-ph:check-circle' : 'i-ph:warning-circle'
                  }`}
              />
              {message}
            </div>
          )}

          {/* Divider */}
          <div className="mt-6 flex items-center gap-3">
            <div className="flex-1 h-px bg-bolt-elements-borderColor" />
            <span className="text-xs text-bolt-elements-textTertiary">or</span>
            <div className="flex-1 h-px bg-bolt-elements-borderColor" />
          </div>

          {/* Guest mode */}
          <button
            type="button"
            onClick={() => {
              localStorage.setItem('bolt_guest_mode', 'true');
              navigate('/profile');
            }}
            className="w-full mt-2 rounded-lg border border-bolt-elements-borderColor bg-bolt-elements-background-depth-1 px-4 py-2.5 text-sm font-medium text-bolt-elements-textSecondary hover:text-bolt-elements-textPrimary hover:border-bolt-elements-borderColorActive transition-all flex items-center justify-center gap-2"
          >
            <div className="i-ph:user-circle text-lg" />
            Continue as Guest
          </button>

          {/* Sign up link */}
          <p className="mt-6 text-center text-sm text-bolt-elements-textSecondary">
            Don&apos;t have an account?{' '}
            <Link
              to="/signup"
              className="text-bolt-elements-borderColorActive hover:text-purple-500 font-medium transition-colors"
            >
              Create one
            </Link>
          </p>
        </div>

        {/* Footer */}
        <p className="text-center text-xs text-bolt-elements-textTertiary mt-6">
          We&apos;ll send you a magic link to sign in securely.
        </p>
      </div>
    </div>
  );
}
