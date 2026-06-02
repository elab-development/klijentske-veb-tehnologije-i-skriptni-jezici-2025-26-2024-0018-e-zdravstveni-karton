import type { Appointment } from "../types";

function inDays(offset: number): string {
  const d = new Date();
  d.setDate(d.getDate() + offset);
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

export const APPOINTMENTS_SEED: Appointment[] = [
  {
    id: "a-001",
    doctorId: "d-001",
    doctorName: "Dr. Ana Nikolić",
    specialty: "Kardiolog",
    date: inDays(1),
    time: "10:30",
    type: "Redovan pregled",
    durationMin: 30,
    price: 3500,
    status: "zakazan",
    createdAt: new Date().toISOString(),
  },
  {
    id: "a-002",
    doctorId: "d-002",
    doctorName: "Dr. Jovan Marković",
    specialty: "Neurolog",
    date: inDays(7),
    time: "14:00",
    type: "Kontrolni pregled",
    durationMin: 15,
    price: 2400,
    status: "zakazan",
    createdAt: new Date().toISOString(),
  },
  {
    id: "a-003",
    doctorId: "d-005",
    doctorName: "Dr. Jelena Pavlović",
    specialty: "Dermatolog",
    date: inDays(-14),
    time: "09:30",
    type: "Redovan pregled",
    durationMin: 30,
    price: 4200,
    status: "obavljen",
    createdAt: new Date().toISOString(),
  },
];
