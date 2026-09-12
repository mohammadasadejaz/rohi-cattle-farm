import { useEffect, useState } from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { Loader2, ShieldCheck } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";

const appUrl = import.meta.env.VITE_APP_URL || window.location.origin;

export const Route = createFileRoute("/admin/login")({
  ssr: false,
  head: () => ({
    meta: [
      { title: "Admin Login | Iqbal Cattle Farm (Rohi)" },
      { name: "description", content: "Private administrator sign-in for Iqbal Cattle Farm (Rohi)." },
      { name: "robots", content: "noindex, nofollow" },
      { property: "og:title", content: "Admin Login | Iqbal Cattle Farm (Rohi)" },
      { property: "og:description", content: "Private administrator sign-in." },
    ],
  }),
  component: AdminLogin,
});

function AdminLogin() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [resetPassword, setResetPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [resetting, setResetting] = useState(false);
  const [recoveryMode, setRecoveryMode] = useState(false);
  const [needsSetup, setNeedsSetup] = useState<boolean | null>(null);

  useEffect(() => {
    let active = true;
    const { data: authListener } = supabase.auth.onAuthStateChange((event) => {
      if (event === "PASSWORD_RECOVERY" && active) setRecoveryMode(true);
    });
    (async () => {
      const { data: userData } = await supabase.auth.getUser();
      if (window.location.hash.includes("type=recovery") && active) {
        setRecoveryMode(true);
        return;
      }
      if (userData.user && active) {
        navigate({ to: "/admin/dashboard", replace: true });
        return;
      }
      const { data } = await supabase.rpc("admin_exists");
      if (active) setNeedsSetup(data === false);
    })();
    return () => {
      active = false;
      authListener.subscription.unsubscribe();
    };
  }, [navigate]);

  async function handlePasswordReset() {
    if (!email.trim()) {
      toast.error("Enter your admin email first.");
      return;
    }
    setResetting(true);
    const { error } = await supabase.auth.resetPasswordForEmail(email.trim(), {
      redirectTo: `${appUrl}/admin/login`,
    });
    setResetting(false);
    if (error) {
      toast.error(error.message);
      return;
    }
    toast.success("Password reset email sent. Check your inbox.");
  }

  async function handleNewPassword(event: React.FormEvent) {
    event.preventDefault();
    if (resetPassword.length < 6) {
      toast.error("Password must be at least 6 characters.");
      return;
    }
    setResetting(true);
    const { error } = await supabase.auth.updateUser({ password: resetPassword });
    setResetting(false);
    if (error) {
      toast.error(error.message);
      return;
    }
    toast.success("Password updated. You can now sign in.");
    setRecoveryMode(false);
    setResetPassword("");
    await supabase.auth.signOut();
  }

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    if (!email.trim() || password.length < 6) {
      toast.error("Enter a valid email and a password of at least 6 characters.");
      return;
    }
    setLoading(true);
    try {
      if (needsSetup) {
        const { error } = await supabase.auth.signUp({
          email: email.trim(),
          password,
          options: { emailRedirectTo: `${appUrl}/admin/login` },
        });
        if (error) throw error;
        const { error: signInError } = await supabase.auth.signInWithPassword({
          email: email.trim(),
          password,
        });
        if (signInError) {
          toast.success("Admin account created. Please confirm your email, then sign in.");
          setNeedsSetup(false);
          return;
        }
        toast.success("Admin account created.");
        navigate({ to: "/admin/dashboard", replace: true });
        return;
      }

      const { error } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password,
      });
      if (error) throw error;
      navigate({ to: "/admin/dashboard", replace: true });
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Sign in failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="grid min-h-screen place-items-center bg-secondary/40 px-4">
      <div className="w-full max-w-sm rounded-lg border border-border bg-card p-8 shadow-[var(--shadow-soft)]">
        <div className="flex items-center gap-3">
          <span className="grid h-10 w-10 place-items-center rounded-full bg-primary text-primary-foreground">
            <ShieldCheck className="h-5 w-5" />
          </span>
          <div>
            <h1 className="font-display text-xl">Admin Access</h1>
            <p className="text-xs text-muted-foreground">Iqbal Cattle Farm (Rohi)</p>
          </div>
        </div>

        {needsSetup && (
          <p className="mt-5 rounded-md border border-accent/50 bg-accent/15 p-3 text-xs">
            No administrator exists yet. The first account you create here becomes the farm
            administrator.
          </p>
        )}

        {recoveryMode ? (
          <form onSubmit={handleNewPassword} className="mt-6 space-y-4">
            <div className="space-y-2">
              <Label htmlFor="reset-password">New password</Label>
              <Input
                id="reset-password"
                type="password"
                autoComplete="new-password"
                value={resetPassword}
                onChange={(event) => setResetPassword(event.target.value)}
                minLength={6}
                required
              />
            </div>
            <Button type="submit" className="w-full" disabled={resetting}>
              {resetting && <Loader2 className="animate-spin" />}
              Update Password
            </Button>
          </form>
        ) : (
          <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              autoComplete="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              autoComplete={needsSetup ? "new-password" : "current-password"}
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              required
            />
          </div>
          <Button type="submit" className="w-full" disabled={loading}>
            {loading && <Loader2 className="animate-spin" />}
            {needsSetup ? "Create Admin Account" : "Sign In"}
          </Button>
            {!needsSetup && (
              <button
                type="button"
                className="w-full text-center text-xs text-muted-foreground hover:underline"
                onClick={handlePasswordReset}
                disabled={resetting}
              >
                {resetting ? "Sending reset email..." : "Forgot password?"}
              </button>
            )}
          </form>
        )}

        <a href="/" className="mt-6 block text-center text-xs text-muted-foreground hover:underline">
          ← Back to website
        </a>
      </div>
    </div>
  );
}
