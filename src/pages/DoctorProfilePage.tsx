import { Link, useNavigate, useParams } from "react-router-dom";
import {
  ArrowLeft2,
  CalendarTick,
  Clock,
  Hospital,
  Location,
  Message,
  Money3,
  Star1,
  TickCircle,
} from "../components/icons";
import { AppShell } from "../components/AppShell";
import { Avatar } from "../components/Avatar";
import { Card } from "../components/Card";
import { Button } from "../components/Button";
import { StatusChip } from "../components/StatusChip";
import { SectionHeader } from "../components/SectionHeader";
import { DOCTORS_SEED } from "../data/doctors";
import { useDoctorPhotos } from "../hooks/useDoctorPhotos";
import { initialsFromName, formatRsd } from "../utils/format";
import { nextWeekDays, timeSlotsFromTo, weekdayShort } from "../utils/date";
import { useState } from "react";

export function DoctorProfilePage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const doctor = DOCTORS_SEED.find((d) => d.id === id);
  const { photos } = useDoctorPhotos("medkarton-doctors", DOCTORS_SEED.length);
  const idx = DOCTORS_SEED.findIndex((d) => d.id === id);
  const photo = idx >= 0 ? photos[idx] : undefined;

  const [activeDayIdx, setActiveDayIdx] = useState(1);
  const days = nextWeekDays(new Date(), 5);
  const slots = timeSlotsFromTo(9, 16, 30);

  if (!doctor) {
    return (
      <AppShell>
        <div className="py-20 text-center text-ink-soft">
          Lekar nije pronađen.{" "}
          <Link to="/lekari" className="text-primary-600">
            Nazad na listu
          </Link>
        </div>
      </AppShell>
    );
  }

  const inits = initialsFromName(doctor.firstName, doctor.lastName);

  return (
    <AppShell>
      <div className="mb-4 flex items-center gap-2">
        <Button variant="ghost" size="sm" leftIcon={<ArrowLeft2 size="16" />} onClick={() => navigate(-1)}>
          Nazad
        </Button>
        <span className="text-sm font-semibold text-ink-soft">Profil lekara</span>
      </div>

      <header className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary-600 to-primary-700 p-6 text-white sm:p-8">
        <div className="absolute -right-8 -top-8 size-44 rounded-full bg-white/10" />
        <div className="relative flex flex-col items-center gap-5 sm:flex-row sm:items-end">
          <Avatar
            initials={inits}
            src={photo}
            alt={`${doctor.firstName} ${doctor.lastName}`}
            size="xl"
            className="ring-4 ring-white/30"
          />
          <div className="flex-1 text-center sm:text-left">
            <h1 className="text-2xl font-extrabold sm:text-3xl">
              Dr. {doctor.firstName} {doctor.lastName}
            </h1>
            <p className="mt-1 text-sm text-primary-100">Specijalista, {doctor.specialty}</p>
            <div className="mt-3 flex flex-wrap justify-center gap-2 sm:justify-start">
              {doctor.availableToday && (
                <StatusChip tone="success" icon={<TickCircle size="14" />}>
                  Dostupan danas
                </StatusChip>
              )}
              <StatusChip tone="neutral" className="bg-white/15 text-white">
                {doctor.workplace}
              </StatusChip>
            </div>
          </div>
        </div>

        <div className="relative mt-6 grid grid-cols-3 gap-3">
          <Stat label="Ocena" value={`${doctor.rating.toFixed(1)}`} icon={<Star1 size="16" variant="Bold" />} />
          <Stat label="Pregledi" value={`${doctor.reviews}`} />
          <Stat label="Iskustvo" value={`${doctor.experienceYears}+ god.`} />
        </div>
      </header>

      <div className="mt-6 grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <SectionHeader title="O lekaru" />
          <Card>
            <p className="text-sm leading-relaxed text-ink-muted">{doctor.bio}</p>
            <dl className="mt-4 grid gap-3 text-sm sm:grid-cols-2">
              <Row icon={<Hospital size="16" />} label="Ustanova" value={doctor.workplace} />
              <Row icon={<Location size="16" />} label="Grad" value={doctor.city} />
              <Row icon={<Money3 size="16" />} label="Cena pregleda" value={formatRsd(doctor.price)} />
              <Row
                icon={<Message size="16" />}
                label="Jezici"
                value={doctor.languages.join(", ")}
              />
            </dl>
          </Card>

          <SectionHeader title="Dostupni termini" className="mt-8" />
          <Card>
            <div className="no-scrollbar flex gap-2 overflow-x-auto pb-1">
              {days.map((d, i) => {
                const active = i === activeDayIdx;
                return (
                  <button
                    key={i}
                    type="button"
                    onClick={() => setActiveDayIdx(i)}
                    className={
                      "flex min-w-[60px] flex-col items-center gap-0.5 rounded-xl border px-3 py-2 text-center transition " +
                      (active
                        ? "border-primary-600 bg-primary-50 text-primary-700"
                        : "border-surface-border bg-white text-ink-soft hover:bg-surface-subtle")
                    }
                  >
                    <span className="text-[11px] font-medium">{weekdayShort(d)}</span>
                    <span className="text-base font-bold">{d.getDate()}</span>
                  </button>
                );
              })}
            </div>

            <div className="mt-4 grid grid-cols-3 gap-2 sm:grid-cols-4 lg:grid-cols-5">
              {slots.map((slot, i) => (
                <Link
                  key={slot}
                  to={`/zakazivanje/${doctor.id}?date=${isoDate(days[activeDayIdx])}&time=${encodeURIComponent(slot)}`}
                  className={
                    "rounded-xl border px-3 py-2 text-center text-sm font-semibold transition " +
                    (i === 2
                      ? "border-primary-600 bg-primary-50 text-primary-700"
                      : "border-surface-border bg-white text-ink-soft hover:border-primary-300 hover:text-primary-700")
                  }
                >
                  {slot}
                </Link>
              ))}
            </div>
          </Card>

          <div className="mt-6 flex flex-col gap-3 sm:flex-row">
            <Link
              to={`/zakazivanje/${doctor.id}`}
              className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl bg-primary-600 px-5 py-3 text-sm font-semibold text-white shadow-soft transition hover:bg-primary-700"
            >
              <CalendarTick size="18" variant="Bulk" /> Zakaži termin
            </Link>
            <Button variant="secondary" size="lg" block leftIcon={<Message size="16" />}>
              Pošalji poruku
            </Button>
          </div>
        </div>

        <aside className="space-y-6">
          <SectionHeader title="Radno vreme" />
          <Card>
            <ul className="space-y-2 text-sm">
              {["Ponedeljak", "Utorak", "Sreda", "Četvrtak", "Petak"].map((day) => (
                <li key={day} className="flex items-center justify-between">
                  <span className="text-ink-soft">{day}</span>
                  <span className="inline-flex items-center gap-1 font-semibold text-ink">
                    <Clock size="14" /> 09:00 – 16:00
                  </span>
                </li>
              ))}
              <li className="flex items-center justify-between">
                <span className="text-ink-soft">Subota / Nedelja</span>
                <span className="font-semibold text-ink-faint">Zatvoreno</span>
              </li>
            </ul>
          </Card>

          <SectionHeader title="Lokacija" />
          <Card>
            <div className="flex items-center gap-3 text-sm">
              <span className="inline-flex size-10 items-center justify-center rounded-xl bg-primary-50 text-primary-700">
                <Hospital size="18" variant="Bulk" />
              </span>
              <div>
                <p className="font-semibold text-ink">{doctor.workplace}</p>
                <p className="text-ink-soft">{doctor.city}, Srbija</p>
              </div>
            </div>
          </Card>
        </aside>
      </div>
    </AppShell>
  );
}

function Stat({ label, value, icon }: { label: string; value: string; icon?: React.ReactNode }) {
  return (
    <div className="rounded-2xl bg-white/15 px-3 py-3 text-center backdrop-blur">
      <p className="text-[11px] uppercase tracking-wide text-primary-100">{label}</p>
      <p className="mt-1 inline-flex items-center gap-1 text-base font-bold">
        {icon}
        {value}
      </p>
    </div>
  );
}

function Row({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-center gap-3">
      <span className="inline-flex size-9 items-center justify-center rounded-xl bg-primary-50 text-primary-700">
        {icon}
      </span>
      <div>
        <dt className="text-[11px] font-medium uppercase tracking-wide text-ink-faint">{label}</dt>
        <dd className="text-sm font-semibold text-ink">{value}</dd>
      </div>
    </div>
  );
}

function isoDate(d: Date) {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}
