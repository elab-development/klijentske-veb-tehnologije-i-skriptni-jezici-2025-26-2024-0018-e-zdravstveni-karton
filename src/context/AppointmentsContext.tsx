import { createContext, useCallback, useContext, useMemo, useRef, useState } from "react";
import type { ReactNode } from "react";
import { AppointmentScheduler } from "../models/AppointmentScheduler";
import { APPOINTMENTS_SEED } from "../data/appointments";
import type { Appointment } from "../types";

interface AppointmentsContextValue {
  appointments: Appointment[];
  upcoming: Appointment[];
  past: Appointment[];
  add: (a: Appointment) => Appointment;
  cancel: (id: string) => void;
  isSlotTaken: (doctorId: string, date: string, time: string) => boolean;
  scheduler: AppointmentScheduler;
}

const AppointmentsContext = createContext<AppointmentsContextValue | undefined>(undefined);

export function AppointmentsProvider({ children }: { children: ReactNode }) {
  const schedulerRef = useRef<AppointmentScheduler | null>(null);
  if (!schedulerRef.current) {
    schedulerRef.current = new AppointmentScheduler(APPOINTMENTS_SEED);
  }
  const scheduler = schedulerRef.current;
  const [version, setVersion] = useState(0);

  const refresh = useCallback(() => setVersion((v) => v + 1), []);

  const add = useCallback(
    (a: Appointment) => {
      const created = scheduler.add(a);
      refresh();
      return created;
    },
    [scheduler, refresh],
  );

  const cancel = useCallback(
    (id: string) => {
      scheduler.cancel(id);
      refresh();
    },
    [scheduler, refresh],
  );

  const isSlotTaken = useCallback(
    (doctorId: string, date: string, time: string) =>
      scheduler.isSlotTaken(doctorId, date, time),
    [scheduler],
  );

  const value = useMemo<AppointmentsContextValue>(() => {
    void version;
    return {
      appointments: scheduler.list(),
      upcoming: scheduler.upcoming(),
      past: scheduler.past(),
      add,
      cancel,
      isSlotTaken,
      scheduler,
    };
  }, [scheduler, add, cancel, isSlotTaken, version]);

  return (
    <AppointmentsContext.Provider value={value}>{children}</AppointmentsContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useAppointments(): AppointmentsContextValue {
  const ctx = useContext(AppointmentsContext);
  if (!ctx) throw new Error("useAppointments must be used within AppointmentsProvider");
  return ctx;
}
