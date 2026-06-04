import { useMemo, useState } from "react";
import {
  ArrowLeft2,
  ArrowRight2,
  Calendar,
  Clock,
  InfoCircle,
  Money3,
  TickCircle,
} from "../components/icons";
import { Link, useNavigate, useParams, useSearchParams } from "react-router-dom";
import { AppShell } from "../components/AppShell";
import { Avatar } from "../components/Avatar";
import { Card } from "../components/Card";
import { Button } from "../components/Button";
import { StatusChip } from "../components/StatusChip";
import { DOCTORS_SEED } from "../data/doctors";
import {
  formatLongDate,
  isoDate,
  nextWeekDays,
  timeSlotsFromTo,
  weekdayShort,
} from "../utils/date";
import { initialsFromName, formatRsd, classNames } from "../utils/format";
import { useAppointments } from "../context/AppointmentsContext";
import { AppointmentScheduler } from "../models/AppointmentScheduler";
import { useHolidays } from "../hooks/useHolidays";
import type { AppointmentType } from "../types";

const STEPS = ["Datum", "Vreme", "Tip", "Potvrda"] as const;

export function BookingPage() {
  const { doctorId } = useParams();
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const { add, isSlotTaken } = useAppointments();

  const doctor = DOCTORS_SEED.find((d) => d.id === doctorId) ?? DOCTORS_SEED[0];
  const days = useMemo(() => nextWeekDays(new Date(), 10), []);
  const presetDate = params.get("date");
  const presetTime = params.get("time");

  const [step, setStep] = useState(0);
  const [date, setDate] = useState<string>(presetDate ?? isoDate(days[1]));
  const [time, setTime] = useState<string>(presetTime ?? "");
  const [type, setType] = useState<AppointmentType>("Redovan pregled");
  const [notes, setNotes] = useState("");
  const [confirmed, setConfirmed] = useState(false);

  const year = new Date(date).getFullYear();
  const { isHoliday, holidayFor } = useHolidays(year);

  const slots = useMemo(() => timeSlotsFromTo(9, 16, 30), []);

  const price = AppointmentScheduler.priceFor(doctor, type);
  const duration = AppointmentScheduler.durationFor(type);

  function next() {
    if (step === 0 && !date) return;
    if (step === 1 && !time) return;
    setStep((s) => Math.min(STEPS.length - 1, s + 1));
  }
  function back() {
    setStep((s) => Math.max(0, s - 1));
  }

  function confirmBooking() {
    if (!date || !time) return;
    const id = `a-${Date.now()}`;
    add({
      id,
      doctorId: doctor.id,
      doctorName: `Dr. ${doctor.firstName} ${doctor.lastName}`,
      specialty: doctor.specialty,
      date,
      time,
      type,
      durationMin: duration,
      price,
      status: "zakazan",
      notes: notes.trim() || undefined,
      createdAt: new Date().toISOString(),
    });
    setConfirmed(true);
  }

  if (confirmed) {
    return (
      <AppShell>
        <div className="mx-auto max-w-lg pt-6 text-center">
          <div className="mx-auto mb-4 inline-flex size-16 items-center justify-center rounded-full bg-success-50 text-success-600">
            <TickCircle size="36" variant="Bulk" />
          </div>
          <h1 className="text-2xl font-extrabold text-ink">Termin je zakazan!</h1>
          <p className="mt-2 text-sm text-ink-soft">
            Poslali smo vam potvrdu na email. Možete pogledati ili otkazati termin u sekciji
            "Termini".
          </p>
          <Card className="mt-6 text-left">
            <div className="flex items-center gap-3">
              <Avatar
                initials={initialsFromName(doctor.firstName, doctor.lastName)}
                size="md"
              />
              <div>
                <p className="text-sm font-bold text-ink">
                  Dr. {doctor.firstName} {doctor.lastName}
                </p>
                <p className="text-xs text-ink-soft">
                  {doctor.specialty} · {doctor.city}
                </p>
              </div>
            </div>
            <dl className="mt-4 grid grid-cols-2 gap-3 text-sm">
              <SummaryRow label="Datum" value={formatLongDate(new Date(date))} />
              <SummaryRow label="Vreme" value={time} />
              <SummaryRow label="Tip" value={type} />
              <SummaryRow label="Trajanje" value={`${duration} min`} />
              <SummaryRow label="Cena" value={formatRsd(price)} />
            </dl>
          </Card>
          <div className="mt-6 flex flex-col gap-2 sm:flex-row sm:justify-center">
            <Button variant="secondary" onClick={() => navigate("/zakazivanja")}>
              Moji termini
            </Button>
            <Button onClick={() => navigate("/")}>Nazad na početnu</Button>
          </div>
        </div>
      </AppShell>
    );
  }

  const slotTaken = time ? isSlotTaken(doctor.id, date, time) : false;

  return (
    <AppShell>
      <div className="mb-4 flex items-center gap-2">
        <Button
          variant="ghost"
          size="sm"
          leftIcon={<ArrowLeft2 size="16" />}
          onClick={() => navigate(-1)}
        >
          Nazad
        </Button>
        <span className="text-sm font-semibold text-ink-soft">Zakazivanje pregleda</span>
      </div>

      <Card className="mb-4">
        <div className="flex items-center gap-3">
          <Avatar
            initials={initialsFromName(doctor.firstName, doctor.lastName)}
            size="md"
          />
          <div className="flex-1">
            <p className="text-sm font-bold text-ink">
              Dr. {doctor.firstName} {doctor.lastName}
            </p>
            <p className="text-xs text-ink-soft">
              {doctor.specialty} · {doctor.city}
            </p>
          </div>
          <StatusChip tone="primary">{formatRsd(doctor.price)}</StatusChip>
        </div>
      </Card>

      <ol className="mb-6 flex items-center gap-2 text-xs">
        {STEPS.map((s, i) => {
          const active = i === step;
          const done = i < step;
          return (
            <li key={s} className="flex flex-1 items-center gap-2">
              <span
                className={classNames(
                  "inline-flex size-7 shrink-0 items-center justify-center rounded-full font-bold",
                  done
                    ? "bg-success-500 text-white"
                    : active
                    ? "bg-primary-600 text-white"
                    : "bg-surface-alt text-ink-faint",
                )}
              >
                {done ? <TickCircle size="14" variant="Bold" /> : i + 1}
              </span>
              <span
                className={classNames(
                  "hidden font-semibold sm:inline",
                  active ? "text-ink" : done ? "text-success-700" : "text-ink-faint",
                )}
              >
                {s}
              </span>
              {i < STEPS.length - 1 && (
                <span
                  className={classNames(
                    "ml-1 hidden h-px flex-1 sm:block",
                    done ? "bg-success-300" : "bg-surface-border",
                  )}
                />
              )}
            </li>
          );
        })}
      </ol>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          {step === 0 && (
            <Card>
              <h2 className="text-base font-bold text-ink">Izaberite datum</h2>
              <p className="mt-1 text-xs text-ink-soft">
                Vikendi i državni praznici nisu dostupni za zakazivanje.
              </p>
              <div className="no-scrollbar mt-4 grid grid-cols-5 gap-2 overflow-x-auto sm:grid-cols-10">
                {days.map((d) => {
                  const iso = isoDate(d);
                  const weekend = d.getDay() === 0 || d.getDay() === 6;
                  const holiday = isHoliday(iso);
                  const disabled = weekend || holiday;
                  const active = iso === date;
                  return (
                    <button
                      key={iso}
                      type="button"
                      disabled={disabled}
                      onClick={() => setDate(iso)}
                      className={classNames(
                        "flex flex-col items-center gap-0.5 rounded-xl border px-2 py-2 text-center transition",
                        disabled && "cursor-not-allowed opacity-40",
                        active
                          ? "border-primary-600 bg-primary-50 text-primary-700"
                          : "border-surface-border bg-white text-ink-soft hover:bg-surface-subtle",
                      )}
                      title={holiday ? holidayFor(iso)?.localName : undefined}
                    >
                      <span className="text-[10px] font-medium">{weekdayShort(d)}</span>
                      <span className="text-sm font-bold">{d.getDate()}</span>
                    </button>
                  );
                })}
              </div>
              {date && isHoliday(date) && (
                <p className="mt-3 inline-flex items-center gap-1 text-xs text-warning-700">
                  <InfoCircle size="14" /> {holidayFor(date)?.localName} (praznik)
                </p>
              )}
            </Card>
          )}

          {step === 1 && (
            <Card>
              <h2 className="text-base font-bold text-ink">Izaberite vreme</h2>
              <p className="mt-1 text-xs text-ink-soft">
                Dostupna su slobodna mesta od 09:00 do 16:00.
              </p>
              <div className="mt-4 grid grid-cols-3 gap-2 sm:grid-cols-4 lg:grid-cols-5">
                {slots.map((s) => {
                  const taken = isSlotTaken(doctor.id, date, s);
                  const active = s === time;
                  return (
                    <button
                      key={s}
                      type="button"
                      onClick={() => setTime(s)}
                      disabled={taken}
                      className={classNames(
                        "rounded-xl border px-3 py-2 text-sm font-semibold transition",
                        taken && "cursor-not-allowed bg-surface-alt text-ink-faint",
                        active
                          ? "border-primary-600 bg-primary-50 text-primary-700"
                          : "border-surface-border bg-white text-ink-soft hover:border-primary-300",
                      )}
                    >
                      {s}
                    </button>
                  );
                })}
              </div>
              {slotTaken && (
                <p className="mt-3 inline-flex items-center gap-1 text-xs text-danger-700">
                  <InfoCircle size="14" /> Termin je već zauzet, odaberite drugo vreme.
                </p>
              )}
            </Card>
          )}

          {step === 2 && (
            <Card>
              <h2 className="text-base font-bold text-ink">Tip pregleda</h2>
              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                {(
                  [
                    { value: "Redovan pregled", desc: "30 min · puna anamneza", iconTone: "primary" },
                    { value: "Kontrolni pregled", desc: "15 min · brza kontrola", iconTone: "success" },
                    { value: "Konsultacija", desc: "20 min · razgovor sa lekarom", iconTone: "primary" },
                  ] as { value: AppointmentType; desc: string; iconTone: "primary" | "success" }[]
                ).map((opt) => {
                  const active = type === opt.value;
                  return (
                    <button
                      key={opt.value}
                      type="button"
                      onClick={() => setType(opt.value)}
                      className={classNames(
                        "rounded-2xl border bg-white p-4 text-left transition",
                        active
                          ? "border-primary-600 shadow-soft ring-4 ring-primary-100"
                          : "border-surface-border hover:bg-surface-subtle",
                      )}
                    >
                      <p className="text-sm font-bold text-ink">{opt.value}</p>
                      <p className="mt-1 text-xs text-ink-soft">{opt.desc}</p>
                      <p className="mt-3 text-sm font-bold text-primary-700">
                        {formatRsd(AppointmentScheduler.priceFor(doctor, opt.value))}
                      </p>
                    </button>
                  );
                })}
              </div>

              <div className="mt-5">
                <label className="label" htmlFor="notes">
                  Beleške za lekara (opciono)
                </label>
                <textarea
                  id="notes"
                  rows={3}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="input-field"
                  placeholder="Kratak opis simptoma ili razloga posete..."
                />
              </div>
            </Card>
          )}

          {step === 3 && (
            <Card>
              <h2 className="text-base font-bold text-ink">Pregled i potvrda</h2>
              <dl className="mt-4 grid gap-3 sm:grid-cols-2">
                <SummaryRow icon={<Calendar size="16" />} label="Datum" value={formatLongDate(new Date(date))} />
                <SummaryRow icon={<Clock size="16" />} label="Vreme" value={`${time} (${duration} min)`} />
                <SummaryRow label="Tip pregleda" value={type} />
                <SummaryRow icon={<Money3 size="16" />} label="Cena" value={formatRsd(price)} />
                {notes && (
                  <div className="sm:col-span-2">
                    <dt className="text-[11px] font-medium uppercase tracking-wide text-ink-faint">
                      Vaše beleške
                    </dt>
                    <dd className="mt-1 rounded-xl bg-surface-subtle px-3 py-2 text-sm text-ink-muted">
                      {notes}
                    </dd>
                  </div>
                )}
              </dl>
              <div className="mt-4 rounded-xl bg-primary-50 px-4 py-3 text-xs text-primary-800">
                <InfoCircle size="14" className="-mt-0.5 mr-1 inline-block" />
                Možete otkazati termin do 24h pre zakazanog vremena bez naknade.
              </div>
            </Card>
          )}

          <div className="mt-6 flex items-center justify-between">
            <Button
              variant="secondary"
              onClick={back}
              disabled={step === 0}
              leftIcon={<ArrowLeft2 size="16" />}
            >
              Nazad
            </Button>
            {step < STEPS.length - 1 ? (
              <Button onClick={next} rightIcon={<ArrowRight2 size="16" />}>
                Nastavi
              </Button>
            ) : (
              <Button onClick={confirmBooking} leftIcon={<TickCircle size="16" />}>
                Potvrdi zakazivanje
              </Button>
            )}
          </div>
        </div>

        <aside>
          <Card>
            <h3 className="text-sm font-bold text-ink">Sažetak</h3>
            <div className="mt-3 flex items-center gap-3 border-b border-surface-border pb-3">
              <Avatar
                initials={initialsFromName(doctor.firstName, doctor.lastName)}
                size="md"
              />
              <div>
                <p className="text-sm font-semibold text-ink">
                  Dr. {doctor.firstName} {doctor.lastName}
                </p>
                <p className="text-xs text-ink-soft">{doctor.specialty}</p>
              </div>
            </div>
            <ul className="mt-3 space-y-2 text-sm">
              <li className="flex items-center justify-between">
                <span className="text-ink-soft">Datum</span>
                <span className="font-semibold text-ink">
                  {date ? formatLongDate(new Date(date)) : "/"}
                </span>
              </li>
              <li className="flex items-center justify-between">
                <span className="text-ink-soft">Vreme</span>
                <span className="font-semibold text-ink">{time || "/"}</span>
              </li>
              <li className="flex items-center justify-between">
                <span className="text-ink-soft">Tip</span>
                <span className="font-semibold text-ink">{type}</span>
              </li>
              <li className="flex items-center justify-between border-t border-dashed border-surface-border pt-2">
                <span className="text-ink-soft">Cena</span>
                <span className="text-base font-extrabold text-primary-700">
                  {formatRsd(price)}
                </span>
              </li>
            </ul>
            <p className="mt-4 text-center text-[11px] text-ink-faint">
              Potreban je važeći zdravstveni karton.{" "}
              <Link to="/profil" className="text-primary-600">
                Proveri profil
              </Link>
            </p>
          </Card>
        </aside>
      </div>
    </AppShell>
  );
}

function SummaryRow({
  icon,
  label,
  value,
}: {
  icon?: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div>
      <dt className="inline-flex items-center gap-1 text-[11px] font-medium uppercase tracking-wide text-ink-faint">
        {icon}
        {label}
      </dt>
      <dd className="mt-1 text-sm font-semibold text-ink">{value}</dd>
    </div>
  );
}
