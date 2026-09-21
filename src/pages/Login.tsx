import { useState, FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { GoogleLogin, type CredentialResponse } from '@react-oauth/google';
import { useAuth } from '@/context/auth-context';
import { LockKeyhole, Loader2 } from 'lucide-react';
import { PasswordField } from '@/components/password-field';

export default function Login() {
  const { login, loginWithGoogle } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Please enter your email and password.');
      return;
    }
    setError(null);
    setIsSubmitting(true);
    const result = await login(email, password);
    setIsSubmitting(false);
    if (result.success) {
      navigate('/dashboard');
    } else {
      setError(result.error || 'Failed to login');
    }
  };

  const handleGoogleSuccess = async (response: CredentialResponse) => {
    if (!response.credential) {
      setError('Google did not return a valid credential.');
      return;
    }
    setError(null);
    setIsSubmitting(true);
    const result = await loginWithGoogle(response.credential);
    setIsSubmitting(false);
    if (result.success) {
      navigate('/dashboard');
    } else {
      setError(result.error || 'Google sign-in failed');
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center relative overflow-hidden"
      style={{
        backgroundImage: `url('/login-bg.webp')`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      <div className="absolute inset-0 bg-slate-900/60" />

      <div className="relative z-10 w-full px-4" style={{ maxWidth: 460 }}>
        <div className="bg-white/96 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/20 p-8 md:p-10">
          <div className="flex flex-col items-center mb-7">
            <img
              src="/zigmaa-logo.webp"
              alt="Zigmaa Tech"
              className="w-16 h-16 rounded-xl object-cover mb-3 shadow-md border border-white/10"
            />
            <h1 className="text-xl font-bold text-slate-900">Sign in</h1>
            <p className="text-sm text-slate-500 mt-1 text-center">
              Enter your work credentials to access Zigmaa CRM.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3 rounded-xl">
                {error}
              </div>
            )}

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Email address
              </label>
              <input
                type="text"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@zigmaatech.com"
                disabled={isSubmitting}
                className="w-full h-12 px-4 rounded-xl border border-slate-200 bg-slate-50 text-slate-900 text-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#ED0016] focus:border-transparent transition-all"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Password
              </label>
              <PasswordField
                id="password"
                autoComplete="current-password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={isSubmitting}
                minLength={8}
                required
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full h-12 bg-[#ED0016] hover:bg-[#B80012] disabled:opacity-70 text-white font-semibold rounded-xl flex items-center justify-center gap-2 transition-colors text-sm shadow-md"
            >
              {isSubmitting ? (
                <>
                  <Loader2 size={16} className="animate-spin" /> Signing in...
                </>
              ) : (
                <>
                  <LockKeyhole size={16} /> Sign in
                </>
              )}
            </button>
          </form>

          <div className="flex items-center gap-3 my-5">
            <div className="flex-1 h-px bg-slate-200" />
            <span className="text-xs text-slate-400 uppercase font-medium">or continue with</span>
            <div className="flex-1 h-px bg-slate-200" />
          </div>

          <div className="flex justify-center min-h-[44px]">
            <GoogleLogin
              onSuccess={handleGoogleSuccess}
              onError={() => setError('Google sign-in was cancelled or encountered an error.')}
              theme="outline"
              size="large"
              shape="pill"
              text="signin_with"
              width="360"
            />
          </div>

        </div>
      </div>
    </div>
  );
}
