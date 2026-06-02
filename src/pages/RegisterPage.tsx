import { useState } from "react";
import type { FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Eye, EyeSlash, Lock, Sms, User as UserIcon } from "../components/icons";
import { AuthLayout } from "../components/AuthLayout";
import { Button } from "../components/Button";
import { InputField } from "../components/InputField";
import { SelectField } from "../components/SelectField";
import { useAuth } from "../context/AuthContext";
import type { UserRole } from "../types";

export function RegisterPage() {
  const navigate = useNavigate();
  const { register } = useAuth();

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<UserRole>("patient");
  const [agreed, setAgreed] = useState(false);
  const [show, setShow] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);

    if (!agreed) {
      setError("Morate prihvatiti uslove korišćenja.");
      return;
    }

    setLoading(true);
    try {
      await register({ firstName, lastName, email, password, role });
      navigate("/", { replace: true });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Greška pri registraciji.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <AuthLayout
      heroTitle="Kreirajte vaš MedKarton nalog."
      heroSubtitle="Pridružite se hiljadama pacijenata i lekara koji koriste MedKarton za brz pristup zdravstvenim informacijama."
    >
      <h2 className="text-2xl font-extrabold text-ink sm:text-3xl">Kreirajte nalog</h2>
      <p className="mt-1.5 text-sm text-ink-soft">Popunite podatke za registraciju</p>

      <form onSubmit={handleSubmit} className="mt-8 grid gap-4" noValidate>
        <div className="grid gap-4 sm:grid-cols-2">
          <InputField
            label="Ime"
            placeholder="Vaše ime"
            leftIcon={<UserIcon size="16" />}
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            required
            autoComplete="given-name"
          />
          <InputField
            label="Prezime"
            placeholder="Vaše prezime"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            required
            autoComplete="family-name"
          />
        </div>

        <InputField
          label="Email adresa"
          type="email"
          placeholder="ime@primer.com"
          leftIcon={<Sms size="16" />}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          autoComplete="email"
        />

        <SelectField
          label="Tip korisnika"
          value={role}
          onChange={(e) => setRole(e.target.value as UserRole)}
          options={[
            { value: "patient", label: "Pacijent" },
            { value: "doctor", label: "Lekar" },
            { value: "staff", label: "Medicinski radnik" },
          ]}
        />

        <InputField
          label="Lozinka"
          type={show ? "text" : "password"}
          placeholder="Najmanje 6 karaktera"
          leftIcon={<Lock size="16" />}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          autoComplete="new-password"
          hint="Koristite barem 6 karaktera, kombinaciju slova i brojeva."
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

        <label className="flex items-start gap-2.5 text-xs text-ink-soft">
          <input
            type="checkbox"
            checked={agreed}
            onChange={(e) => setAgreed(e.target.checked)}
            className="mt-0.5 size-4 rounded border-surface-border accent-primary-600"
          />
          Slažem se sa{" "}
          <Link to="/uslovi" className="font-semibold text-primary-600">
            uslovima korišćenja
          </Link>{" "}
          i politikom privatnosti.
        </label>

        {error && (
          <div role="alert" className="rounded-xl border border-danger-500/20 bg-danger-50 px-4 py-2.5 text-xs font-medium text-danger-700">
            {error}
          </div>
        )}

        <Button type="submit" size="lg" block loading={loading}>
          Registruj se
        </Button>

        <p className="mt-2 text-center text-sm text-ink-soft">
          Već imate nalog?{" "}
          <Link to="/prijava" className="font-semibold text-primary-600 hover:text-primary-700">
            Prijavite se
          </Link>
        </p>
      </form>
    </AuthLayout>
  );
}
