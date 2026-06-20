import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/reset-password")({
  head: () => ({
    meta: [{ title: "Reset Password — SVOJAS.CO" }],
  }),
  component: ResetPassword,
});

function ResetPassword() {
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    try {
      const { error } = await supabase.auth.updateUser({ password });
      if (error) throw error;
      toast.success("Password updated. You're signed in.");
      navigate({ to: "/my-orders" });
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Could not update password");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="mx-auto max-w-md px-6 py-16 lg:py-20">
      <p className="eyebrow">Account</p>
      <h1 className="mt-3 font-display text-3xl text-blush-soft sm:text-4xl">Set a new password</h1>
      <form onSubmit={handleSubmit} className="mt-8 space-y-5">
        <label className="block">
          <span className="block text-[10px] uppercase tracking-[0.24em] text-blush/60 mb-1.5">New password</span>
          <input
            type="password"
            required
            minLength={6}
            value={password}
            onChange={e => setPassword(e.target.value)}
            className="w-full bg-maroon-deep/60 border border-blush/30 px-4 py-2.5 text-sm text-blush-soft focus:border-blush focus:outline-none"
          />
        </label>
        <button disabled={submitting} className="btn-primary w-full disabled:opacity-60">
          {submitting ? "Updating..." : "Update Password"}
        </button>
      </form>
    </div>
  );
}