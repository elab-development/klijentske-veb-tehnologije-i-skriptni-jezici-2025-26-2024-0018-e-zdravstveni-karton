import { useState } from "react";
import type { FormEvent } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Eye, EyeSlash, Lock, Sms } from "../components/icons";
import { AuthLayout } from "../components/AuthLayout";
import { Button } from "../components/Button";
import { InputField } from "../components/InputField";
import { useAuth } from "../context/AuthContext";

interface LocationState {
  from?: { pathname: string };
}

export function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();
  const from = (location.state as LocationState | null)?.from?.pathname ?? "/";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [show, setShow] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      await login(email, password);
      navigate(from, { replace: true });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Greška pri prijavi.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <AuthLayout
      heroTitle="Vaše zdravlje, uvek pri ruci."
      heroSubtitle="Sigurni elektronski zdravstveni kartoni, brzo zakazivanje pregleda i pristup nalazima u jednoj aplikaciji."
    >
      <h2 className="text-2xl font-extrabold text-ink sm:text-3xl">Dobrodošli nazad</h2>
      <p className="mt-1.5 text-sm text-ink-soft">Prijavite se na vaš nalog</p>

      <form onSubmit={handleSubmit} className="mt-8 grid gap-4" noValidate>
        <InputField
          label="Email adresa"
          type="email"
          placeholder="ime@primer.com"
          leftIcon={<Sms size="16" />}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          autoComplete="email"
          required
        />
        <InputField
          label="Lozinka"
          type={show ? "text" : "password"}
          placeholder="••••••••"
          leftIcon={<Lock size="16" />}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          autoComplete="current-password"
          required
          rightSlot={
            <button
              type="button"
              onClick={() => setShow((s) => !s)}
              className="inline-flex size-9 items-center justify-center rounded-lg text-ink-faint transition hover:text-ink-muted"
              aria-label={show ? "Sakrij lozinku" : "Prikaži lozinku"}
            >
              {show ? <EyeSlash size="18" /> : <Eye size="18" />}
            </button>
          }
        />

        <div className="-mt-1 flex items-center justify-between text-xs">
          <label className="inline-flex items-center gap-2 text-ink-soft">
            <input type="checkbox" className="size-4 rounded border-surface-border accent-primary-600" />
            Zapamti me
          </label>
          <Link to="/zaboravljena-lozinka" className="font-semibold text-primary-600 hover:text-primary-700">
            Zaboravili ste lozinku?
          </Link>
        </div>

        {error && (
          <div role="alert" className="rounded-xl border border-danger-500/20 bg-danger-50 px-4 py-2.5 text-xs font-medium text-danger-700">
            {error}
          </div>
        )}

        <Button type="submit" size="lg" block loading={loading}>
          Prijavi se
        </Button>

        <div className="relative my-2 flex items-center text-xs text-ink-faint">
          <span className="h-px flex-1 bg-surface-border" />
          <span className="px-3">ili</span>
          <span className="h-px flex-1 bg-surface-border" />
        </div>

        <Button type="button" variant="secondary" size="lg" block onClick={() => setError("Demo aplikacija, koristite email/lozinka prijavu.")}>
          <GoogleMark /> Nastavi sa Google nalogom
        </Button>

        <p className="mt-2 text-center text-sm text-ink-soft">
          Nemate nalog?{" "}
          <Link to="/registracija" className="font-semibold text-primary-600 hover:text-primary-700">
            Registrujte se
          </Link>
        </p>
      </form>
    </AuthLayout>
  );
}

function GoogleMark() {
  return (
    <svg width="16" height="16" viewBox="0 0 48 48" aria-hidden>
      <path fill="#FFC107" d="M43.6 20.5h-1.6V20H24v8h11.3c-1.6 4.7-6.1 8-11.3 8a12 12 0 1 1 7.9-21l5.7-5.7A20 20 0 1 0 44 24c0-1.2-.1-2.4-.4-3.5z" />
      <path fill="#FF3D00" d="M6.3 14.7l6.6 4.8A12 12 0 0 1 24 12c3 0 5.8 1.1 7.9 3l5.7-5.7A20 20 0 0 0 6.3 14.7z" />
      <path fill="#4CAF50" d="M24 44c5.2 0 9.9-2 13.4-5.2l-6.2-5.2A12 12 0 0 1 12.7 28L6.1 33A20 20 0 0 0 24 44z" />
      <path fill="#1976D2" d="M43.6 20.5H42V20H24v8h11.3a12 12 0 0 1-4.1 5.6l6.2 5.2C40 35.5 44 30.3 44 24c0-1.2-.1-2.4-.4-3.5z" />
    </svg>
  );
}
