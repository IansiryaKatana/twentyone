import { useState } from "react";
import { useNavigate, useSearch } from "@tanstack/react-router";
import { Eye, EyeOff } from "lucide-react";
import { useAdminAuth } from "@/contexts/AdminAuthContext";
import {
  adminBtnPrimary,
  adminCard,
  adminInput,
  adminLabel,
  adminPageTitle,
} from "@/admin/adminClassNames";
import { BrandLogo } from "@/components/brand-logo";
import heroSilhouettes from "@/Assets/silhouettes-no-face.png";
import "@/admin/admin-theme.css";

export function AdminLogin() {
  const { signInWithPassword, configured } = useAdminAuth();
  const navigate = useNavigate();
  const search = useSearch({ strict: false }) as { from?: string };
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    setErr(null);
    const { error } = await signInWithPassword(email.trim(), password);
    setBusy(false);
    if (error) {
      setErr(error);
      return;
    }
    void navigate({ to: search.from ?? "/admin" });
  };

  return (
    <div className="admin-theme relative flex min-h-screen items-center justify-center overflow-hidden px-5 py-12">
      <div className="absolute inset-0" aria-hidden>
        <img
          src={heroSilhouettes}
          alt=""
          className="h-full w-full object-cover object-[center_35%]"
          fetchPriority="high"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/55 to-black/30" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/25 to-transparent" />
      </div>

      <div className={`${adminCard} relative z-10 w-full max-w-md shadow-xl`}>
        <BrandLogo surface="light" className="h-8 sm:h-9 md:h-10" />
        <h1 className={`${adminPageTitle} mt-5`}>Admin sign in</h1>
        <p className="mt-2 text-sm text-[var(--admin-muted)]">
          Manage site content, media, and inbound messages.
        </p>

        {!configured ? (
          <p className="mt-6 rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">
            Supabase is not configured. Add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY to
            your environment.
          </p>
        ) : (
          <form onSubmit={(e) => void onSubmit(e)} className="mt-8 space-y-4">
            <div>
              <label className={adminLabel} htmlFor="admin-email">
                Email
              </label>
              <input
                id="admin-email"
                type="email"
                autoComplete="username"
                required
                placeholder="you@twentyone06.com"
                className={adminInput}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div>
              <label className={adminLabel} htmlFor="admin-password">
                Password
              </label>
              <div className="relative">
                <input
                  id="admin-password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  required
                  placeholder="Enter your password"
                  className={`${adminInput} pr-11`}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <button
                  type="button"
                  className="absolute top-1/2 right-2.5 -translate-y-1/2 rounded-md p-1.5 text-[var(--admin-muted)] transition-colors hover:text-[var(--admin-ink)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--admin-primary)]/40"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  aria-pressed={showPassword}
                  onClick={() => setShowPassword((v) => !v)}
                >
                  {showPassword ? (
                    <EyeOff className="size-4" aria-hidden />
                  ) : (
                    <Eye className="size-4" aria-hidden />
                  )}
                </button>
              </div>
            </div>
            {err ? <p className="text-sm text-red-600">{err}</p> : null}
            <button type="submit" className={`${adminBtnPrimary} w-full`} disabled={busy}>
              {busy ? "Signing in…" : "Sign in"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
