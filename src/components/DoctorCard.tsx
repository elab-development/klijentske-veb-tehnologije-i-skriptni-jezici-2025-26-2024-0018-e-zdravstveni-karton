import { Link } from "react-router-dom";
import { Location, Money3, Star1 } from "./icons";
import type { Doctor } from "../types";
import { Avatar } from "./Avatar";
import { StatusChip } from "./StatusChip";
import { Card } from "./Card";
import { initialsFromName, formatRsd } from "../utils/format";

interface Props {
  doctor: Doctor;
  photoUrl?: string;
}

export function DoctorCard({ doctor, photoUrl }: Props) {
  const initials = initialsFromName(doctor.firstName, doctor.lastName);
  return (
    <Card className="flex flex-col gap-4">
      <div className="flex items-start gap-3">
        <Avatar initials={initials} src={photoUrl} alt={`${doctor.firstName} ${doctor.lastName}`} size="lg" />
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <h3 className="truncate text-base font-bold text-ink">
              Dr. {doctor.firstName} {doctor.lastName}
            </h3>
            {doctor.availableToday ? (
              <StatusChip tone="success">Dostupan danas</StatusChip>
            ) : (
              <StatusChip tone="neutral">Nije dostupan danas</StatusChip>
            )}
          </div>
          <p className="text-sm text-primary-700">{doctor.specialty}</p>
          <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-ink-soft">
            <span className="inline-flex items-center gap-1">
              <Star1 size="14" variant="Bold" className="text-warning-500" />
              <strong className="text-ink">{doctor.rating.toFixed(1)}</strong>
              <span className="text-ink-faint">({doctor.reviews})</span>
            </span>
            <span className="inline-flex items-center gap-1">
              <Location size="14" /> {doctor.city}
            </span>
            <span className="inline-flex items-center gap-1">
              <Money3 size="14" /> {formatRsd(doctor.price)}
            </span>
          </div>
        </div>
      </div>

      <div className="flex gap-2">
        <Link to={`/lekari/${doctor.id}`} className="btn-secondary flex-1 !py-2.5">
          Pogledaj profil
        </Link>
        <Link
          to={`/zakazivanje/${doctor.id}`}
          className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl bg-primary-600 px-4 py-2.5 text-sm font-semibold text-white shadow-soft transition hover:bg-primary-700"
        >
          Zakaži termin
        </Link>
      </div>
    </Card>
  );
}

