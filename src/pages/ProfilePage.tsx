import { useState } from "react";
import type { FormEvent } from "react";
import {
  Calendar,
  Drop,
  Edit2,
  HeartTick,
  Hospital,
  Location,
  LogoutCurve,
  Sms,
  TickCircle,
} from "../components/icons";
import { AppShell } from "../components/AppShell";
import { Card } from "../components/Card";
import { Avatar } from "../components/Avatar";
import { StatusChip } from "../components/StatusChip";
import { Button } from "../components/Button";
import { InputField } from "../components/InputField";
import { SelectField } from "../components/SelectField";
import { SectionHeader } from "../components/SectionHeader";
import { useAuth } from "../context/AuthContext";
import { usePatientProfile } from "../hooks/usePatientProfile";
import { calcBmi } from "../utils/format";
import { formatDateDot } from "../utils/date";

export function ProfilePage() {
  const { user, logout } = useAuth();
  const { profile, update } = usePatientProfile();
  const [editing, setEditing] = useState(false);

  if (!user || !profile) {
    return (
      <AppShell>
        <div className="py-20 text-center text-ink-soft">Učitavanje profila...</div>
      </AppShell>
    );
  }

  const bmi = calcBmi(profile.heightCm, profile.weightKg);

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    update({
      firstName: String(fd.get("firstName") ?? profile!.firstName),
      lastName: String(fd.get("lastName") ?? profile!.lastName),
      phone: String(fd.get("phone") ?? profile!.phone ?? ""),
      city: String(fd.get("city") ?? profile!.city ?? ""),
      dateOfBirth: String(fd.get("dateOfBirth") ?? profile!.dateOfBirth ?? ""),
      bloodType: String(fd.get("bloodType") ?? profile!.bloodType ?? ""),
      heightCm: Number(fd.get("heightCm") ?? profile!.heightCm ?? 0) || undefined,
      weightKg: Number(fd.get("weightKg") ?? profile!.weightKg ?? 0) || undefined,
      allergies: String(fd.get("allergies") ?? "")
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean),
      chronicConditions: String(fd.get("chronicConditions") ?? "")
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean),
    });
    setEditing(false);
  }

  return (
    <AppShell>
      <header className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary-600 to-primary-700 p-6 text-white sm:p-8">
        <div className="absolute -right-10 top-0 size-44 rounded-full bg-white/10" />
        <div className="relative flex flex-col items-center gap-4 sm:flex-row">
          <Avatar
            initials={user.initials()}
            size="xl"
            className="ring-4 ring-white/30"
            tone="neutral"
          />
          <div className="text-center sm:text-left">
            <h1 className="text-2xl font-extrabold sm:text-3xl">{user.fullName()}</h1>
            <p className="mt-1 text-sm text-primary-100">
              {user.roleLabel()} · ID: #{profile.cardId}
            </p>
            <div className="mt-3 flex flex-wrap justify-center gap-2 sm:justify-start">
              <StatusChip tone="success" icon={<TickCircle size="14" />}>
                Verifikovan
              </StatusChip>
              <StatusChip tone="neutral" className="bg-white/15 text-white" icon={<Drop size="14" />}>
                Krv: {profile.bloodType ?? "/"}
              </StatusChip>
              {bmi !== null && (
                <StatusChip tone="neutral" className="bg-white/15 text-white" icon={<HeartTick size="14" />}>
                  BMI: {bmi}
                </StatusChip>
              )}
            </div>
          </div>
        </div>
      </header>

      <div className="mt-6 grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <SectionHeader
            title="Lični podaci"
            description="Osnovne informacije o pacijentu"
            action={
              !editing ? (
                <Button variant="ghost" leftIcon={<Edit2 size="14" />} onClick={() => setEditing(true)}>
                  Izmeni
                </Button>
              ) : null
            }
          />

          {editing ? (
            <Card>
              <form onSubmit={handleSubmit} className="grid gap-4 sm:grid-cols-2">
                <InputField label="Ime" name="firstName" defaultValue={profile.firstName} required />
                <InputField label="Prezime" name="lastName" defaultValue={profile.lastName} required />
                <InputField label="Email" type="email" defaultValue={profile.email} disabled />
                <InputField label="Telefon" name="phone" defaultValue={profile.phone ?? ""} />
                <InputField
                  label="Datum rođenja"
                  type="date"
                  name="dateOfBirth"
                  defaultValue={profile.dateOfBirth ?? ""}
                />
                <InputField label="Grad" name="city" defaultValue={profile.city ?? ""} />
                <SelectField
                  label="Krvna grupa"
                  name="bloodType"
                  defaultValue={profile.bloodType ?? ""}
                  options={[
                    { value: "", label: "Nepoznato" },
                    { value: "A+", label: "A+" },
                    { value: "A-", label: "A-" },
                    { value: "B+", label: "B+" },
                    { value: "B-", label: "B-" },
                    { value: "AB+", label: "AB+" },
                    { value: "AB-", label: "AB-" },
                    { value: "0+", label: "0+" },
                    { value: "0-", label: "0-" },
                  ]}
                />
                <InputField
                  label="Visina (cm)"
                  type="number"
                  name="heightCm"
                  defaultValue={profile.heightCm ?? ""}
                />
                <InputField
                  label="Težina (kg)"
                  type="number"
                  name="weightKg"
                  defaultValue={profile.weightKg ?? ""}
                />
                <div className="sm:col-span-2">
                  <InputField
                    label="Alergije (odvojene zarezima)"
                    name="allergies"
                    defaultValue={(profile.allergies ?? []).join(", ")}
                    hint="Npr: Penicilin, Polen"
                  />
                </div>
                <div className="sm:col-span-2">
                  <InputField
                    label="Hronične bolesti (odvojene zarezima)"
                    name="chronicConditions"
                    defaultValue={(profile.chronicConditions ?? []).join(", ")}
                  />
                </div>
                <div className="flex justify-end gap-2 sm:col-span-2">
                  <Button variant="secondary" onClick={() => setEditing(false)} type="button">
                    Otkaži
                  </Button>
                  <Button type="submit">Sačuvaj izmene</Button>
                </div>
              </form>
            </Card>
          ) : (
            <Card>
              <dl className="grid grid-cols-2 gap-x-6 gap-y-4 sm:grid-cols-3">
                <Field label="Ime" value={profile.firstName} />
                <Field label="Prezime" value={profile.lastName} />
                <Field label="Email" value={profile.email} icon={<Sms size="14" />} />
                <Field label="Telefon" value={profile.phone ?? "/"} />
                <Field
                  label="Datum rođenja"
                  value={profile.dateOfBirth ? formatDateDot(profile.dateOfBirth) : "/"}
                  icon={<Calendar size="14" />}
                />
                <Field label="JMBG" value={profile.jmbg ?? "/"} />
                <Field
                  label="Grad"
                  value={profile.city ?? "/"}
                  icon={<Location size="14" />}
                />
                <Field label="Krvna grupa" value={profile.bloodType ?? "/"} />
                <Field label="BMI" value={bmi !== null ? String(bmi) : "/"} />
              </dl>
            </Card>
          )}

          <SectionHeader title="Zdravstveni podaci" className="mt-8" />
          <Card>
            <dl className="grid gap-4 sm:grid-cols-2">
              <Field
                label="Alergije"
                value={
                  profile.allergies && profile.allergies.length
                    ? profile.allergies.join(", ")
                    : "Nema evidentiranih"
                }
              />
              <Field
                label="Hronične bolesti"
                value={
                  profile.chronicConditions && profile.chronicConditions.length
                    ? profile.chronicConditions.join(", ")
                    : "Nema evidentiranih"
                }
              />
              <Field
                label="Matična ustanova"
                value="Dom zdravlja Vračar"
                icon={<Hospital size="14" />}
              />
              <Field label="Izabrani lekar" value="Dr. Ana Nikolić" />
            </dl>
          </Card>
        </div>

        <aside>
          <SectionHeader title="Sigurnost naloga" />
          <Card className="flex flex-col gap-4">
            <Item label="Email" value={profile.email} />
            <Item label="Tip naloga" value={user.roleLabel()} />
            <Item label="Aktivnih sesija" value="1" />
            <hr className="border-surface-border" />
            <Button variant="secondary" block leftIcon={<LogoutCurve size="16" />} onClick={logout}>
              Odjavi se
            </Button>
          </Card>
        </aside>
      </div>
    </AppShell>
  );
}

function Field({ label, value, icon }: { label: string; value: string; icon?: React.ReactNode }) {
  return (
    <div>
      <dt className="text-[11px] font-medium uppercase tracking-wide text-ink-faint">{label}</dt>
      <dd className="mt-1 flex items-center gap-2 text-sm font-semibold text-ink">
        {icon && <span className="text-ink-faint">{icon}</span>}
        {value}
      </dd>
    </div>
  );
}

function Item({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between text-sm">
      <span className="text-ink-soft">{label}</span>
      <span className="font-semibold text-ink">{value}</span>
    </div>
  );
}
