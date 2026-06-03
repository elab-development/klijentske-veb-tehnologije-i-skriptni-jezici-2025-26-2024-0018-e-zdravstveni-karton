import type { Appointment, Doctor, AppointmentType } from "../types";
import { LocalStore, StorageKeys } from "../utils/storage";

export interface IScheduler {
  list(): Appointment[];
  upcoming(): Appointment[];
  add(appointment: Appointment): Appointment;
  cancel(id: string): void;
  isSlotTaken(doctorId: string, date: string, time: string): boolean;
}

export class AppointmentScheduler implements IScheduler {
  private readonly store = new LocalStore<Appointment[]>(StorageKeys.appointments);
  private cache: Appointment[];

  constructor(initial: Appointment[] = []) {
    this.cache = this.store.load() ?? initial;
    if (!this.store.load()) {
      this.store.save(this.cache);
    }
  }

  list(): Appointment[] {
    return [...this.cache].sort((a, b) =>
      `${a.date}T${a.time}`.localeCompare(`${b.date}T${b.time}`),
    );
  }

  upcoming(): Appointment[] {
    const now = new Date();
    return this.list().filter((a) => {
      const dt = new Date(`${a.date}T${a.time}`);
      return a.status === "zakazan" && dt.getTime() >= now.getTime();
    });
  }

  past(): Appointment[] {
    const now = new Date();
    return this.list().filter((a) => {
      const dt = new Date(`${a.date}T${a.time}`);
      return a.status !== "zakazan" || dt.getTime() < now.getTime();
    });
  }

  add(appointment: Appointment): Appointment {
    this.cache = [...this.cache, appointment];
    this.store.save(this.cache);
    return appointment;
  }

  cancel(id: string): void {
    this.cache = this.cache.map((a) =>
      a.id === id ? { ...a, status: "otkazan" } : a,
    );
    this.store.save(this.cache);
  }

  isSlotTaken(doctorId: string, date: string, time: string): boolean {
    return this.cache.some(
      (a) =>
        a.doctorId === doctorId &&
        a.date === date &&
        a.time === time &&
        a.status === "zakazan",
    );
  }

  static priceFor(doctor: Doctor, type: AppointmentType): number {
    if (type === "Kontrolni pregled") return Math.round(doctor.price * 0.6);
    if (type === "Konsultacija") return Math.round(doctor.price * 0.8);
    return doctor.price;
  }

  static durationFor(type: AppointmentType): number {
    if (type === "Kontrolni pregled") return 15;
    if (type === "Konsultacija") return 20;
    return 30;
  }
}
