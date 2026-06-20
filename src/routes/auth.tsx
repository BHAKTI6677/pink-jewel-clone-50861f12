import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { lovable } from "@/integrations/lovable";

export const Route = createFileRoute("/auth")({
  head: () => ({
    meta: [
      { title: "Login or Register — SVOJAS.CO" },
      { name: "description", content: "Sign in to your SVOJAS.CO account or create a new one." },
    ],
  }),
  component: Auth,
});

function Auth() {
  const navigate = useNavigate();
  const [mode, setMode] = useState<"login" | "register">("login");
  const [forgot, setForgot] = useState(false);
  const [sentReset, setSentReset] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [resetEmail, setResetEmail] = useState("");

  // If already signed in, send to my orders
  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) navigate({ to: "/my-orders" });
    });
  }, [navigate]);

  async function handleAuth(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    try {
      if (mode === "register") {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: window.location.origin,
            data: { full_name: fullName },
          },
        });
        if (error) throw error;
        toast.success("Account created. You're signed in.");
        navigate({ to: "/my-orders" });
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        toast.success("Welcome back.");
        navigate({ to: "/my-orders" });
      }
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Authentication failed");
    } finally {
      setSubmitting(false);
    }
  }

  async function handleGoogle() {
    setSubmitting(true);
    try {
      const result = await lovable.auth.signInWithOAuth("google", {
        redirect_uri: window.location.origin + "/my-orders",
      });
      if (result.error) {
        toast.error(result.error.message ?? "Google sign-in failed");
        return;
      }
      if (result.redirected) return;
      navigate({ to: "/my-orders" });
    } finally {
      setSubmitting(false);
    }
  }

  async function handleReset(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(resetEmail, {
        redirectTo: window.location.origin + "/reset-password",
      });
      if (error) throw error;
      setSentReset(true);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Could not send reset email");
    } finally {
      setSubmitting(false);
    }
  }

  if (forgot) {
    return (
      <div className="mx-auto max-w-md px-6 py-16 lg:py-20">
        <p className="eyebrow">Account</p>
        <h1 className="mt-3 font-display text-3xl text-blush-soft sm:text-4xl">Reset your password</h1>
        <p className="mt-3 text-sm text-blush/70">
          Enter the email associated with your account and we'll send you a link to reset your password.
        </p>
        <form onSubmit={handleReset} className="mt-8 space-y-5">
          <Field label="Email Address" type="email" required value={resetEmail} onChange={e => setResetEmail(e.target.value)} />
          <button disabled={submitting} className="btn-primary w-full disabled:opacity-60">
            {submitting ? "Sending..." : "Send Reset Link"}
          </button>
          {sentReset && (
            <p className="text-xs text-gold">If an account exists, a reset link is on its way.</p>
          )}
          <button
            type="button"
            onClick={() => { setForgot(false); setSentReset(false); }}
            className="block w-full text-center text-[11px] uppercase tracking-[0.28em] text-blush/70 hover:text-blush"
          >
            ← Back to Login
          </button>
        </form>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-md px-6 py-16 lg:py-20">
      <p className="eyebrow">Account</p>
      <h1 className="mt-3 font-display text-3xl text-blush-soft sm:text-4xl">
        {mode === "login" ? "Sign in to SVOJAS.CO" : "Create your account"}
      </h1>

      <div className="mt-6 flex border border-blush/30">
        <button
          onClick={() => setMode("login")}
          className={`flex-1 py-2 text-[11px] uppercase tracking-[0.28em] transition ${
            mode === "login" ? "bg-blush text-maroon-deep" : "text-blush/70 hover:text-blush"
          }`}
        >
          Login
        </button>
        <button
          onClick={() => setMode("register")}
          className={`flex-1 py-2 text-[11px] uppercase tracking-[0.28em] transition ${
            mode === "register" ? "bg-blush text-maroon-deep" : "text-blush/70 hover:text-blush"
          }`}
        >
          Register
        </button>
      </div>

      <button
        type="button"
        onClick={handleGoogle}
        disabled={submitting}
        className="mt-8 flex w-full items-center justify-center gap-3 border border-blush/30 bg-blush/5 py-2.5 text-[11px] uppercase tracking-[0.28em] text-blush hover:bg-blush hover:text-maroon-deep transition disabled:opacity-60"
      >
        <svg viewBox="0 0 24 24" className="h-4 w-4" aria-hidden>
          <path fill="currentColor" d="M21.35 11.1H12v3.8h5.35c-.5 2.45-2.6 3.85-5.35 3.85a6 6 0 1 1 0-12 5.5 5.5 0 0 1 3.9 1.5l2.85-2.85A9.6 9.6 0 0 0 12 2a10 10 0 1 0 0 20c5.75 0 9.55-4 9.55-9.65 0-.65-.05-1.2-.2-1.25Z"/>
        </svg>
        Continue with Google
      </button>
      <div className="my-5 flex items-center gap-3 text-[10px] uppercase tracking-[0.28em] text-blush/40">
        <span className="h-px flex-1 bg-blush/20" />
        or
        <span className="h-px flex-1 bg-blush/20" />
      </div>

      <form onSubmit={handleAuth} className="space-y-5">
        {mode === "register" && (
          <Field
            label={<>Full Name <span className="text-gold">*</span></>}
            type="text"
            required
            value={fullName}
            onChange={e => setFullName(e.target.value)}
          />
        )}
        <Field
          label={<>Email Address <span className="text-gold">*</span></>}
          type="email"
          required
          value={email}
          onChange={e => setEmail(e.target.value)}
        />
        <Field
          label={<>Password <span className="text-gold">*</span></>}
          type="password"
          required
          minLength={6}
          value={password}
          onChange={e => setPassword(e.target.value)}
        />

        <button disabled={submitting} className="btn-primary w-full disabled:opacity-60">
          {submitting ? "Please wait..." : mode === "login" ? "Sign In" : "Create Account"}
        </button>

        {mode === "login" && (
          <button
            type="button"
            onClick={() => setForgot(true)}
            className="block w-full text-center text-xs text-blush/70 hover:text-blush underline underline-offset-4"
          >
            Forgot password?
          </button>
        )}

        <p className="pt-4 text-center text-xs text-blush/60">
          {mode === "login" ? "New here?" : "Already have an account?"}{" "}
          <button
            type="button"
            onClick={() => setMode(mode === "login" ? "register" : "login")}
            className="text-blush hover:underline underline-offset-4"
          >
            {mode === "login" ? "Create an account" : "Sign in"}
          </button>
        </p>
      </form>
    </div>
  );
}

function Field({
  label,
  ...props
}: React.InputHTMLAttributes<HTMLInputElement> & { label: React.ReactNode }) {
  return (
    <label className="block">
      <span className="block text-[10px] uppercase tracking-[0.24em] text-blush/60 mb-1.5">{label}</span>
      <input
        {...props}
        className="w-full bg-maroon-deep/60 border border-blush/30 px-4 py-2.5 text-sm text-blush-soft placeholder:text-blush/40 focus:border-blush focus:outline-none"
      />
    </label>
  );
}