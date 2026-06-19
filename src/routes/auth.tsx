import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";

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
  const [mode, setMode] = useState<"login" | "register">("login");
  const [forgot, setForgot] = useState(false);
  const [sentReset, setSentReset] = useState(false);

  if (forgot) {
    return (
      <div className="mx-auto max-w-md px-6 py-16 lg:py-20">
        <p className="eyebrow">Account</p>
        <h1 className="mt-3 font-display text-3xl text-blush-soft sm:text-4xl">Reset your password</h1>
        <p className="mt-3 text-sm text-blush/70">
          Enter the email associated with your account and we'll send you a link to reset your password.
        </p>
        <form
          onSubmit={e => { e.preventDefault(); setSentReset(true); }}
          className="mt-8 space-y-5"
        >
          <Field label="Email Address" type="email" required />
          <button className="btn-primary w-full">Send Reset Link</button>
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

      <form onSubmit={e => e.preventDefault()} className="mt-8 space-y-5">
        <Field
          label={
            <>
              Username or Email Address <span className="text-gold">*</span>
            </>
          }
          type="text"
          required
        />
        <Field
          label={
            <>
              Password <span className="text-gold">*</span>
            </>
          }
          type="password"
          required
        />

        <button className="btn-primary w-full">
          {mode === "login" ? "Sign In" : "Create Account"}
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