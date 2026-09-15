import { useEffect, useState, type FormEvent } from "react";
import { GoogleLogin, type CredentialResponse } from "@react-oauth/google";
import {
  CheckCircle2,
  Loader2,
  LockKeyhole,
  ShieldCheck,
} from "lucide-react";


import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { PasswordField } from "@/components/password-field";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { PasswordRecovery } from "@/features/auth/password-recovery";
import { SuperAdminDashboard } from "@/features/dashboard/super-admin-dashboard";
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

  async function handlePasswordLogin(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
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
    <main className="min-h-screen bg-slate-950 lg:grid lg:grid-cols-[1.05fr_0.95fr]">
      <section className="relative hidden overflow-hidden border-r border-white/10 p-12 text-white lg:flex lg:flex-col lg:justify-between">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_15%,rgba(59,130,246,0.32),transparent_35%),radial-gradient(circle_at_80%_80%,rgba(99,102,241,0.25),transparent_38%)]" />
        <div className="relative flex items-center gap-3 text-2xl font-bold tracking-tight text-white">
          <img
            src="/zigmaa-logo.webp"
            alt="Zigmaa Tech Logo"
            className="size-11 rounded-xl object-cover shadow-lg shadow-red-600/30 border border-white/20"
          />
          Zigmaa Tech
        </div>


        <div className="relative max-w-xl">
          <p className="mb-5 text-sm font-semibold uppercase tracking-[0.3em] text-blue-300">
            One workspace. Every team.
          </p>
          <h1 className="text-5xl font-semibold leading-tight tracking-tight">
            Workflows built around the way your team works.
          </h1>
          <p className="mt-6 max-w-lg text-lg leading-8 text-slate-300">
            Manage people, projects, approvals, and daily operations from a secure role-based CRM.
          </p>
        </div>

        <div className="relative flex items-center gap-3 text-sm text-slate-300">
          <ShieldCheck className="size-5 text-blue-300" />
          Secure access for Super Admin, HR, Team Leaders, and Employees
        </div>
      </section>

      <section className="flex min-h-screen items-center justify-center bg-background px-5 py-10 sm:px-8">
        <Card className="w-full max-w-md border-slate-200/80 shadow-2xl shadow-slate-300/30">
          <CardHeader className="space-y-3 pb-5">
            <div className="mb-2 flex items-center gap-3 lg:hidden">
              <img
                src="/zigmaa-logo.webp"
                alt="Zigmaa Tech Logo"
                className="size-10 rounded-xl object-cover shadow-sm border border-slate-200"
              />
              <span className="text-xl font-bold text-slate-900">Zigmaa Tech</span>
            </div>

            <CardTitle className="text-3xl">Sign in</CardTitle>
            <CardDescription className="text-base">
              Enter your work credentials to access Zigmaa CRM.
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-6">
            {error && (
              <Alert className="border-red-200 bg-red-50 text-red-800">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <form className="space-y-5" onSubmit={handlePasswordLogin}>
              <div className="space-y-2">
                <Label htmlFor="email">Email address</Label>
                <Input
                  id="email"
                  type="email"
                  autoComplete="email"
                  placeholder="name@zigmaatech.com"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  disabled={isSubmitting}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <PasswordField
                  id="password"
                  autoComplete="current-password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  disabled={isSubmitting}
                  minLength={8}
                  required
                />
                <div className="flex justify-end">
                  <button
                    className="text-sm font-medium text-primary underline-offset-4 hover:underline"
                    type="button"
                    onClick={() => {
                      setScreen("forgot");
                      setError(null);
                    }}
                  >
                    Forgot password?
                  </button>
                </div>
              </div>

              <Button className="h-11 w-full" type="submit" disabled={isSubmitting}>
                {isSubmitting ? <Loader2 className="size-4 animate-spin" /> : <LockKeyhole className="size-4" />}
                {isSubmitting ? "Signing in..." : "Sign in"}
              </Button>
            </form>

            <div className="flex items-center gap-3">
              <Separator className="flex-1" />
              <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">or</span>
              <Separator className="flex-1" />
            </div>

            <div className="flex min-h-11 justify-center overflow-hidden">
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
                <Button className="w-full" type="button" variant="outline" disabled>
                  Google Sign-In needs a client ID
                </Button>
              )}
            </div>

            <p className="text-center text-xs leading-5 text-muted-foreground">
              By signing in, you agree to follow Zigmaa Tech&apos;s security and acceptable-use policies.
            </p>
          </CardContent>
        </Card>
      </section>
    </main>
  );
}
