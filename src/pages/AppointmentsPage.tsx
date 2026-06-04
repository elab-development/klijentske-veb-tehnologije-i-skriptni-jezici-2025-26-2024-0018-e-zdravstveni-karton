import { useState } from "react";
import { Link } from "react-router-dom";
import {
  Add,
  Calendar,
  CloseCircle,
  Clock,
  Money3,
  TickCircle,
} from "../components/icons";
import { AppShell } from "../components/AppShell";
import { Card } from "../components/Card";
import { Avatar } from "../components/Avatar";
import { StatusChip } from "../components/StatusChip";
import { Button } from "../components/Button";
import { SectionHeader } from "../components/SectionHeader";
import { EmptyState } from "../components/EmptyState";
import { useAppointments } from "../context/AppointmentsContext";
import { DOCTORS_SEED } from "../data/doctors";
import { initialsFromName, formatRsd, classNames } from "../utils/format";
import { formatLongDate } from "../utils/date";
import type { Appointment } from "../types";

type Tab = "upcoming" | "past" | "cancelled";

export function AppointmentsPage() {
  const { appointments, cancel } = useAppointments();
  const [tab, setTab] = useState<Tab>("upcoming");

  const now = Date.now();
  const upcoming = appointments.filter(
    (a) => a.status === "zakazan" && new Date(`${a.date}T${a.time}`).getTime() >= now,
  );
  const past = appointments.filter(
    (a) => a.status === "obavljen" ||
      (a.status === "zakazan" && new Date(`${a.date}T${a.time}`).getTime() < now),
  );
  const cancelled = appointments.filter((a) => a.status === "otkazan");

  const tabs: Array<{ key: Tab; label: string; count: number }> = [
    { key: "upcoming", label: "Predstojeći", count: upcoming.length },
    { key: "past", label: "Obavljeni", count: past.length },
    { key: "cancelled", label: "Otkazani", count: cancelled.length },
  ];

  const list = tab === "upcoming" ? upcoming : tab === "past" ? past : cancelled;

  return (
    <AppShell>
      <header className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-2xl font-extrabold text-ink sm:text-3xl">Moji termini</h1>
          <p className="text-sm text-ink-soft">Pregled, otkazivanje i istorija termina.</p>
        </div>
        <Link to="/lekari" className="btn-primary">
          <Add size="16" /> Zakaži pregled
        </Link>
      </header>

      <div className="mb-5 inline-flex rounded-xl border border-surface-border bg-white p-1 shadow-card">
        {tabs.map((t) => (
          <button
            key={t.key}
            type="button"
            onClick={() => setTab(t.key)}
            className={classNames(
              "rounded-lg px-3 py-1.5 text-xs font-semibold transition sm:px-4 sm:py-2 sm:text-sm",
              t.key === tab
                ? "bg-primary-600 text-white shadow-soft"
                : "text-ink-soft hover:bg-surface-subtle",
            )}
          >
            {t.label}
            <span className={classNames(
              "ml-1.5 rounded-full px-1.5 text-[10px] font-bold",
              t.key === tab ? "bg-white/20" : "bg-surface-alt text-ink-faint",
            )}>{t.count}</span>
          </button>
        ))}
      </div>

      {list.length === 0 ? (
        <EmptyState
          icon={<Calendar size="22" variant="Bulk" />}
          title={
            tab === "upcoming"
              ? "Nemate predstojećih termina"
              : tab === "past"
              ? "Nemate obavljenih termina"
              : "Nemate otkazanih termina"
          }
          description="Pretražite lekare i zakažite pregled."
          action={
            <Link to="/lekari" className="btn-primary">
              Pretraži lekare
            </Link>
          }
        />
      ) : (
        <SectionHeader title={tabs.find((t) => t.key === tab)?.label ?? ""} />
      )}

      <ul className="grid gap-3 sm:grid-cols-2">
        {list.map((apt) => (
          <li key={apt.id}>
            <AppointmentRow appointment={apt} onCancel={() => cancel(apt.id)} />
          </li>
        ))}
      </ul>
    </AppShell>
  );
}

function AppointmentRow({
  appointment,
  onCancel,
}: {
  appointment: Appointment;
  onCancel: () => void;
}) {
  const doctor = DOCTORS_SEED.find((d) => d.id === appointment.doctorId);
  const initials = doctor ? initialsFromName(doctor.firstName, doctor.lastName) : "DR";
  const status =
    appointment.status === "otkazan"
      ? { tone: "danger" as const, label: "Otkazan", icon: <CloseCircle size="12" /> }
      : appointment.status === "obavljen"
      ? { tone: "success" as const, label: "Obavljen", icon: <TickCircle size="12" /> }
      : { tone: "primary" as const, label: "Zakazan", icon: <Clock size="12" /> };

  return (
    <Card className="!p-4">
      <div className="flex items-center gap-3">
        <Avatar initials={initials} size="md" />
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-bold text-ink">{appointment.doctorName}</p>
          <p className="text-xs text-ink-soft">
            {appointment.specialty} · {appointment.type}
          </p>
        </div>
        <StatusChip tone={status.tone} icon={status.icon}>
          {status.label}
        </StatusChip>
      </div>
      <dl className="mt-4 grid grid-cols-3 gap-2 text-xs">
        <Row label="Datum" value={formatLongDate(new Date(appointment.date))} />
        <Row label="Vreme" value={`${appointment.time}`} />
        <Row label="Cena" value={formatRsd(appointment.price)} icon={<Money3 size="12" />} />
      </dl>
      {appointment.status === "zakazan" && (
        <div className="mt-4 flex justify-end gap-2">
          <Button variant="ghost" size="sm" leftIcon={<CloseCircle size="14" />} onClick={onCancel}>
            Otkaži termin
          </Button>
        </div>
      )}
    </Card>
  );
}

function Row({
  label,
  value,
  icon,
}: {
  label: string;
  value: string;
  icon?: React.ReactNode;
}) {
  return (
    <div className="min-w-0">
      <dt className="text-[10px] font-medium uppercase tracking-wide text-ink-faint">{label}</dt>
      <dd className="mt-0.5 inline-flex items-center gap-1 truncate text-xs font-semibold text-ink">
        {icon}
        {value}
      </dd>
    </div>
  );
}
