import { Link } from "react-router-dom";
import {
  Add,
  Calendar,
  CalendarTick,
  DocumentText1,
  Health,
  Hospital,
  Profile,
} from "../components/icons";
import { AppShell } from "../components/AppShell";
import { Card } from "../components/Card";
import { SectionHeader } from "../components/SectionHeader";
import { Avatar } from "../components/Avatar";
import { StatusChip } from "../components/StatusChip";
import { useAuth } from "../context/AuthContext";
import { useAppointments } from "../context/AppointmentsContext";
import { greetingByHour, formatLongDate, formatShortDate } from "../utils/date";
import { RECORDS_SEED } from "../data/records";
import { DOCTORS_SEED } from "../data/doctors";
import { initialsFromName } from "../utils/format";
import { recordStatusTone } from "../utils/status";
import { EmptyState } from "../components/EmptyState";

export function HomePage() {
  const { user } = useAuth();
  const { upcoming } = useAppointments();
  const greeting = greetingByHour();
  const today = new Date();

  const stats = [
    {
      label: "Predstojeći termini",
      value: upcoming.length,
      icon: Calendar,
      tone: "primary" as const,
    },
    {
      label: "Ukupno nalaza",
      value: RECORDS_SEED.length,
      icon: DocumentText1,
      tone: "success" as const,
    },
    {
      label: "Aktivne terapije",
      value: 2,
      icon: Health,
      tone: "warning" as const,
    },
    {
      label: "Vaši lekari",
      value: 4,
      icon: Hospital,
      tone: "primary" as const,
    },
  ];

  return (
    <AppShell>
      <section className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary-600 via-primary-600 to-primary-700 p-6 text-white sm:p-8">
        <div className="absolute -right-8 -top-8 size-40 rounded-full bg-white/10" />
        <div className="absolute bottom-0 left-1/2 size-56 -translate-x-1/2 translate-y-1/3 rounded-full bg-white/10" />
        <p className="relative text-xs font-medium text-primary-100">{formatLongDate(today)}</p>
        <h1 className="relative mt-2 text-2xl font-extrabold leading-tight sm:text-3xl">
          {greeting}, {user?.firstName ?? "korisniče"}!
        </h1>
        <p className="relative mt-1.5 text-sm text-primary-100">
          {upcoming.length > 0
            ? `Imate ${upcoming.length} zakazana ${upcoming.length === 1 ? "pregled" : "pregleda"}.`
            : "Trenutno nemate zakazanih termina."}
        </p>

        <div className="relative mt-6 flex flex-wrap gap-2">
          <Link
            to="/lekari"
            className="inline-flex items-center gap-2 rounded-xl bg-white px-4 py-2.5 text-sm font-semibold text-primary-700 shadow-soft transition hover:bg-primary-50"
          >
            <CalendarTick size="16" variant="Bulk" /> Zakaži pregled
          </Link>
          <Link
            to="/nalazi"
            className="inline-flex items-center gap-2 rounded-xl bg-white/15 px-4 py-2.5 text-sm font-semibold text-white backdrop-blur transition hover:bg-white/25"
          >
            <DocumentText1 size="16" variant="Bulk" /> Pregledaj nalaze
          </Link>
        </div>
      </section>

      <section className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.label} className="!p-4">
            <div className="flex items-center justify-between">
              <span className={`inline-flex size-9 items-center justify-center rounded-xl ${toneBg(stat.tone)}`}>
                <stat.icon size="18" variant="Bulk" />
              </span>
            </div>
            <p className="mt-3 text-2xl font-extrabold text-ink">{stat.value}</p>
            <p className="text-xs text-ink-soft">{stat.label}</p>
          </Card>
        ))}
      </section>

      <section className="mt-8 grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <SectionHeader
            title="Predstojeći termini"
            description="Vaši zakazani pregledi"
            actionLabel="Svi"
            actionTo="/zakazivanja"
          />
          {upcoming.length === 0 ? (
            <EmptyState
              icon={<Calendar size="22" variant="Bulk" />}
              title="Nemate zakazanih termina"
              description="Pretražite lekare i zakažite pregled u par klikova."
              action={
                <Link to="/lekari" className="btn-primary">
                  <Add size="16" /> Zakaži pregled
                </Link>
              }
            />
          ) : (
            <ul className="flex flex-col gap-3">
              {upcoming.slice(0, 4).map((apt) => {
                const doctor = DOCTORS_SEED.find((d) => d.id === apt.doctorId);
                const inits = doctor
                  ? initialsFromName(doctor.firstName, doctor.lastName)
                  : "DR";
                return (
                  <li key={apt.id}>
                    <Card className="!p-4">
                      <div className="flex items-center gap-3">
                        <Avatar initials={inits} size="md" />
                        <div className="min-w-0 flex-1">
                          <p className="truncate text-sm font-bold text-ink">{apt.doctorName}</p>
                          <p className="text-xs text-ink-soft">
                            {apt.specialty} · {apt.type}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-bold text-ink">{formatShortDate(apt.date)}</p>
                          <p className="text-xs text-ink-soft">{apt.time}</p>
                        </div>
                      </div>
                    </Card>
                  </li>
                );
              })}
            </ul>
          )}
        </div>

        <div>
          <SectionHeader title="Brze akcije" description="Najčešće korišćene funkcije" />
          <div className="grid grid-cols-2 gap-3">
            <QuickAction to="/lekari" label="Zakaži pregled" icon={<CalendarTick size="22" variant="Bulk" />} tone="primary" />
            <QuickAction to="/nalazi" label="Dodaj nalaz" icon={<Add size="22" variant="Bulk" />} tone="success" />
            <QuickAction to="/profil" label="Moj profil" icon={<Profile size="22" variant="Bulk" />} tone="primary" />
            <QuickAction to="/lekari" label="Pretraži lekare" icon={<Hospital size="22" variant="Bulk" />} tone="success" />
          </div>

          <div className="mt-6">
            <SectionHeader title="Poslednji nalazi" actionLabel="Svi" actionTo="/nalazi" />
            <ul className="flex flex-col gap-3">
              {RECORDS_SEED.slice(0, 3).map((rec) => (
                <li key={rec.id}>
                  <Card className="!p-3">
                    <div className="flex items-center gap-3">
                      <span className="inline-flex size-9 items-center justify-center rounded-xl bg-primary-50 text-primary-700">
                        <DocumentText1 size="18" variant="Bulk" />
                      </span>
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-semibold text-ink">{rec.title}</p>
                        <p className="text-xs text-ink-soft">{rec.doctorName}</p>
                      </div>
                      <StatusChip tone={recordStatusTone(rec.status)}>{rec.status}</StatusChip>
                    </div>
                  </Card>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>
    </AppShell>
  );
}

function QuickAction({
  to,
  label,
  icon,
  tone,
}: {
  to: string;
  label: string;
  icon: React.ReactNode;
  tone: "primary" | "success";
}) {
  const toneStyles =
    tone === "primary"
      ? "bg-primary-50 text-primary-700"
      : "bg-success-50 text-success-700";
  return (
    <Link
      to={to}
      className="group rounded-2xl border border-surface-border/70 bg-white p-4 shadow-card transition hover:-translate-y-0.5 hover:shadow-soft"
    >
      <span className={`inline-flex size-10 items-center justify-center rounded-xl ${toneStyles}`}>
        {icon}
      </span>
      <p className="mt-3 text-sm font-semibold text-ink">{label}</p>
    </Link>
  );
}

function toneBg(tone: "primary" | "success" | "warning") {
  if (tone === "success") return "bg-success-50 text-success-700";
  if (tone === "warning") return "bg-warning-50 text-warning-700";
  return "bg-primary-50 text-primary-700";
}
