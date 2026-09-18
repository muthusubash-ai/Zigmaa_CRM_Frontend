import { useEffect, useState, type FormEvent } from "react";
import { GoogleLogin, type CredentialResponse } from "@react-oauth/google";
import {
  CheckCircle2,
  Loader2,
  LockKeyhole,
} from "lucide-react";



import { Button } from "@/components/ui/button";
import { PasswordField } from "@/components/password-field";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { PasswordRecovery } from "@/features/auth/password-recovery";
import { SuperAdminDashboard } from "@/features/pages/super-admin-dashboard";
import { ApiError } from "@/lib/api";
import {
  loginWithGoogle,
  loginWithPassword,
  getCurrentUser,
  logout,
  type AuthUser,
} from "@/lib/auth";

interface LoginPageProps {
  googleEnabled: boolean;
}

function readableError(error: unknown) {
  if (error instanceof ApiError) return error.message;
  if (error instanceof Error) return error.message;
  return "Unable to sign in. Please try again.";
}

export function LoginPage({ googleEnabled }: LoginPageProps) {
  const resetParams = new URLSearchParams(window.location.search);
  const resetUid = resetParams.get("uid") ?? undefined;
  const resetToken = resetParams.get("token") ?? undefined;
  const [screen, setScreen] = useState<"login" | "forgot" | "reset">(
    resetParams.get("view") === "reset-password" ? "reset" : "login",
  );
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isRestoringSession, setIsRestoringSession] = useState(screen === "login");
  const [error, setError] = useState<string | null>(null);
  const [user, setUser] = useState<AuthUser | null>(null);

  useEffect(() => {
    if (screen !== "login") return;

    let active = true;
    getCurrentUser()
      .then((currentUser) => {
        if (active) setUser(currentUser);
      })
      .catch(() => {
        // A missing or expired session should simply show the login form.
      })
      .finally(() => {
        if (active) setIsRestoringSession(false);
      });

    return () => {
      active = false;
    };
  }, [screen]);

  function validateInputs() {
    if (!email.trim() || !password) return "Please enter your email and password.";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) return "Please enter a valid email address.";
    return "";
  }

  async function handlePasswordLogin(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const validationError = validateInputs();
    if (validationError) {
      setError(validationError);
      return;
    }
    setError(null);
    setIsSubmitting(true);
    try {
      setUser(await loginWithPassword(email.trim(), password));
    } catch (requestError) {
      setError(readableError(requestError));
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleGoogleLogin(response: CredentialResponse) {
    if (!response.credential) {
      setError("Google did not return a valid credential.");
      return;
    }

    setError(null);
    setIsSubmitting(true);
    try {
      setUser(await loginWithGoogle(response.credential));
    } catch (requestError) {
      setError(readableError(requestError));
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleLogout() {
    setIsSubmitting(true);
    try {
      await logout();
      setUser(null);
      setPassword("");
    } catch (requestError) {
      setError(readableError(requestError));
    } finally {
      setIsSubmitting(false);
    }
  }

  function showLogin() {
    window.history.replaceState({}, "", window.location.pathname);
    setScreen("login");
    setError(null);
  }

  if (screen !== "login") {
    return (
      <PasswordRecovery
        mode={screen}
        uid={resetUid}
        token={resetToken}
        onBackToLogin={showLogin}
      />
    );
  }

  if (isRestoringSession) {
    return (
      <main className="grid min-h-screen place-items-center bg-slate-950 text-white">
        <div className="flex items-center gap-3 text-sm text-slate-300">
          <Loader2 className="size-5 animate-spin text-blue-400" />
          Restoring your workspace...
        </div>
      </main>
    );
  }

  if (user?.role === "Super Admin") {
    return (
      <SuperAdminDashboard
        user={user}
        isSigningOut={isSubmitting}
        onLogout={handleLogout}
      />
    );
  }

  if (user) {
    return (
      <main className="grid min-h-screen place-items-center bg-background px-6 py-12">
        <Card className="w-full max-w-md border-slate-200/80 shadow-xl shadow-slate-200/50">
          <CardHeader className="items-center text-center">
            <div className="mb-3 grid size-14 place-items-center rounded-full bg-emerald-100 text-emerald-700">
              <CheckCircle2 className="size-7" />
            </div>
            <CardTitle>Welcome, {user.full_name}</CardTitle>
            <CardDescription>You are signed in as {user.role}.</CardDescription>
          </CardHeader>
          <CardContent>
            <Button className="w-full" variant="outline" onClick={handleLogout} disabled={isSubmitting}>
              {isSubmitting && <Loader2 className="size-4 animate-spin" />}
              Sign out
            </Button>
          </CardContent>
        </Card>
      </main>
    );
  }

  return (
    <div
      className="min-h-screen flex items-center justify-center relative overflow-hidden"
      style={{
        backgroundImage: `url('/login-bg.webp')`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      {/* Dark Overlay */}
      <div className="absolute inset-0 bg-slate-900/60" />

      {/* Card Container */}
      <div className="relative z-10 w-full px-4" style={{ maxWidth: 460 }}>
        <div className="bg-white/96 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/20 p-8 md:p-10">
          {/* Logo & Header */}
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

          <form onSubmit={handlePasswordLogin} className="space-y-4">
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
              <div className="flex justify-end mt-1.5">
                <button
                  type="button"
                  onClick={() => {
                    setScreen("forgot");
                    setError(null);
                  }}
                  className="text-xs text-[#ED0016] hover:underline font-medium"
                >
                  Forgot password?
                </button>
              </div>
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

            <div className="flex items-center gap-3 my-1">
              <div className="flex-1 h-px bg-slate-200" />
              <span className="text-xs text-slate-400">OR</span>
              <div className="flex-1 h-px bg-slate-200" />
            </div>

            <div className="flex min-h-12 justify-center overflow-hidden">
              {googleEnabled ? (
                <GoogleLogin
                  onSuccess={handleGoogleLogin}
                  onError={() => setError("Google sign-in was not completed.")}
                  theme="outline"
                  size="large"
                  shape="rectangular"
                  text="signin_with"
                  width="360"
                />
              ) : (
                <button
                  type="button"
                  disabled
                  className="w-full h-12 border border-slate-200 bg-white text-slate-400 font-medium rounded-xl flex items-center justify-center gap-2.5 text-sm cursor-not-allowed"
                >
                  Google Sign-In needs a client ID
                </button>
              )}
            </div>
          </form>

          <p className="text-xs text-slate-400 text-center mt-5 leading-relaxed">
            By signing in, you agree to follow Zigmaa Tech&apos;s<br />
            security and acceptable-use policies.
          </p>

          <p className="text-xs text-center text-slate-400 mt-3">
            Demo: <span className="font-mono text-slate-600">admin@zigmaatech.com</span> / <span className="font-mono text-slate-600">AdminPassword123!</span>
          </p>
        </div>
      </div>
    </div>
  );
}

