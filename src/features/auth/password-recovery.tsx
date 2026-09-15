import { useState, type FormEvent } from "react";
import { ArrowLeft, CheckCircle2, KeyRound, Loader2, Mail } from "lucide-react";

import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PasswordField } from "@/components/password-field";
import { ApiError } from "@/lib/api";
import { requestPasswordReset, resetPassword } from "@/lib/auth";

interface PasswordRecoveryProps {
  mode: "forgot" | "reset";
  uid?: string;
  token?: string;
  onBackToLogin: () => void;
}

function errorMessage(error: unknown) {
  if (error instanceof ApiError) return error.message;
  if (error instanceof Error) return error.message;
  return "Something went wrong. Please try again.";
}

export function PasswordRecovery({ mode, uid, token, onBackToLogin }: PasswordRecoveryProps) {
  const [email, setEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [resetLink, setResetLink] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isComplete, setIsComplete] = useState(false);

  async function handleForgotPassword(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setResetLink(null);
    setIsSubmitting(true);
    try {
      const response = await requestPasswordReset(email.trim());
      setMessage(response.detail);
      setResetLink(response.reset_link ?? null);
    } catch (requestError) {
      setError(errorMessage(requestError));
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleResetPassword(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);

    if (!uid || !token) {
      setError("This reset link is incomplete or invalid.");
      return;
    }
    if (newPassword !== confirmPassword) {
      setError("New password and confirm password do not match.");
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await resetPassword(uid, token, newPassword, confirmPassword);
      setMessage(response.detail);
      setIsComplete(true);
      window.history.replaceState({}, "", window.location.pathname);
    } catch (requestError) {
      setError(errorMessage(requestError));
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <main className="relative grid min-h-screen place-items-center overflow-hidden bg-slate-950 px-5 py-10">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_15%_15%,rgba(59,130,246,0.28),transparent_35%),radial-gradient(circle_at_85%_85%,rgba(99,102,241,0.22),transparent_40%)]" />
      <Card className="relative w-full max-w-md border-white/10 shadow-2xl shadow-black/30">
        <CardHeader className="space-y-3">
          <div className="grid size-11 place-items-center rounded-xl bg-primary text-primary-foreground">
            {isComplete ? <CheckCircle2 className="size-5" /> : mode === "forgot" ? <Mail className="size-5" /> : <KeyRound className="size-5" />}
          </div>
          <CardTitle className="text-2xl">
            {isComplete ? "Password updated" : mode === "forgot" ? "Forgot password?" : "Set a new password"}
          </CardTitle>
          <CardDescription className="text-sm leading-6">
            {isComplete
              ? "Your new password is ready. You can now sign in securely."
              : mode === "forgot"
                ? "Enter your registered email address to generate a secure reset link."
                : "Choose a strong password that you have not used before."}
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-5">
          {error && (
            <Alert className="border-red-200 bg-red-50 text-red-800">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {message && (
            <Alert className="border-emerald-200 bg-emerald-50 text-emerald-800">
              <AlertDescription>{message}</AlertDescription>
            </Alert>
          )}

          {isComplete ? (
            <Button className="w-full" onClick={onBackToLogin}>
              Continue to sign in
            </Button>
          ) : mode === "forgot" ? (
            <form className="space-y-5" onSubmit={handleForgotPassword}>
              <div className="space-y-2">
                <Label htmlFor="recovery-email">Email address</Label>
                <Input
                  id="recovery-email"
                  type="email"
                  autoComplete="email"
                  placeholder="name@zigmaatech.com"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  disabled={isSubmitting}
                  required
                  autoFocus
                />
              </div>
              <Button className="w-full" type="submit" disabled={isSubmitting}>
                {isSubmitting ? <Loader2 className="size-4 animate-spin" /> : <Mail className="size-4" />}
                {isSubmitting ? "Generating link..." : "Generate reset link"}
              </Button>
            </form>
          ) : (
            <form className="space-y-5" onSubmit={handleResetPassword}>
              <div className="space-y-2">
                <Label htmlFor="new-password">New password</Label>
                <PasswordField
                  id="new-password"
                  autoComplete="new-password"
                  placeholder="Enter a strong password"
                  value={newPassword}
                  onChange={(event) => setNewPassword(event.target.value)}
                  disabled={isSubmitting}
                  minLength={8}
                  required
                  autoFocus
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirm-password">Confirm password</Label>
                <PasswordField
                  id="confirm-password"
                  autoComplete="new-password"
                  placeholder="Re-enter the new password"
                  value={confirmPassword}
                  onChange={(event) => setConfirmPassword(event.target.value)}
                  disabled={isSubmitting}
                  minLength={8}
                  required
                />
              </div>
              <p className="text-xs leading-5 text-muted-foreground">
                Use at least 8 characters and avoid common or entirely numeric passwords.
              </p>
              <Button className="w-full" type="submit" disabled={isSubmitting}>
                {isSubmitting ? <Loader2 className="size-4 animate-spin" /> : <KeyRound className="size-4" />}
                {isSubmitting ? "Updating password..." : "Reset password"}
              </Button>
            </form>
          )}

          {resetLink && (
            <div className="rounded-lg border border-blue-200 bg-blue-50 p-4 text-sm text-blue-900">
              <p className="font-medium">Development reset link</p>
              <a className="mt-2 block break-all text-xs underline underline-offset-4" href={resetLink}>
                {resetLink}
              </a>
            </div>
          )}

          {!isComplete && (
            <Button className="w-full" type="button" variant="ghost" onClick={onBackToLogin}>
              <ArrowLeft className="size-4" />
              Back to sign in
            </Button>
          )}
        </CardContent>
      </Card>
    </main>
  );
}
