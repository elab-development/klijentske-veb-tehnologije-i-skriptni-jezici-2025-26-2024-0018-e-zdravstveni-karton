import { useEffect, useMemo, useState } from "react";
import { fetchPublicHolidays } from "../services/api";
import type { PublicHoliday } from "../types";

export function useHolidays(year: number, countryCode = "RS") {
  const [holidays, setHolidays] = useState<PublicHoliday[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    setLoading(true);
    fetchPublicHolidays(year, countryCode)
      .then((data) => {
        if (active) setHolidays(data);
      })
      .catch((err: unknown) => {
        if (active) setError(err instanceof Error ? err.message : "Greška.");
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, [year, countryCode]);

  const map = useMemo(() => {
    const m = new Map<string, PublicHoliday>();
    holidays.forEach((h) => m.set(h.date, h));
    return m;
  }, [holidays]);

  return {
    holidays,
    loading,
    error,
    isHoliday: (date: string) => map.has(date),
    holidayFor: (date: string) => map.get(date),
  };
}
